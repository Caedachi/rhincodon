import { Client } from 'discord.js';
import { inject, injectable, multiInject } from 'inversify';
import { TYPES } from './types';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { Command } from './command';

@injectable()
export class RhincodonBot {
    private client: Client;
    private readonly token: string;
    private readonly clientId: string;
    private readonly guildId: string;
    private readonly commands: Command[];
    private mapper: Map<string, Command>;

    constructor(
        @inject(Client) client: Client,
        @inject(TYPES.secrets.discordToken) token: string,
        @inject(TYPES.config.clientId) clientId: string,
        @inject(TYPES.config.guildId) guildId: string,
        @multiInject(TYPES.constants.commands) commands: Command[],
        @inject(TYPES.constants.map) map: Map<string, Command>
    ) {
        this.client = client;
        this.token = token;
        this.clientId = clientId;
        this.guildId = guildId;
        this.commands = commands;
        this.mapper = map;
    }

    public start() {
        this.client.on('ready', async () => {
            console.log('READY');
            this.commands.forEach(comm => this.mapper.set(comm.definition.name, comm));
            await this.registerCommands();
        });

        this.client.on('interactionCreate', async (interaction) => {
            if (!interaction.isCommand()) {
                return;
            }
            const { commandName, options } = interaction;

            const command = this.mapper.get(commandName);
            if (!!command) {
                await command.handle(interaction);
            }
        });

        return this.client.login(this.token);
    }

    private async registerCommands() {
        const rest = new REST({version: '9'}).setToken(this.token);
        return rest.put(
            Routes.applicationGuildCommands(this.clientId, this.guildId),
            { body: this.commands.map(com => com.definition.toJSON()) }
        )
    }
}
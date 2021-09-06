import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';
import { Client, Intents } from 'discord.js';
import { Echo } from './command/echo-command';
import { Command } from './command/command';
import { RhincodonBot } from './rhincodon-bot';
import * as config from '../config/config.json';

let container = new Container();

// Constants
container.bind<string>(TYPES.secrets.discordToken).toConstantValue(process.env.DISCORD_TOKEN);
container.bind<string>(TYPES.config.clientId).toConstantValue(config.discord.clientId);
container.bind<string>(TYPES.config.guildId).toConstantValue(config.discord.guildId);
container.bind<Map<string, Command>>(TYPES.constants.map).toConstantValue(new Map());
container.bind<Client>(Client).toConstantValue(new Client({
    intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS]
}));

// Commands
container.bind<Command>(TYPES.constants.commands).to(Echo).inSingletonScope();

// Bot
container.bind<RhincodonBot>(RhincodonBot).to(RhincodonBot).inSingletonScope();

export default container;
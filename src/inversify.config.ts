import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';
import { Client, Intents } from 'discord.js';
import { Command } from './model/command';
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

const fs = require('fs');
const commandFiles = fs.readdirSync('src/command').filter(file => file.endsWith('.ts')).map(file => './command/' + file.slice(0,-3));

for (const file of commandFiles){
    const command = require(file).default;
    container.bind<Command>(TYPES.constants.commands).to(command).inSingletonScope();
}

// Bot
container.bind<RhincodonBot>(RhincodonBot).to(RhincodonBot).inSingletonScope();

export default container;

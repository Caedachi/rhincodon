import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { injectable } from 'inversify';
import { Command } from '../model/command';

enum EchoParams {
    name = 'echo',
    message = 'message'
}

@injectable()
export class Echo implements Command {
    readonly definition = new SlashCommandBuilder()
        .setName(EchoParams.name)
        .setDescription('echos back a message')
        .addStringOption(opt => 
            opt.setName(EchoParams.message)
                .setDescription('message to echo')
                .setRequired(true));
    
    async handle(interaction: CommandInteraction): Promise<void> {
        const { options } = interaction;
        const message = options.getString(EchoParams.message);
        await interaction.reply(message);
    }
}

export default Echo;
import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

export interface Command {
    definition: Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'> | SlashCommandSubcommandsOnlyBuilder;
    handle(interaction: CommandInteraction): Promise<void>;
}
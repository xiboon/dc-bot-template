import { type ChatInputCommandInteraction, SlashCommandSubcommandBuilder } from 'discord.js';
import type { Bot } from '../../classes/Bot.js';

export async function run(client: Bot, interaction: ChatInputCommandInteraction) {
    interaction.reply('hi!');
}
export const data = new SlashCommandSubcommandBuilder().setName('test').setDescription('testing');

import { type ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import type { Bot } from '../classes/Bot.js';

export async function run(client: Bot, interaction: ChatInputCommandInteraction) {
    interaction.reply('Pong!');
}
export const data = new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!');

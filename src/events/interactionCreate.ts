import { type ChatInputCommandInteraction, type Interaction, InteractionType } from 'discord.js';
import type { Bot } from '../classes/Bot.js';
import type { Command } from '../types/Interactions.js';

export async function interactionCreate(client: Bot, interaction: Interaction) {
    switch (interaction?.type) {
        case InteractionType.ApplicationCommand:
            if (!interaction.isChatInputCommand()) return;
            const subcommand = interaction.options.getSubcommand(false);
            let command: Command | undefined;
            if (subcommand) {
                command = client.commands.get(`${interaction.commandName}/${subcommand}`);
            } else {
                command = client.commands.get(interaction.commandName);
            }
            try {
                // @ts-expect-error
                command.run(client, interaction);
            } catch (e) {
                console.error(e);
                interaction.reply({ content: 'An error occured.', ephemeral: true });
            }
            break;
        case InteractionType.MessageComponent:
            const [id] = interaction.customId.split('.');
            const component = client.components.get(id);
            try {
                // @ts-expect-error
                component.run(client, interaction);
            } catch (e) {
                console.error(e);
                interaction.reply({ content: 'An error occured.', ephemeral: true });
            }
            break;
        case InteractionType.ModalSubmit:
            const [modalId] = interaction.customId.split('.');
            const modal = client.modals.get(modalId);
            try {
                // @ts-expect-error
                modal.run(client, interaction);
            } catch (e) {
                console.error(e);
                interaction.reply({ content: 'An error occured.', ephemeral: true });
            }
            break;
        case InteractionType.ApplicationCommandAutocomplete:
            let autocomplete: ((client: Bot, interaction: ChatInputCommandInteraction) => void) | undefined;
            if (interaction.options.getSubcommand(false)) {
                autocomplete = client.commands.get(
                    `${interaction.commandName}/${interaction.options.getSubcommand(false)}`,
                )?.autocomplete;
            } else {
                autocomplete = client.commands.get(interaction.commandName)?.autocomplete;
            }
            try {
                // @ts-expect-error
                autocomplete(client, interaction);
            } catch (e) {
                console.error(e);
            }
            break;
    }
}

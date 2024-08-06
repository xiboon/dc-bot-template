import { readdir } from 'node:fs/promises';
import { Client, Collection } from 'discord.js';
import type { Command, MessageComponent, Modal } from '../types/Interactions.js';
import { Custombot } from './CustomBot.js';
export class Bot extends Client {
    commands: Collection<string, Command> = new Collection();
    modals: Map<string, Modal> = new Map();
    components: Map<string, MessageComponent> = new Map();
    events: Map<string, any> = new Map();
    constructor() {
        super({
            intents: [],
        });
        this.init();
    }

    async init() {
        // @ts-expect-error
        this.commands = await this.loadCommands();
        this.events = await this.loadEvents();
        this.modals = (await this.loadFolder<Modal>(new URL('../modals', import.meta.url))).files;
        this.components = (await this.loadFolder<MessageComponent>(new URL('../components', import.meta.url))).files;

        // hardcoded list of tokens, can be changed easily though
        const custombots: string[] = process.env.CUSTOM_BOTS?.split(',') || [];
        for (const token of custombots) {
            const bot = new Custombot(this.commands, this.events, this.modals, this.components);
            bot.login(token);
        }
        this.login();
    }

    async loadEvents() {
        const path = new URL('../events', import.meta.url);
        const { files } = await this.loadFolder(path);
        const events = new Map();
        for (const [name, event] of files) {
            events.set(name, event);
            // @ts-expect-error
            this.on(name, (...args) => event[name](this, ...args));
        }
        return events;
    }

    async loadCommands() {
        const path = new URL('../commands', import.meta.url);
        const { files, directoriesFound } = await this.loadFolder<Command>(path);
        const commands = new Collection();
        for (const [name, command] of files) {
            commands.set(name, command);
        }
        for (const directory of directoriesFound) {
            const path = new URL(`../commands/${directory}`, import.meta.url);
            const { files } = await this.loadFolder<Command>(path);
            for (const [name, command] of files) {
                commands.set(`${directory}/${name}`, command);
            }
        }
        return commands;
    }

    async loadFolder<T>(folder: string | URL): Promise<{ files: Map<string, T>; directoriesFound: string[] }> {
        console.log(`Loading folder ${folder}`);
        const files = new Map();
        const directory = await readdir(folder).catch((e) => {});
        const directoriesFound: string[] = [];
        if (!directory) return { files, directoriesFound };
        for (const file of directory) {
            if (!file.endsWith('.ts')) {
                directoriesFound.push(file);
                continue;
            }
            const path = `${folder}/${file}`;
            const data = await import(path);
            files.set(file.split('.')[0], data);
        }
        return { files, directoriesFound };
    }
}

import { Client, type Collection } from 'discord.js';
import type { Command, MessageComponent, Modal } from '../types/Interactions.js';

export class Custombot extends Client {
    constructor(
        public commands: Collection<string, Command>,
        public events: Map<string, any>,
        public modals: Map<string, Modal>,
        public components: Map<string, MessageComponent>,
    ) {
        super({
            intents: [],
        });
        events.forEach((event, name) => {
            this.on(name, (...args) => event[name](this, ...args));
        });
    }
}

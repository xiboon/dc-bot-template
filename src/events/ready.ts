import type { Bot } from '../classes/Bot.js';
import { deploy } from '../deploy.js';

export async function ready(client: Bot) {
    deploy(client);
    console.log('Ready!', client.user?.tag);
}

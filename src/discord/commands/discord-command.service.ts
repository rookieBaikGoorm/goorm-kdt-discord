import { Injectable } from '@nestjs/common';

import scheduleCommand from './schedule';

@Injectable()
export class DiscordCommandService {
	constructor() {}
    
    private slashCommandList = [scheduleCommand];

	public getRegisteredSlashCommands() {
        return this.slashCommandList.map((slashCommand) =>
            slashCommand.command.toJSON(),
        );     
	}
}

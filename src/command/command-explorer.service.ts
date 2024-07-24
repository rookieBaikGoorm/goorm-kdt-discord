import { Injectable } from '@nestjs/common';
import { ExternalContextCreator, MetadataScanner } from '@nestjs/core';

import { COMMAND_DECORATOR, HANDLER_DECORATOR } from './constants';
import { DiscordCommandService } from './discord-command.service';

@Injectable()
export class DiscordCommandExplorerService {
	constructor(
		private readonly discordCommandService: DiscordCommandService,
		private readonly externalContextCreator: ExternalContextCreator,
		private readonly metadataScanner: MetadataScanner,
	) {}

	async explore(instance: InstanceType<any>) {
		const metadata = this.getCommandDecoratorMetadata(instance);
		if (!metadata) return;

		const commandHandlerList = this.searchHandler(instance);
		this.discordCommandService.registerGuildCommand(instance);
		commandHandlerList.forEach((handler) => {
			this.discordCommandService.addListenerToCommand(instance, handler);
		});
	}

	searchHandler(instance: InstanceType<any>) {
		const methodNames = this.scanAllMethodNames(instance);

		if (methodNames.length < 1) return;

		return methodNames
			.map((methodName) => {
				const metadata = this.getHandlerDecoratorMetadata(
					instance,
					methodName,
				);

				return metadata
					? this.externalContextCreator.create(
							instance,
							instance[methodName],
							methodName,
						)
					: undefined;
			})
			.filter(Boolean);
	}

	private getCommandDecoratorMetadata(instance: InstanceType<any>) {
		return Reflect.getMetadata(COMMAND_DECORATOR, instance);
	}

	private getHandlerDecoratorMetadata(
		instance: InstanceType<any>,
		methodName: string,
	) {
		return Reflect.getMetadata(HANDLER_DECORATOR, instance, methodName);
	}

	private scanAllMethodNames(instance: InstanceType<any>) {
		return this.metadataScanner.getAllMethodNames(instance);
	}
}

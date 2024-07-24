import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import type { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';

import { DiscordCommandExplorerService } from '#/command/command-explorer.service';

@Injectable()
export class ExploreService implements OnModuleInit {
	constructor(
		private readonly discoveryService: DiscoveryService,
		private readonly discordCommandExplorerService: DiscordCommandExplorerService,
	) {}

	private classExploreService = [this.discordCommandExplorerService];

	async onModuleInit(): Promise<void> {
		const providers = this.discoveryService.getProviders();
		const controllers = this.discoveryService.getControllers();
		await this.explore([...providers, ...controllers]);
	}

	private isObject(instance: unknown) {
		return typeof instance === 'object'
			? instance !== null
			: typeof instance === 'function';
	}

	private async explore(instances: InstanceWrapper[]) {
		instances
			.filter((wrapper) => wrapper.isDependencyTreeStatic())
			.filter(
				({ instance }: InstanceWrapper) =>
					instance && this.isObject(instance),
			)
			.forEach(({ instance }) => {
				this.classExploreService.map((classExploreService) =>
					classExploreService.explore(instance),
				);
			});
	}
}

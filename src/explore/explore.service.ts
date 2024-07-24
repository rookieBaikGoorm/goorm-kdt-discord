import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import type { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';

import { DiscordCommandExplorerService } from '#/command/command-explorer.service';

@Injectable()
export class ExploreService implements OnModuleInit {
	constructor(
		private readonly discoveryService: DiscoveryService,
		private readonly discordCommandExplorerService: DiscordCommandExplorerService,
		private readonly metadataScanner: MetadataScanner,
	) {}

	private classExploreService = [this.discordCommandExplorerService];

	async onModuleInit(): Promise<void> {
		const providers = this.discoveryService.getProviders();
		const controllers = this.discoveryService.getControllers();
		await this.exploreDecorators([...providers, ...controllers]);
	}

	private isObject(instance: unknown) {
		return typeof instance === 'object'
			? instance !== null
			: typeof instance === 'function';
	}

	private async exploreDecorators(instances: InstanceWrapper[]) {
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

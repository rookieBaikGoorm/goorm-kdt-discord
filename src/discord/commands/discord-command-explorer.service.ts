import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import type { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';

@Injectable()
export class ExplorerService implements OnModuleInit {
	constructor(
		private readonly discoveryService: DiscoveryService,
		private readonly metadataScanner: MetadataScanner,
	) {}

	async onModuleInit(): Promise<void> {
		const providers = this.discoveryService.getProviders();
		const controllers = this.discoveryService.getControllers();
		await this.exploreDecorators([...providers, ...controllers]);
	}

	private async exploreDecorators(instances: InstanceWrapper[]) {
		instances
			.filter((wrapper) => wrapper.isDependencyTreeStatic())
			.filter(
				({ instance }) => instance && Object.getPrototypeOf(instance),
			)
			.forEach(({ instance }) => {
				const methodNames = this.scanMetadata(instance);
				console.log(methodNames);
			});
	}

	private scanMetadata(instance: InstanceType<any>) {
		return this.metadataScanner.getAllMethodNames(instance);
	}
}

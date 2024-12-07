import type { DynamicModule, Provider } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import type { SapphireClient } from "@sapphire/framework";

import { DISCORD_CLIENT } from "./constant/discord-client.constant";
import { discordConnectionFactory } from "./factory/discord-client.factory";
import { DiscordClientService } from "./service/discord-client.service";

const DiscordClientProvider: Provider<SapphireClient> = {
    provide: DISCORD_CLIENT,
    inject: [ConfigService],
    useFactory: discordConnectionFactory,
}

export class DiscordClientModule {
    static forRoot(): DynamicModule {
        return {
            module: DiscordClientModule,
            imports: [ConfigModule],
			providers: [
                DiscordClientProvider,
				DiscordClientService,
			],

        }
    }
}
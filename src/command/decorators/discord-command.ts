import { Injectable } from '@nestjs/common';

const COMMAND_DECORATOR = Symbol('DISCORD_COMMAND_DECORATOR');

export function Command(): ClassDecorator {
	return <TFunction extends Function>(
		target: TFunction,
	): TFunction | void => {
		Reflect.defineMetadata(COMMAND_DECORATOR, {}, target.prototype);
		Injectable()(target);

		return target;
	};
}

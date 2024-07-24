import { Injectable } from '@nestjs/common';

import { COMMAND_DECORATOR } from '../constants';

export function Command(): ClassDecorator {
	// eslint-disable-next-line @typescript-eslint/ban-types
	return <TFunction extends Function>(
		target: TFunction,
	): TFunction | void => {
		Reflect.defineMetadata(COMMAND_DECORATOR, {}, target.prototype);
		Injectable()(target);

		return target;
	};
}

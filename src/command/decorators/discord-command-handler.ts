import { HANDLER_DECORATOR } from '../constants';

interface CommandHandlerOptions {
        subCommand?: string;        
}

export function CommandHandler(
        handlerOption: CommandHandlerOptions = {},
): MethodDecorator {
	return (
		target: Record<string, any>,
		propertyKey: string | symbol,
		descriptor: PropertyDescriptor,
	): PropertyDescriptor => {
		Reflect.defineMetadata(HANDLER_DECORATOR, handlerOption, target, propertyKey);
		return descriptor;
	};
}

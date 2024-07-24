import { HANDLER_DECORATOR } from '../constants';

export function CommandHandler(): MethodDecorator {
	return (
        target: Record<string, any>,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor,
	): PropertyDescriptor => {
		Reflect.defineMetadata(HANDLER_DECORATOR, {}, target, propertyKey);
        return descriptor;
	};
}

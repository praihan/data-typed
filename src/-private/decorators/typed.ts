import { Constructor } from '../types';
import { modelMetaFor } from './-helpers';
import { TypedValidator } from '../validators/typed';

export default function typedDecorator(type?: Function): Function {
  if (Reflect == null && type == null) {
    throw TypeError('@Typed() requires explicit type in the absence of reflect-metadata');
  }
  return function (target: any, propertyKey: string) {
    const constructor = target.constructor as Constructor;
    const meta = modelMetaFor(constructor);
    const resolvedType = type || Reflect.getMetadata('design:type', target, propertyKey) as Function;
    if (resolvedType == null) {
      throw TypeError(`Could not determine type to check against ${constructor.name}.${propertyKey}`);
    }
    meta.addValidator(propertyKey, new TypedValidator(resolvedType));
  }
}

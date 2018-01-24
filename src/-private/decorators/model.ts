import { Constructor } from '../types';
import { ModelMeta } from '../model';
import { modelMetaFor } from './-helpers';

export default function modelDecorator<T extends Constructor>(): Function {
  return function Model(target: Constructor) {
    createPrototypeAccessors(target);
    return class ModelClass extends target {
      constructor(...args: any[]) {
        super(...args);
        validateAllProperties(target, this);
      }
    }
  };
}

function createPrototypeAccessors(target: Constructor) {
  const meta = modelMetaFor(target);
  const prototype = target.prototype;

  for (let propertyKey of meta.propertyKeys) {
    const propertySymbol = meta.symbolForProperty(propertyKey);
    prototype[propertySymbol] = prototype[propertyKey];

    const closuredPropertyKey = propertyKey;
    Object.defineProperty(prototype, propertyKey, {
      get() {
        return (this as any)[propertySymbol];
      },
      set(value: any) {
        const err = meta.validate(closuredPropertyKey, value);
        if (err != null) throw err;
        (this as any)[propertySymbol] = value;
      },
    });
  }
}

function validateAllProperties(target: Constructor, instance: any) {
  const meta = modelMetaFor(target);
  for (let propertyKey of meta.propertyKeys) {
    const err = meta.validate(propertyKey, instance[propertyKey]);
    if (err != null) throw err;
  }
}

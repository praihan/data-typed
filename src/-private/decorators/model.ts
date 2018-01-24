import { Constructor } from '../types';
import { ModelMeta } from '../model';
import { getModelMeta } from './-helpers';

export default function modelDecorator<T extends Constructor>(): Function {
  return function Model(target: Constructor) {
    return class ModelClass extends target {
      constructor(...args: any[]) {
        super(...args);
        verifyAllProperties(target, this);
        makeAccessors(target, this);
      }
    }
  };
}

function verifyAllProperties(target: Constructor, instance: any) {
  const meta = getModelMeta(target);
  for (let propertyKey of meta.propertyKeys) {
    const err = meta.validate(propertyKey, instance[propertyKey]);
    if (err != null) throw err;
  }
}

function makeAccessors(target: Constructor, instance: any) {
  const meta = getModelMeta(target);
  for (let propertyKey of meta.propertyKeys) {
    const propertySymbol = meta.symbolForProperty(propertyKey);
    instance[propertySymbol] = instance[propertyKey];

    Object.defineProperty(instance, propertyKey, {
      enumerable: true,
      get() {
        return instance[propertySymbol];
      },
      set(value: any) {
        const err = meta.validate(propertyKey, value);
        if (err != null) throw err;
        instance[propertySymbol] = value;
      },
    });
  }
}

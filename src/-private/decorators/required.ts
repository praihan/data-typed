import { Constructor } from '../types';
import { getModelMeta, getModelMetaUnchecked } from './-helpers';
import { RequiredValidator } from '../validators/required';

export default function requiredDecorator(): Function {
  return function (target: any, propertyKey: string) {
    const constructor = target.constructor as Constructor;
    const meta = getModelMeta(constructor);
    meta.addValidator(propertyKey, new RequiredValidator<any>());
  }
}

import { IValidator, ModelMeta } from '../model';

export class RequiredValidator<T> implements IValidator<T> {
  validate(meta: ModelMeta, propertyName: string, value: T): Error | null | undefined {
    if (value == null) return TypeError(`${meta.target.name} requires ${propertyName}`);
  }
}
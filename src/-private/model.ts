import { Constructor } from './types';

export const META_KEY = '__DataTypedMetaKey__';

export interface IValidator<T> {
  validate(meta: ModelMeta, propertyKey: string, value: T): Error | null | undefined;
};

export class ModelMeta {
  public validators = new Map<string, IValidator<any>[]>();
  public target: Constructor;

  constructor(target: Constructor) {
    this.target = target;
  }

  validatorsFor<T>(propertyKey: string): IValidator<T>[] {
    let propValidators: IValidator<T>[];
    if (this.validators.has(propertyKey)) {
      propValidators = this.validators.get(propertyKey) as IValidator<T>[];
    } else {
      propValidators = [];
      this.validators.set(propertyKey, propValidators);
    }
    return propValidators;
  }

  addValidator<T>(propertyKey: string, validator: IValidator<T>): void {
    this.validatorsFor(propertyKey).push(validator);
  }

  validate<T>(propertyKey: string, value: T): Error | null | undefined {
    for (let validator of this.validatorsFor(propertyKey)) {
      const err = validator.validate(this, propertyKey, value);
      if (err != null) {
        return err;
      }
    }
  }

  get propertyKeys(): string[] {
    return Array.from(this.validators.keys());
  }
}

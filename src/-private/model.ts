import { Constructor } from './types';

export const META_KEY = Symbol.for('ModelMeta');

export interface IValidator<T> {
  validate(meta: ModelMeta, propertyKey: string, value: T): Error | null | undefined;
};

export class ModelMeta {
  public target: Constructor;

  private validators = new Map<string, IValidator<any>[]>();

  public constructor(target: Constructor) {
    this.target = target;
  }

  public validatorsFor<T>(propertyKey: string): IValidator<T>[] {
    let propValidators: IValidator<T>[];
    if (this.validators.has(propertyKey)) {
      propValidators = this.validators.get(propertyKey) as IValidator<T>[];
    } else {
      propValidators = [];
      this.validators.set(propertyKey, propValidators);
    }
    return propValidators;
  }

  public addValidator<T>(propertyKey: string, validator: IValidator<T>): void {
    this.validatorsFor(propertyKey).push(validator);
  }

  public validate<T>(propertyKey: string, value: T): Error | null | undefined {
    for (let validator of this.validatorsFor(propertyKey)) {
      const err = validator.validate(this, propertyKey, value);
      if (err != null) {
        return err;
      }
    }
  }

  public symbolForProperty(propertyKey: string): symbol {
    return Symbol.for(propertyKey);
  }

  public get propertyKeys(): string[] {
    return Array.from(this.validators.keys());
  }
}

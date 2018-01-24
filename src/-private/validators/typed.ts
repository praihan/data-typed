import { IValidator, ModelMeta } from '../model';

const useTypeOfOperatorTypes: Function[] = [
  Boolean,
  Number,
  String,
  Symbol,
];

export class TypedValidator implements IValidator<any> {
  constructor(private type: Function) { }

  validate(meta: ModelMeta, propertyName: string, value: any): Error | null | undefined {
    if (value == null) return;
    const makeError = () => TypeError(`${meta.target.name} requires ${propertyName} to be of type ${this.type.name}`);
    if (useTypeOfOperatorTypes.includes(this.type)) {
      return typeof value === this.type.name.toLowerCase() ?
        null :
        makeError();
    }
    if (!(value instanceof this.type)) {
      return makeError();
    }
  }
}
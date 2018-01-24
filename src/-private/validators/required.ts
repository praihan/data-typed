import { IValidator, ModelMeta } from '../model';

export class RequiredValidator implements IValidator<any> {
  validate(meta: ModelMeta, propertyName: string, value: any): Error | null | undefined {
    if (value == null) return TypeError(`${meta.target.name} requires ${propertyName}`);
  }
}
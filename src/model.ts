import { Constructor, ObjectLiteral } from './common';

export default function modelDecorator<T extends Constructor>(): Function {
  return function Model(target: Constructor, key: string) {
    return class extends target {
      constructor(data: ObjectLiteral) {
        console.log(Reflect.getMetadata('design:types', target, key));
        super();
      }
    }
  };
}
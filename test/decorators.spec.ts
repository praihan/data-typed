import { expect } from 'chai';
import 'mocha';
import 'reflect-metadata';

import { createSandbox, getSandbox, destroySandbox } from './support/helpers';

import {
  Model,
  Required,
  Typed
} from '../src/data-typed';

class AggregateType {
  constructor(properties?: {}) {
    for (let key of Object.keys(properties || {})) {
      (this as any)[key] = (properties as any)[key];
    }
  }
}

beforeEach((done) => {
  createSandbox();
  done();
});

afterEach((done) => {
  destroySandbox();
  done();
});

describe('@Typed() test', () => {
  @Model() class ConcreteType extends AggregateType { @Typed() name: string; }
  @Model() class ExplicitType extends AggregateType { @Typed(String) name: any; }

  it('throws if type cannot be determined', () => {
    const sandbox = getSandbox();
    sandbox.stub(Reflect, 'getMetadata').returns(undefined);
    expect(() => {
      @Model() class VirtualType extends AggregateType { @Typed() name: any; }
    }).to.throw('Could not determine type to check against VirtualType.name');
  });

  const types = [
    { name: 'ConcreteType', type: ConcreteType },
    { name: 'ExplicitType', type: ExplicitType }
  ].forEach(({ name, type }) => {
    it(`throws if wrong type when constructed (${name})`, () => {
      expect(() => new type({ name: {} })).to.throw(`${name} requires name to be of type String`);
    });
  
    it(`works if no data when constructed (${name})`, () => {
      expect(() => new type()).to.not.throw();
    });
  
    it(`works if correct type when constructed (${name})`, () => {
      const data = new type({ name: 'John' });
      expect(data.name).to.eq('John');
    });
  
    it(`works if correct type assigned after construction (${name})`, () => {
      const data = new type();
      data.name = 'John';
      expect(data.name).to.eq('John');
    });

    it(`throws if assigned to wrong type after construction (${name})`, () => {
      const data = new type({ name: 'John' });
      expect(() => (data as any).name = 5).to.throw(`${name} requires name to be of type String`)
    });

    it(`works if assigned null after construction (${name})`, () => {
      const data = new type({ name: 'John' });
      data.name = null;
      expect(data.name).to.eq(null);
    });
  });

});

describe('@Required() test', () => {
  @Model()
  class RequiredData extends AggregateType { @Required() name: string; }

  it('throws error if no data', () => {
    expect(() => new RequiredData()).to.throw('RequiredData requires name');
  });

  it('works if data exists', () => {
    const data = new RequiredData({ name: 'John' });
    expect(data.name).to.eq('John');
    data.name = 'David';
    expect(data.name).to.eq('David');
  });

  it('throws if attempt to nullify after construction', () => {
    const data = new RequiredData({ name: 'John' });
    expect(() => (data as any).name = null).to.throw('RequiredData requires name');
    expect(data.name).to.eq('John');
    expect(() => (data as any).name = undefined).to.throw('RequiredData requires name');
  });
});

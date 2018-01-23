import { expect } from 'chai';
import 'mocha';

import { Model, Required } from '../src/data-typed';

@Model()
class SampleData {
  @Required() name: string;

  constructor(name?: string) {
    this.name = name;
  }
}

describe('@Required() test', () => {
  it('throws error if no data', () => {
    expect(() => new SampleData()).to.throw('SampleData', 'requires');
  });

  it('correctly includes data', () => {
    const data = new SampleData('John');
    expect(data.name).to.eq('John');
  });

  it('allows data to change after construction', () => {
    const data = new SampleData('John');
    expect(data.name).to.eq('John');
    data.name = 'David';
    expect(data.name).to.eq('David');
  });

  it('errors if attempt to unset after construction', () => {
    const data = new SampleData('John');
    expect(() => data.name = null).to.throw('SampleData', 'requires');
  });
});

import DummyClass from '../src/data-typed';

import { expect } from 'chai';
import 'mocha';

/**
 * Dummy test
 */
describe('Dummy test', () => {
  it('works if true is truthy', () => {
    expect(true).to.be.true;
  })

  it('DummyClass is instantiable', () => {
    expect(new DummyClass()).to.be.instanceof(DummyClass);
  });
});

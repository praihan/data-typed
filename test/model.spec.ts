import 'reflect-metadata';
import Model from '../src/model';
import 'mocha';

describe('Model decorator test', () => {
  it('works', () => {
    @Model()
    class SampleData {
      hello: String;
    }
    new SampleData();
  });
});

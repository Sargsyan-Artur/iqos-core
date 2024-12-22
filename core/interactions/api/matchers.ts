import { expect } from 'chai';
import Assertion = Chai.Assertion;
// eslint-disable-next-line import/no-extraneous-dependencies,import/order
import * as Spec from 'pactum/src/models/Spec';
import { memory } from '../../utils/memory';
import { timeouts } from '../../configs/timeouts';

export class Matchers {
  /* eslint-disable class-methods-use-this */

  public validatePropertyType(
    objectToValidate: object,
    property: string,
    propertyType: string
  ): Assertion | Error {
    return expect(typeof objectToValidate[property]).to.equal(propertyType);
  }

  public async validateSchema(
    requestAlias: string,
    schema: object
  ): Promise<void> {
    const request = memory.getValues(requestAlias) as Spec;

    await request
      .withRequestTimeout(timeouts.DEFAULT_WAIT)
      .inspect()
      .expectJsonSchema(schema)
      .useLogLevel('INFO')
      .toss();
  }
}

import { Locator } from '@playwright/test';
import { expect } from 'chai';
import { VerifyInput } from '../../interfaces/element';
import { VALIDATIONS } from '../../helpers/validations';
import { memory } from '../../utils/memory';
import Assertion = Chai.Assertion;

export class Expects {
  constructor(public collection: Locator) {}

  public validationFns = {
    [VALIDATIONS.INCLUDE_MEMBERS]: (
      expectClause: Chai.Assertion,
      ER: string[]
    ) => expectClause.to.include.members(ER),
    [VALIDATIONS.BE]: (expectClause: Chai.Assertion, ER: string): Assertion =>
      expectClause.be(ER),
    [VALIDATIONS.HAVE_PROPERTY]: (
      expectClause: Chai.Assertion,
      ER: string
    ): Assertion => expectClause.have.property(ER),
    [VALIDATIONS.HAVE_MEMBERS]: (
      expectClause: Chai.Assertion,
      ER: string[]
    ): Assertion => expectClause.have.members(ER),
    [VALIDATIONS.DEEP_EQUAL]: (expectClause: Chai.Assertion, ER: string[]) =>
      expectClause.deep.equal(ER),
    [VALIDATIONS.MATCH]: (expectClause: Chai.Assertion, ER: string) => {
      const regExp = new RegExp(ER);
      return expectClause.match(regExp);
    }
  };

  public numberValidationFns = {
    [VALIDATIONS.EQUAL]: (
      expectClause: Chai.Assertion,
      ER: number | Date
    ): Assertion => expectClause.equal(ER),
    [VALIDATIONS.GREATER]: (
      expectClause: Chai.Assertion,
      ER: number | Date
    ): Assertion => expectClause.be.above(ER),
    [VALIDATIONS.LOWER]: (
      expectClause: Chai.Assertion,
      ER: number | Date
    ): Assertion => expectClause.be.below(ER)
  };

  // eslint-disable-next-line class-methods-use-this
  private getExpectClause({ actualResult, reverse }): Chai.Assertion {
    return reverse ? expect(actualResult).to.not : expect(actualResult).to;
  }

  public async verifyText({
    actualResult,
    expectedResult,
    validation,
    reverse
  }: VerifyInput): Promise<Assertion | Error> {
    // eslint-disable-next-line no-param-reassign
    actualResult = memory.getValues(actualResult);
    // eslint-disable-next-line no-param-reassign
    expectedResult = memory.getValues(expectedResult);
    const expectClause: Chai.Assertion = this.getExpectClause({
      actualResult,
      reverse
    });
    const validate = this.validationFns[validation];

    return validate(expectClause, expectedResult);
  }

  public async verifyNumber({
    actualResult,
    expectedResult,
    validation,
    reverse
  }: VerifyInput): Promise<Assertion | Error> {
    // eslint-disable-next-line no-param-reassign
    expectedResult = memory.getValues(expectedResult);
    const expectClause: Chai.Assertion = this.getExpectClause({
      actualResult,
      reverse
    });
    const validate = this.numberValidationFns[validation];

    return validate(expectClause, Number(expectedResult));
  }
}

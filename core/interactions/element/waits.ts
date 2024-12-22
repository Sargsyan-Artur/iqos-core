import { Locator } from '@playwright/test';
import { VALIDATIONS } from '../../helpers/validations';
import { timeouts } from '../../configs/timeouts';

export class Waits {
  constructor(public element: Locator) {}

  public waitValidations = {
    [VALIDATIONS.VISIBLE]: async () =>
      this.element.waitFor({
        state: 'visible',
        timeout: timeouts.STEP_WAIT
      }),
    [VALIDATIONS.HIDDEN]: async () =>
      this.element.waitFor({
        state: 'hidden',
        timeout: timeouts.STEP_WAIT
      }),
    [VALIDATIONS.ATTACHED]: async () =>
      this.element.waitFor({
        state: 'attached',
        timeout: timeouts.STEP_WAIT
      }),
    [VALIDATIONS.DETACHED]: async () =>
      this.element.waitFor({
        state: 'detached',
        timeout: timeouts.STEP_WAIT
      })
  };

  waitFor(waitValidation): Promise<void> {
    return this.waitValidations[waitValidation]();
  }
}

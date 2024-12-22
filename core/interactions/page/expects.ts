import { expect } from 'chai';
import Assertion = Chai.Assertion;

import { memory } from '../../utils/memory';
import { PageHandler } from './page.handler';
import { screenshotComparison } from '../../screenshot-testing/screenshot-test';
import { timeouts } from '../../configs/timeouts';
import { removeFolder } from '../../helpers/helperFunctions';

export class Expects extends PageHandler {
  public async toHaveURL(url): Promise<void> {
    // eslint-disable-next-line no-param-reassign
    url = memory.getValue(url);
    expect(this.page.url()).to.contain(url);
  }

  public async toMatchRegexp(
    text: string,
    reverse: boolean
  ): Promise<Assertion> {
    const regExp = new RegExp(text);

    return reverse
      ? expect(this.page.url()).to.not.match(regExp)
      : expect(this.page.url()).to.match(regExp);
  }

  public async toMatchScreenshot(expectedScreenshotPath) {
    const path = `screenshots/actual-${await this.page.title()}.png`;
    removeFolder('./screenshots');
    await this.page.waitForTimeout(timeouts.SCREENSHOT_WAIT);

    const actualScreenshot = await this.page.screenshot({ path });

    const mismatchedPixels = await screenshotComparison(
      actualScreenshot,
      expectedScreenshotPath
    );

    expect(mismatchedPixels).to.equal(0);
  }
}

import { Locator } from '@playwright/test';
import { Waits } from './waits';
import { Expects } from './expects';
import { Actions } from './actions';
import { IElementConfig } from '../../interfaces/element';
import { ElementHandler } from './element.handler';

export class Element extends ElementHandler {
  public actions: Actions;

  public expects: Expects;

  public waits: Waits;

  constructor(elementConfigOrPwLocator: IElementConfig | Locator) {
    super(elementConfigOrPwLocator);
    this.actions = new Actions(this.element);
    this.expects = new Expects(this.element);
    this.waits = new Waits(this.element);
  }

  public get locator(): string {
    return this.elementConfig.locator;
  }

  static init(locator: string): Element {
    return new Element({ locator });
  }

  public nth(index): Element {
    return new Element(this.element.nth(index));
  }
}

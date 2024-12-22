import { Locator } from '@playwright/test';

export class Actions {
  constructor(public element: Locator) {}

  async click(options?): Promise<void> {
    return this.element.click(options);
  }

  async fill(text, options?): Promise<void> {
    return this.element.fill(text, options);
  }

  async type(text, options?): Promise<void> {
    return this.element.type(text, options);
  }

  async clear(options?): Promise<void> {
    return this.element.clear(options);
  }

  async checkCheckbox(options?): Promise<void> {
    return this.element.check(options);
  }

  async isChecked(options?): Promise<boolean> {
    return this.element.isChecked(options);
  }

  async select(value, options?): Promise<string | string[]> {
    return this.element.selectOption(value, options);
  }

  async selectByText(text, options?): Promise<string | string[]> {
    return this.element.selectOption({ label: text }, options);
  }

  async dblClick(options?): Promise<void> {
    return this.element.dblclick(options);
  }

  async hover(options?): Promise<void> {
    return this.element.hover(options);
  }

  async keyPress(text, options?): Promise<void> {
    return this.element.press(text, options);
  }

  async dragAndDrop(dropElement, options?): Promise<void> {
    return this.element.dragTo(dropElement, options);
  }

  async getText(options?): Promise<string> {
    return this.element.textContent(options);
  }

  async getAttribute(name, options?): Promise<string> {
    return this.element.getAttribute(name, options);
  }

  async getBoundingBox(options?): Promise<{
    x: number;
    y: number;
    width: number;
    height: number;
  }> {
    return this.element.boundingBox(options);
  }

  async getCount(): Promise<number> {
    return this.element.count();
  }

  async getInputValue(options?): Promise<string> {
    return this.element.inputValue(options);
  }

  async scrollIntoView(options?): Promise<void> {
    return this.element.scrollIntoViewIfNeeded(options);
  }

  async tap(options?): Promise<void> {
    return this.element.tap(options);
  }

  async inputFiles(path, options?): Promise<void> {
    return this.element.setInputFiles(path, options);
  }
}

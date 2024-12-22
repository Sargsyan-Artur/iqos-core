import { IPOLocators } from '../interfaces/poHandler';

export abstract class POComponent {
  abstract readonly name: string;
  abstract get locators(): IPOLocators;
}

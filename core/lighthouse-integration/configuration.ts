import { screenEmulationMetrics } from './constants';
import { ILighthouseOpt } from '../interfaces/lighthouse';

export const options: ILighthouseOpt = {
  chromeFlags: ['--show-paint-rects'],
  output: 'html'
};

export const config = {
  desktop: {
    extends: 'lighthouse:default',
    settings: {
      formFactor: 'desktop',
      screenEmulation: screenEmulationMetrics.desktop
    }
  },
  mobile: {
    extends: 'lighthouse:default'
  }
};

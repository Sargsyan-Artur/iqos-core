import { createHtmlReport } from 'axe-html-reporter';
import AxeBuilder from '@axe-core/playwright';
import { Logger } from 'winston';
import fs from 'fs';

import { logger } from '../../utils/logger';
import { PageHandler } from './page.handler';

export class Accessibility extends PageHandler {
  private log: Logger = logger('ACCESSIBILITY');

  async checkAxe(): Promise<void> {
    try {
      const results = await new AxeBuilder({ page: this.page }).analyze();
      const reportHTML = createHtmlReport({
        results,
        options: {
          projectKey: 'Axe HTML report',
          doNotCreateReportFile: true
        }
      });
      fs.writeFileSync('reports/axe-report.html', reportHTML);
    } catch (error) {
      this.log.error(error);
    }
  }
}

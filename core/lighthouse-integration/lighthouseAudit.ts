import lighthouse from 'lighthouse';
import fs from 'fs';
import { options, config } from './configuration';
import { log } from '../utils/logger';

/**
 * User generates lighthouse report for both mobile and desktop devices
 * @param pageUrl - path to the certain Page
 * @param debuggingPort - should be a port set in provider with args like {headless: false,
 * args: ["--remote-debugging-port=${process.env.DEBUG_PORT}"]} process.env.DEBUG_PORT===9999
 * @param device - 'mobile', 'desktop'
 *
 * @example: await generateLighthouseReport(homePage.url, 'mobile')
 */
export async function generateLighthouseReport(
  pageUrl: string,
  configOptions: any
): Promise<void> {
  options.port = configOptions.debugPort;
  options.extraHeaders = configOptions.extraHeaders;
  try {
    const lighthouseResult = await lighthouse(
      pageUrl,
      options,
      config[`${configOptions.device}`]
    );
    const reportHtml = lighthouseResult.report;
    fs.writeFileSync('LighthouseReport.html', reportHtml);

    log.info(
      `Report for ${lighthouseResult.lhr.finalUrl} is successfully generated`
    );
  } catch (error) {
    log.error('Failed to generate lighthouse report with message:', error);
  }
}

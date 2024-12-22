import fs from 'fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { logger } from '../utils/logger';
import { config } from '../configs/config';

const log = logger('SCREENSHOT');

export async function screenshotComparison(
  actualScreenshot,
  expectedScreenshotPath
) {
  const diffImagePath = 'screenshots/diff_screenshot.png';

  if (fs.existsSync(diffImagePath)) {
    fs.unlinkSync(diffImagePath);
  }
  // Load the expected screenshot from the file
  const expectedScreenshot = fs.readFileSync(expectedScreenshotPath);
  // Convert the buffers to PNG images
  const actualImage = PNG.sync.read(actualScreenshot);
  const expectedImage = PNG.sync.read(expectedScreenshot);

  // Create an empty image buffer to store the diff
  const diffImage = new PNG({
    width: expectedImage.width,
    height: expectedImage.height
  });

  // Compare the images and get the number of mismatched pixels
  const mismatchedPixels = pixelmatch(
    actualImage.data,
    expectedImage.data,
    diffImage.data,
    expectedImage.width,
    expectedImage.height,
    { threshold: config.screenshotTestingThreshold }
  );

  if (mismatchedPixels > 0) {
    fs.writeFileSync(diffImagePath, PNG.sync.write(diffImage));
    log.error(`Visual differences found between actual and expected screenshots.
                        See difference in  ${diffImagePath}`);
  }
  return mismatchedPixels;
}

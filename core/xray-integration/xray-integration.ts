import axios, { AxiosResponse } from 'axios';
import fs from 'fs';
import 'dotenv/config';

import FormData from 'form-data';
import { xrayEndpoints } from './xray-endpoints';
import { xrayHeaders } from './xray-config';
import { logger } from '../utils/logger';
import {
  convertRuledFeatureToUnRuled,
  extractFeatureTags,
  getTags,
  putTags,
  readFolder,
  removeFolder,
  replaceTagsToRealFeature,
  extractScenarioDescriptions
} from './xray-helpers';
import {
  payloadForLabelsAndDescription,
  payloadForSort
} from './xray-payloads';

const log = logger('XRAY');

export async function updateTests(payload: object, issueKey: string) {
  try {
    await axios.put(xrayEndpoints.updateIssue(issueKey), payload, {
      headers: xrayHeaders.basic
    });
    log.info('Test issue updated successfully in Xray');
  } catch (error) {
    log.error(`Error updating test issue in Xray: ${error}`);
  }
}

export async function uploadTestCases(projectKey: string, featurePath: string) {
  const testKeys = [];
  const formData = new FormData();
  formData.append('file', fs.createReadStream(featurePath));
  const USKeyRegexp = /[A-Z]+-\d+/;
  const containsUserStoryTag = extractFeatureTags(featurePath).some((elem) =>
    USKeyRegexp.test(elem)
  );

  if (extractFeatureTags(featurePath).length !== 0 && containsUserStoryTag) {
    const allDescriptions = extractScenarioDescriptions(featurePath);
    try {
      const response: AxiosResponse = await axios.post(
        xrayEndpoints.createFeature(projectKey),
        formData,
        {
          headers: xrayHeaders.multipart
        }
      );

      response.data.forEach((data) => {
        testKeys.push(data.key);
        putTags(data.key, featurePath);
      });
      for (let i = 0; i < testKeys.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await updateTests(
          // eslint-disable-next-line no-await-in-loop
          await payloadForLabelsAndDescription(
            featurePath,
            testKeys[i],
            allDescriptions[i]
          ),
          testKeys[i]
        );
      }

      log.info(
        `Tests are successfully created in Xray under following keys:\n${testKeys.join(
          ',\n'
        )}`
      );
    } catch (error) {
      log.error(`Error creating test issue in Xray: ${error}`);
    }
  } else {
    log.error('Please add user story key on the top as a tag');
  }
}

export async function uploadTestCasesFromFolder(
  projectKey: string,
  featurePath: string
) {
  const files = readFolder(featurePath);

  /* eslint-disable no-await-in-loop, no-restricted-syntax */
  for (const file of files) {
    log.info(`Feature: ${file}`);

    const featureFileContent = fs.readFileSync(file, 'utf8');
    if (featureFileContent.includes('Rule:')) {
      convertRuledFeatureToUnRuled(featureFileContent);
      await uploadTestCasesFromFolder(projectKey, 'featuresWithRule');
      replaceTagsToRealFeature(featurePath, 'featuresWithRule');
      removeFolder('featuresWithRule');
    } else {
      await uploadTestCases(projectKey, file);
    }
  }
}

export async function uploadTests(projectKey: string, featurePath: string) {
  if (!featurePath.includes('.feature')) {
    await uploadTestCasesFromFolder(projectKey, featurePath);
  } else {
    const featureFileContent = fs.readFileSync(featurePath, 'utf8');
    if (featureFileContent.includes('Rule:')) {
      convertRuledFeatureToUnRuled(featureFileContent);
      await uploadTestCasesFromFolder(projectKey, 'featuresWithRule');
      replaceTagsToRealFeature(featurePath, 'featuresWithRule');
      removeFolder('featuresWithRule');
    } else {
      await uploadTestCases(projectKey, featurePath);
    }
  }
}

export async function uploadResults(projectKey: string) {
  let executionKey = '';
  const keys: string[] = [];
  const executionSummary: string[] = [];

  const reportPath = 'reports/cucumber-report.json';
  const reportContent: string = fs.readFileSync(reportPath, 'utf-8');

  try {
    const response = await axios.post(
      xrayEndpoints.createResults,
      reportContent,
      { headers: xrayHeaders.basic }
    );
    const responseKeys = await response.data.testIssues.success;
    executionKey = response.data.testExecIssue.key;

    responseKeys.forEach((responseKey) => {
      keys.push(responseKey.key);
    });

    log.info(`Test results imported successfully in Xray, ${executionKey}`);
  } catch (error) {
    log.error(`Error importing test results in Xray: ${error}`);
  }

  getTags(reportContent, executionSummary, projectKey);

  const payload = payloadForSort(executionSummary, keys);

  await updateTests(payload, executionKey);
}

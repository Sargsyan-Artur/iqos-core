import { xrayConfig } from './xray-config';

export const xrayEndpoints = {
  createResults: `${xrayConfig.baseUrl}/rest/raven/1.0/import/execution/cucumber`,
  createFeature: (project: string) =>
    `${xrayConfig.baseUrl}/rest/raven/1.0/import/feature?projectKey=${project}`,
  updateIssue: (testCase: string) =>
    `${xrayConfig.baseUrl}/rest/api/2/issue/${testCase}`
};

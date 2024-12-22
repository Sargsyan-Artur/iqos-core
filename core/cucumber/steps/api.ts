import { DataTable, When, Then } from '@cucumber/cucumber';
import * as Spec from 'pactum/src/models/Spec';
import Api from '../../interactions/api/api';
import { memory } from '../../utils/memory';
import { dataTableToObject, docStringToObject } from '../../utils/pactUtils';
import { timeouts } from '../../configs/timeouts';

When(
  'I create {string} request for {string} endpoint and save it as {string}',
  (requestType: string, endpoint: string, requestAlias: string) => {
    const request = Api.actions.createRequest(requestType, endpoint);
    memory.set(requestAlias, request);
  }
);

When(
  'I create {string} request to mock provider {string} endpoint and save it as {string}',
  (requestType: string, endpoint: string, requestAlias: string) => {
    const request = Api.actions.createRequestAgainstMockProvider(
      requestType,
      endpoint
    );
    memory.set(requestAlias, request);
  }
);

When(
  'I add headers to {string}:',
  (requestAlias: string, headersDataTable: DataTable) => {
    const header = dataTableToObject(headersDataTable);
    Api.actions.addHeaderToRequest(requestAlias, header);
  }
);

When(
  'I add body to {string}:',
  async (requestAlias: string, bodyDocString: string) => {
    const body = docStringToObject(bodyDocString);
    Api.actions.addBodyToRequest(requestAlias, body);
  }
);

When(
  'I add GraphQL query to {string}:',
  async (requestAlias: string, grapQLQuery: string) => {
    Api.actions.addGraphQLQueryToRequest(requestAlias, grapQLQuery);
  }
);

When(
  'I add GraphQL query variables to {string}:',
  async (requestAlias: string, variablesDataTable: DataTable) => {
    const graphQLVariables = await dataTableToObject(variablesDataTable);
    Api.actions.addGraphQLVariablesToRequest(requestAlias, graphQLVariables);
  }
);

When('I send the {string} request', async (requestAlias: string) => {
  await Api.actions.sendRequest(requestAlias);
});

When(
  'I send the {string} request and save the response as {string}',
  async (requestAlias: string, responseAlias: string) => {
    const response = await Api.actions.sendRequest(requestAlias);
    memory.set(responseAlias, response);
  }
);

Then(
  'the {string} response should have {int} status code',
  async (requestAlias: string, status: number) => {
    const request = memory.getValues(requestAlias) as Spec;
    request.response().to.have.status(status);
  }
);

Then(
  'the response body for {string} request should contain{isArray} {string} property with {string} value',
  async (
    requestAlias: string,
    isArray: boolean,
    property: string,
    propertyType: string
    // eslint-disable-next-line max-params
  ) => {
    const response = memory.getValues(requestAlias);
    if (isArray) {
      (response as Array<object>).forEach((singleObject) => {
        Api.matchers.validatePropertyType(singleObject, property, propertyType);
      });
    } else {
      Api.matchers.validatePropertyType(
        response as object,
        property,
        propertyType
      );
    }
  }
);

Then(
  'I send the {string} request and the response body should be according to {data} schema',
  { timeout: timeouts.STEP_WAIT },
  async (requestAlias: string, schema: object) => {
    await Api.matchers.validateSchema(requestAlias, schema);
  }
);

Then(
  'JSON {string} should{reverse} {validation} {string} text',
  { timeout: timeouts.STEP_WAIT },
  /* eslint-disable max-params */ async (
    path: string,
    reverse: boolean,
    validation: string,
    expectedResult: string
  ) => {
    const actualResult = await Api.actions.parseJson(path);
    await {
      actualResult,
      expectedResult,
      validation,
      reverse
    };
  }
);

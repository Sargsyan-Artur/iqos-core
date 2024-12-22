import { DataTable, When } from '@cucumber/cucumber';
import Pact from '../../interactions/pact/pact';
import { memory } from '../../utils/memory';
import { dataTableToObject, docStringToObject } from '../../utils/pactUtils';

When(
  'I create a pact interaction with {string} method and with {string} path and save it as {string}',
  (requestType: string, endpoint: string, interactionAlias: string) => {
    const request = Pact.actions.createPact(requestType, endpoint);
    memory.set(interactionAlias, request);
  }
);
When(
  'I have the following state for the {string} interaction: {string}',
  (interactionAlias: string, stateText: string) => {
    Pact.actions.addStatusDescriptionToPact(interactionAlias, stateText);
  }
);

When(
  'I add the following expectation for the {string} interaction response: {string}',
  (interactionAlias: string, description: string) => {
    Pact.actions.addExpectedResponseDescriptionToPact(
      interactionAlias,
      description
    );
  }
);

When(
  'I add headers to {string} interaction request:',
  async (interactionAlias: string, headersDataTable: DataTable) => {
    const header = await dataTableToObject(headersDataTable);
    await Pact.actions.addRequestHeaderToPact(interactionAlias, header);
  }
);

When(
  'I add body to {string} interaction request:',
  async (interactionAlias: string, bodyDocString: string) => {
    const body = docStringToObject(bodyDocString);
    await Pact.actions.addRequestBodyToPact(interactionAlias, body);
  }
);

When(
  'I add GraphQL query to {string} interaction request:',
  async (interactionAlias: string, grapQLQuery: string) => {
    await Pact.actions.addGraphQLQueryToPact(interactionAlias, grapQLQuery);
  }
);

When(
  'I add GraphQL query variables to {string} interaction request:',
  async (interactionAlias: string, variablesDataTable: DataTable) => {
    const graphQLVariables = await dataTableToObject(variablesDataTable);
    await Pact.actions.addGraphQLVariablesToPact(
      interactionAlias,
      graphQLVariables
    );
  }
);

When(
  'I add {int} status code to {string} interaction response',
  async (statusCode: number, interactionAlias: string) => {
    await Pact.actions.addResponseStatusToPact(interactionAlias, statusCode);
  }
);

When(
  'I add headers to {string} interaction response:',
  async (interactionAlias: string, headersDataTable: DataTable) => {
    const header = await dataTableToObject(headersDataTable);
    await Pact.actions.addResponseHeaderToPact(interactionAlias, header);
  }
);

When(
  'I add body to {string} interaction response:',
  async (interactionAlias: string, bodyDocString: string) => {
    const body = docStringToObject(bodyDocString);
    await Pact.actions.addResponseBodyToPact(interactionAlias, body);
  }
);

When('I save the {string} interaction', async (interactionAlias: string) => {
  await Pact.actions.addInteractionToPact(interactionAlias);
});

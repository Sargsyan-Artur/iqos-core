// eslint-disable-next-line import/no-extraneous-dependencies
import { regex } from '@pact-foundation/pact/src/dsl/matchers';
// eslint-disable-next-line import/no-extraneous-dependencies
import { extend } from 'lodash';
// eslint-disable-next-line import/no-extraneous-dependencies
import { HTTPMethod } from '@pact-foundation/pact/src/common/request';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Pact, InteractionObject, Query } from '@pact-foundation/pact';
import { memory } from '../../utils/memory';
import { config } from '../../configs/config';
import { escapeGraphQlQuery } from './helpers';

export interface GraphQLBody {
  query: object;
  variables: object;
}
export interface RequestOptionsWithGraphQL {
  method: HTTPMethod;
  path: string;
  query?: Query;
  headers?: Headers;
  body?: GraphQLBody;
}
export interface BaseInteractionObject {
  withRequest: RequestOptionsWithGraphQL;
  willRespondWith: object;
}

export class Actions {
  /* eslint-disable class-methods-use-this */
  public createPact(
    requestType: string,
    endpoint: string
  ): BaseInteractionObject {
    const pathWithoutBaseUrl = endpoint.replace(config.apiBaseURL, '');

    return {
      withRequest: {
        path: pathWithoutBaseUrl,
        method: requestType.toUpperCase() as HTTPMethod
      },
      willRespondWith: {}
    };
  }

  public addStatusDescriptionToPact(
    interactionAlias: string,
    stateText: string
  ): void {
    const pact = memory.getValues(interactionAlias) as InteractionObject;
    pact.state = stateText;
  }

  public addExpectedResponseDescriptionToPact(
    interactionAlias: string,
    description: string
  ): void {
    const pact = memory.getValues(interactionAlias) as InteractionObject;
    pact.uponReceiving = description;
  }

  public addRequestHeaderToPact(interactionAlias: string, header): void {
    const pact = memory.getValues(interactionAlias) as InteractionObject;
    pact.withRequest.headers = header;
  }

  public addRequestBodyToPact(interactionAlias: string, body): void {
    const pact = memory.getValues(interactionAlias) as InteractionObject;
    pact.withRequest.body = body;
  }

  public addResponseStatusToPact(interactionAlias: string, status): void {
    const pact = memory.getValues(interactionAlias) as InteractionObject;
    pact.willRespondWith.status = status;
  }

  public addResponseHeaderToPact(interactionAlias: string, header): void {
    const pact = memory.getValues(interactionAlias) as InteractionObject;
    pact.willRespondWith.headers = header;
  }

  public addResponseBodyToPact(interactionAlias: string, body): void {
    const pact = memory.getValues(interactionAlias) as InteractionObject;
    pact.willRespondWith.body = body;
  }

  // eslint-disable-next-line class-methods-use-this
  public addGraphQLQueryToPact(interactionAlias: string, grapQLQuery): void {
    const pact = memory.getValues(interactionAlias) as InteractionObject;
    // eslint-disable-next-line no-param-reassign
    grapQLQuery = grapQLQuery.replace(/\n/g, '');
    pact.withRequest.body = extend({
      query: regex({
        generate: grapQLQuery,
        matcher: escapeGraphQlQuery(grapQLQuery)
      })
    });
  }

  addGraphQLVariablesToPact(interactionAlias: string, graphQLVariables): void {
    const pact = memory.getValues(interactionAlias) as BaseInteractionObject;
    pact.withRequest.body.variables = graphQLVariables;
  }

  // eslint-disable-next-line class-methods-use-this
  public async addInteractionToPact(interactionAlias: string): Promise<void> {
    const pact = memory.getValues(interactionAlias) as InteractionObject;
    const provider = memory.getValues('$mockProvider') as Pact;
    await provider.addInteraction(pact);
  }
}

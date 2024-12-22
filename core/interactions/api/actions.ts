import * as Spec from 'pactum/src/models/Spec';
import { spec } from 'pactum';
import { IncomingMessage } from 'http';
import fs from 'fs';
import { memory } from '../../utils/memory';
import { config } from '../../configs/config';

export class Actions {
  /* eslint-disable class-methods-use-this */
  public createRequest(requestType: string, endpoint: string): Spec {
    return spec()[requestType](endpoint);
  }

  public async createRequestSpecial(
    requestType: string,
    endpoint: string
  ): Promise<Spec> {
    return (
      spec()
        // eslint-disable-next-line no-unexpected-multiline
        [requestType](endpoint)
        .withHeaders()
        .withBody()
    );
  }

  public createRequestAgainstMockProvider(
    requestType: string,
    endpoint: string
  ): Spec {
    const URL = endpoint.replace(config.apiBaseURL, config.mockProviderURL);
    return spec()[requestType](URL);
  }

  public addHeaderToRequest(requestAlias: string, header): void {
    const request = memory.getValues(requestAlias) as Spec;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    request.withHeaders(header);
  }

  public addBodyToRequest(requestAlias: string, body): void {
    const request = memory.getValues(requestAlias) as Spec;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    request.withBody(body);
  }

  public addGraphQLQueryToRequest(requestAlias: string, grapQLQuery): void {
    const request = memory.getValues(requestAlias) as Spec;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    request.withGraphQLQuery(grapQLQuery.replace(/\n/g, ''));
  }

  public addGraphQLVariablesToRequest(
    requestAlias: string,
    graphQLVariables
  ): void {
    const request = memory.getValues(requestAlias) as Spec;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    request.withGraphQLVariables(graphQLVariables);
  }

  public async sendRequest(requestAlias: string): Promise<IncomingMessage> {
    const request = memory.getValues(requestAlias) as Spec;
    return request.inspect().toss();
  }

  public async parseJson(path: string): Promise<string> {
    return JSON.stringify(fs.readFileSync(path, 'utf-8'));
  }
}

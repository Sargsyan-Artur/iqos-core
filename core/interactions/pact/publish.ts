import axios from 'axios';
import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import { log } from '../../utils/logger';

const getPactFileInBase64Format = (fileName) => {
  const json = fs.readFileSync(path.join('./pacts/', fileName));
  return Buffer.from(json).toString('base64');
};

const getVersionNumberParameter = () => {
  const customIndex = process.argv.indexOf('--versionNumber');
  let customValue;
  if (customIndex > -1) {
    customValue = process.argv[customIndex + 1];
  }
  return customValue;
};

const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/hal+json, application/json, */*; q=0.01',
  'X-Interface': 'HAL Browser',
  Authorization: `Bearer ${process.env.PACT_FLOW_TOKEN}`
};

const getBody = () => ({
  pacticipantName: 'F2F',
  pacticipantVersionNumber: getVersionNumberParameter(),
  branch: 'dxsF2F-731',
  tags: [],
  contracts: [
    {
      consumerName: 'F2F',
      providerName: 'F2F Dependencies',
      specification: 'pact',
      contentType: 'application/json',
      content: getPactFileInBase64Format('F2F-F2F Dependencies.json')
    }
  ]
});

const uploadContracts = async () => {
  const body = getBody();
  try {
    const response = await axios.post(
      'https://pmi.pactflow.io/contracts/publish',
      body,
      {
        headers
      }
    );

    log.info('Pacts are successfully published!');
    log.info(response);
  } catch (error) {
    log.error('Error publishing pacts:');
    log.error(error.message);
    log.error(error.response && error.response.data);
  }
};

if (process.env.CONTRACT_PUBLISH) {
  // eslint-disable-next-line no-void
  void uploadContracts();
}

#! /usr/bin/env node
import { uploadResults, uploadTests } from '../core/xray-integration';

const getCliCommand = () => process.argv[3];

const getValue = (paramKey) => {
  const customIndex = process.argv.indexOf(paramKey);
  let customValue;
  if (customIndex > -1) {
    customValue = process.argv[customIndex + 1];
  }
  return customValue;
};

const executeCommand = () => {
  const cliCommands = {
    uploadXrayTestCases: async () => {
      const projectKey = getValue('--projectKey');
      const featurePath = getValue('--featurePath');
      await uploadTests(projectKey, featurePath);
    },
    uploadXrayResults: async () => {
      const projectKey = getValue('--projectKey');
      await uploadResults(projectKey);
    }
  };

  const command = getCliCommand();
  if (!cliCommands[command]) {
    throw new Error(
      `There is no command like "${command}"! Please use the CLI as follows: dxs -- COMMAND --NTH_ARGUMENT NTH_VALUE`
    );
  }

  cliCommands[command]();
};

executeCommand();

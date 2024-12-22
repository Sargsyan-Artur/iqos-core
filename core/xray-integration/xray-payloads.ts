import {
  extractFeatureTags,
  extractScenarioTags,
  sortArray
} from './xray-helpers';

export async function payloadForLabelsAndDescription(
  featurePath,
  key,
  scenarioDescription
) {
  const allLabels = extractScenarioTags(featurePath, key).concat(
    extractFeatureTags(featurePath)
  );
  const noDuplicates = Array.from(new Set(allLabels));
  let update = {};

  if (process.env.COMPONENT_ID) {
    update = {
      components: [
        {
          add: {
            id: process.env.COMPONENT_ID
          }
        }
      ]
    };
  }
  return {
    fields: {
      labels: noDuplicates,
      description: scenarioDescription
    },
    update
  };
}

export function payloadForSort(summary, arr) {
  return {
    fields: {
      summary: `Execution results for user story(s) ${sortArray(summary)}`,
      customfield_16027: sortArray(arr)
    }
  };
}

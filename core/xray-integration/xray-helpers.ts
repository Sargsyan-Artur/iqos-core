/* eslint-disable no-restricted-syntax */
import fs from 'fs';
import { logger } from '../utils/logger';

const log = logger('XRAY');

export function extractFeatureTags(filePath) {
  const content = fs.readFileSync(filePath, { encoding: 'utf8' });
  const featureLine = content.split('Feature');
  const tagString = featureLine[0];

  return tagString.split(/[@\s]+/).filter((tag) => tag.length > 0);
}
export function extractScenarioTags(filePath, key) {
  const featureContent = fs.readFileSync(filePath, { encoding: 'utf8' });
  const featureLine = featureContent.split('Feature')[1];
  const scenarios = featureLine.split('Scenario');
  const scenarioTags = [];

  scenarios.forEach((item) => {
    const extractTagsFromScenario = item
      .split('\n')
      .filter((elem) => elem.trim().startsWith('@'));
    const tags = extractTagsFromScenario
      .join('')
      .split(/[@\s]+/)
      .filter((tag) => tag.length > 0);
    scenarioTags.push(tags);
  });

  return scenarioTags
    .filter((tags) => tags.includes(key))[0]
    .filter((elem) => elem !== key);
}
export function putTags(tag: string, feature: string): void {
  let featureContent = fs.readFileSync(feature, 'utf-8');
  if (!featureContent.includes(tag)) {
    featureContent = featureContent.replace('#tag', `@${tag}`);
    fs.writeFileSync(feature, featureContent);
  }
}

export function sortArray(array) {
  return array.sort((a, b) => {
    const numA: number = parseInt(a.split('-')[1], 10);
    const numB: number = parseInt(b.split('-')[1], 10);

    return numA - numB;
  });
}

export function getTags(reportContent, executionSummary, projectKey) {
  return JSON.parse(reportContent).forEach((content) => {
    executionSummary.push(
      content.tags
        .filter((tag) => tag.name.includes(projectKey))
        .map((tag) => tag.name)
        .join('')
        .replace('@', ' ')
    );
  });
}

export function readFolder(featurePath: string) {
  const files = fs.readdirSync(featurePath);
  const featureFiles = [];
  files.forEach((file) => {
    const filePath = `${featurePath}/${file}`;

    if (file.includes('.feature')) {
      featureFiles.push(filePath);
    } else {
      readFolder(filePath);
    }
  });
  return featureFiles;
}

export function convertRuledFeatureToUnRuled(featureFileContent) {
  if (!fs.existsSync('featuresWithRule')) {
    fs.mkdirSync('featuresWithRule');
  }
  const tagLine = featureFileContent.split(/^Feature:.*$/gm)[0];
  const featureLine = featureFileContent.match(/^Feature:.*$/gm)[0];
  let featureFileIndex = 1;
  let currentFeatureFileContent = '';

  featureFileContent
    .split(/^Feature:.*$/gm)[1]
    .split('\n')
    .forEach((line) => {
      if (line.trim().startsWith('Rule:')) {
        if (currentFeatureFileContent.trim().length > 0) {
          currentFeatureFileContent = currentFeatureFileContent.replace(
            /Rule:.*/,
            ''
          );
          fs.writeFileSync(
            `featuresWithRule/FeatureFile${featureFileIndex}.feature`,
            `${tagLine}${featureLine}\n${currentFeatureFileContent}`,
            { encoding: 'utf-8' }
          );
          featureFileIndex += 1;

          currentFeatureFileContent = `${tagLine}${featureLine}\n${line}\n`;
        }
      } else {
        currentFeatureFileContent += `${line}\n`;
      }
    });

  fs.writeFileSync(
    `featuresWithRule/FeatureFile${featureFileIndex}.feature`,
    currentFeatureFileContent.replace(/Rule:.*/, ''),
    'utf-8'
  );
}

function splitByScenario(text) {
  const regex = /((@|#)[^\n]*\n)+.*?(?=(((#|@)[^\n]*\n)+|$))/gs;

  const matches = [...text.matchAll(regex)];
  return matches.map((match) => match[0].trim());
}

function readContentFromDirectory(diractoryPath) {
  const filePaths = fs.readdirSync(diractoryPath);
  const fileContents = [];
  filePaths.forEach((path) => {
    const content = fs.readFileSync(`${diractoryPath}/${path}`, {
      encoding: 'utf-8'
    });
    fileContents.push(`${content}`);
  });
  return fileContents;
}

function createTagMapperOverScenario(scenariosWithTags) {
  const tagMapper = {};
  scenariosWithTags.forEach((scenarioWithTag) => {
    const tag = scenarioWithTag.match(/@dxsF2F-.*/)[0];
    const scenario = scenarioWithTag.match(/Scenario:.*/)[0];
    tagMapper[scenario] = tag;
  });

  return tagMapper;
}

function replaceOriginalScenariosWithNewTags(originalScenarios, tagMapper) {
  return originalScenarios.map((scenarioInFile1) => {
    let replacedScenario = scenarioInFile1;

    Object.keys(tagMapper).forEach((scenarioInFile2) => {
      if (scenarioInFile1.includes(scenarioInFile2)) {
        replacedScenario = scenarioInFile1.replace(
          '#tag',
          tagMapper[scenarioInFile2]
        );
      }
    });

    return replacedScenario;
  });
}

export function replaceTagsToRealFeature(featurePath, newDirectoryPath) {
  let OriginalFeatureContent = fs.readFileSync(featurePath, {
    encoding: 'utf-8'
  });

  if (OriginalFeatureContent.includes('#tag')) {
    let originalScenarios = splitByScenario(OriginalFeatureContent);

    const ruledFeaturesContents = readContentFromDirectory(newDirectoryPath);

    ruledFeaturesContents.forEach((content) => {
      const scenariosWithTags = content.match(/(@.*\s+)(@.*\s+)?Scenario:.*/gm);
      const tagMapper = createTagMapperOverScenario(scenariosWithTags);
      originalScenarios = replaceOriginalScenariosWithNewTags(
        originalScenarios,
        tagMapper
      );
      OriginalFeatureContent = originalScenarios
        .map((line) => `    ${line}`)
        .join('\n\n');
      fs.writeFileSync(featurePath, OriginalFeatureContent);
    });
  }
}
export function removeFolder(directoryPath) {
  if (fs.existsSync(directoryPath)) {
    try {
      fs.readdirSync(directoryPath).forEach((file) =>
        fs.unlinkSync(`${directoryPath}/${file}`)
      );
      fs.rmdirSync(directoryPath);
    } catch (error) {
      log.error('Error:', error);
    }
  }
}

function isScenarioLine(line: string): boolean {
  return line.startsWith('Scenario:');
}

function isStepLine(line: string): boolean {
  return /^(Given|When|Then|And|But)/i.test(line);
}

function isNonStepLine(line: string): boolean {
  return line && !/^(Given|When|Then|And|But)/i.test(line);
}

function collectCurrentDescription(descriptions, descriptionToAdd) {
  descriptions.push(descriptionToAdd.join(' ').trim());
}

export function extractScenarioDescriptions(filePath: string) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const lines = fileContent.split(/\r?\n/);

  const descriptions = [];
  let inScenario = false;
  let currentDescription = [];

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (isScenarioLine(trimmedLine)) {
      inScenario = true;
    } else if (inScenario && isStepLine(trimmedLine)) {
      const alreadyHaveDescriptionLine = currentDescription.length !== 0;
      if (!alreadyHaveDescriptionLine) {
        descriptions.push('');
      } else {
        collectCurrentDescription(descriptions, currentDescription);
      }
      currentDescription = [];
      inScenario = false;
    } else if (inScenario && isNonStepLine(trimmedLine)) {
      currentDescription.push(trimmedLine);
    }
  }
  return descriptions;
}

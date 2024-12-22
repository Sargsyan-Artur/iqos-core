/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line import/no-extraneous-dependencies
import JsonQuery from 'json-query';
import { cloneDeep, update, sortBy } from 'lodash';
import { memory } from '../../utils/memory';

const getProperty = (object: object, propertyPath: string) =>
  JsonQuery(propertyPath, { data: object }).value;

const _filterArray = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  arrayToFilter: Array<any>,
  propertyPath: string,
  validation: string,
  validationValue: string
  // eslint-disable-next-line max-params
) => {
  const matchFn = (object, propertyPath, validationValue) => {
    const propertyValue = getProperty(object, propertyPath);
    if (propertyValue !== undefined) {
      return propertyValue.toString().match(new RegExp(validationValue, 'gm'));
    }
    return false;
  };

  const filterFunctions = {
    'is defined': (object, propertyPath) =>
      getProperty(object, propertyPath) !== undefined,
    'is not defined': (object, propertyPath) =>
      getProperty(object, propertyPath) === undefined,
    matching: (object, property, validationValue) =>
      matchFn(object, property, validationValue),
    'not matching': (object, property, validationValue) =>
      !matchFn(object, property, validationValue),
    'included in': (object, propertyPath, validationValue) => {
      // eslint-disable-next-line no-param-reassign
      validationValue = memory.getValue(validationValue);
      return validationValue.indexOf(getProperty(object, propertyPath)) !== -1;
    }
  };

  return arrayToFilter.filter((currentObject) =>
    filterFunctions[validation](currentObject, propertyPath, validationValue)
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _sortArray = (arrayToSort: Array<any>, propertyPath: string) => {
  const sortedArray = sortBy(arrayToSort, [
    (currentObject) => getProperty(currentObject, propertyPath)
  ]);
  return sortedArray.reverse();
};

export const filterObjectOnPath = (
  objectToFilter: object,
  pathToArrayInObject: string,
  propertyPath: string,
  validation: string,
  validationValue: string
  // eslint-disable-next-line max-params
) => {
  let filteredObject;
  if (pathToArrayInObject === '') {
    filteredObject = _filterArray(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      objectToFilter as Array<any>,
      propertyPath,
      validation,
      validationValue
    );
  } else {
    const clonedObject = cloneDeep(objectToFilter);
    filteredObject = update(
      clonedObject,
      pathToArrayInObject,
      (arrayToFilter) =>
        _filterArray(arrayToFilter, propertyPath, validation, validationValue)
    );
  }
  return filteredObject;
};

export const sortObjectOnPath = (
  objectToFilter: object,
  pathToArrayInObject: string,
  propertyPath: string
) => {
  let filteredObject;
  if (pathToArrayInObject === '') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filteredObject = _sortArray(objectToFilter as Array<any>, propertyPath);
  } else {
    const clonedObject = cloneDeep(objectToFilter);
    filteredObject = update(
      clonedObject,
      pathToArrayInObject,
      (arrayToFilter) => _sortArray(arrayToFilter, propertyPath)
    );
  }
  return filteredObject;
};

export const isMobile = async (page, threshold = 768) => {
  const viewportSize = page.viewportSize();
  return viewportSize ? viewportSize.width <= threshold : false;
};

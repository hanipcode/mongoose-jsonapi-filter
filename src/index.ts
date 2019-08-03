import { isEmpty, mapKeys, mapValues, pickBy } from 'lodash';

const DEFAULT_CUSTOM_MAPPING = {
  is: 'eq',
  like: 'regex',
};

export const parseFilter = (
  filter: any = {},
  sanitizedField: string[] = [],
  customMapping: any = {},
) => {
  if (isEmpty(filter)) {
    return filter;
  }
  const resultMapping = {
    ...DEFAULT_CUSTOM_MAPPING,
    ...customMapping,
  };
  const sanitiziedFilter = pickBy(
    filter,
    (_, key) => sanitizedField.indexOf(key) === -1,
  );
  const regexMapping = pickBy(
    DEFAULT_CUSTOM_MAPPING,
    (value) => value === 'regex',
  );
  const filterKey = Object.keys(sanitiziedFilter);
  filterKey.forEach((filterName) => {
    const parseJSON = mapValues(sanitiziedFilter[filterName], (value, key) => {
      try {
        let parsed;
        if (regexMapping[key]) {
          parsed = new RegExp(value, 'gmi');
        } else {
          parsed = JSON.parse(value);
        }
        return parsed;
      } catch (error) {
        return value;
      }
    });
    const changeKey = mapKeys(parseJSON, (_, nestedKey: string) => {
      let key = nestedKey;
      if (resultMapping[nestedKey]) {
        key = resultMapping[nestedKey];
      }
      return `$${key}`;
    });

    sanitiziedFilter[filterName] = changeKey;
  });
  return sanitiziedFilter;
};

const assert = require('assert');

export default function (obj, page) {
  assert(typeof obj === 'object' && !Array.isArray(obj),
    'Your reducer must be an object, if you wanna use MobX style!');
  const originalObject = obj;
  const keys = Object.keys(originalObject);
  const result = {};
  const mapping = Object.create(originalObject);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    result[key] = `${page}/${key}`;
    mapping[`${page}/${key}`] = originalObject[key];
  }
  result['.__inner__'] = {
    originalObject,
    mapping,
  };
  return result;
};

const assert = require('assert');

function isGenerator(obj) {
  return 'function' == typeof obj.next && 'function' == typeof obj.throw;
}

function isGeneratorFunction(obj) {
  var constructor = obj.constructor;
  if (!constructor) return false;
  if ('GeneratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName) return true;
  return isGenerator(constructor.prototype);
}

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
    if (!isGeneratorFunction(originalObject[key])) {
      mapping[`${page}/${key}`] = originalObject[key];
      mapping[`${page}/${key.replace(/^\$/, '')}`] = originalObject[key];
    }
  }
  result['.__inner__'] = {
    originalObject,
    mapping,
  };
  return result;
};

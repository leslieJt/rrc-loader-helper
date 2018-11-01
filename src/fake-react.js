import React from 'react';
import {
  getMappingVal,
  getCachedFunction,
} from './util';
import {
  get as getCurrentPage,
} from './current-page'
import { getStore } from './inj-dispatch';

const raw = React.createElement.bind(React);

// builtin props
const builtins = {
  bind: 'data-bind',
  mapping: 'data-mapping',
  disallow: 'data-disallow'
};

// when pass into data-bind and onChange / disallow, performance may deteriorate
React.createElement = function createElement(type, config, ...children) {
  if (config) {
    const val = config[builtins.bind];
    const mapping = config[builtins.mapping];
    const disallow = config[builtins.disallow];

    if (val) {
      const store = getStore();
      if (store) {
        const page = getCurrentPage();
        const currentState = store.getState()[page];
        if (currentState) {
          config.value = getMappingVal(currentState, val.split('.'), mapping);
          config.onChange = getCachedFunction(page, val, mapping, disallow, config.onChange);
        }
      }

      // clear builtin props
      Object.values(builtins).forEach(prop => delete config[prop]);
    }
  }

  return raw(type, config, ...children);
};

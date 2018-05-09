import React from 'react';
import {
  getMappingVal,
  getCachedFunction,
} from './util';
import {
  get as getCurrentPage
} from './current-page'
import { getStore } from './inj-dispatch';

const raw = React.createElement;

React.createElement = function createElement(type, config, children) {
  if (config) {
    const val = config['data-bind'];
    const mapping = config['data-mapping'];
    const disallow = config['data-disallow'];
    if (val) {
      const store = getStore();
      if (store) {
        const page = getCurrentPage();
        const currentState = store.getState()[page];
        if (currentState) {
          config.value = getMappingVal(currentState, val.split('.'), mapping);
          config.onChange = getCachedFunction(page, val, mapping, disallow);
        }
      }
    }
  }
  return raw.apply(React, arguments);
};

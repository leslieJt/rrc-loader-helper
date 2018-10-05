import React from 'react';
import {
  getMappingVal,
  getCachedFunction,
  getLoadDataOnClick,
} from './util';
import {
  get as getCurrentPage,
} from './current-page'
import { getStore } from './inj-dispatch';

const raw = React.createElement;

// when pass into data-bind and onChange / disallow, performance may deteriorate
React.createElement = function createElement(type, config, children) {
  if (config) {
    const val = config['data-bind'];
    const mapping = config['data-mapping'];
    const disallow = config['data-disallow'];
    const load = config['data-load'];
    // changing oncLick should not influence the performance
    if (load) {
      const page = getCurrentPage();
      config.onClick = getLoadDataOnClick(page, load);
    }
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
    }
  }
  return raw.apply(React, arguments);
};

import React from 'react';
import { getVal, getCachedFunction } from './util/util';
import { get as getCurrentPage } from './current-page';
import { getStore } from './inj-dispatch';

var raw = React.createElement;

React.createElement = function createElement(type, config, children) {
  if (config) {
    var val = config['data-bind'];
    var mapping = config['data-mapping'];
    var disallow = config['data-disallow'];
    if (val) {
      var store = getStore();
      if (store) {
        var page = getCurrentPage();
        var currentState = store.getState()[page];
        if (currentState) {
          config.value = getVal(currentState, val.split('.'), mapping);
          config.onChange = getCachedFunction(page, val, disallow, mapping);
        }
      }
    }
  }
  return raw.apply(React, arguments);
};
/**
 * Created by fed on 2017/8/31.
 */
import React from 'react';
import createReactClass from 'create-react-class';
import { sendPv, sendEvent, setEventStartTime } from 'sheinq';

import { set as setPage } from './current-page';

const historyList = [];
let firstScreen = true;

const STATE_LIST = {
  INIT: 0,
  RESOLVED: 1,
  ERROR: 2,
  PENDING: 3,
};

export default function Loadable(args) {
  let {
    loading: Loading,
    loader,
    page
  } = args;
  let Result;
  let error;
  let state = STATE_LIST.INIT;
  return createReactClass({
    getInitialState: function() {
      this.useTime = Date.now();
      setEventStartTime(this.useTime);
      setPage(page);
      this.active = true;

      const that = this;
      if (state === STATE_LIST.INIT || state === STATE_LIST.PENDING) {
        state = STATE_LIST.PENDING;
        if (typeof loader === 'function') {
          loader = loader();
        }
        loader.then(function(view) {
          Result = view.default || view;
          state = STATE_LIST.RESOLVED;
          if (that.active) {
            that.setState({
              state: state,
            });
          }
          return view;
        }).catch(function(err) {
          error = err;
          console.error(err);
          state = STATE_LIST.ERROR;
          if (that.active) {
            that.setState({
              state: state,
            });
          }
        });
      }
      return {
        state: state,
      };
    },
    componentWillUnmount: function() {
      this.active = false;
      sendEvent({
        eventCategory: 'view',
        eventAction: 'leave',
        eventLabel: 'stayTime',
        eventValue: Date.now() - this.useTime
      });
    },
    componentDidUpdate: function() {
      if (!this.didSend && this.state.state === STATE_LIST.RESOLVED) {
        this.didSend = true;
        setTimeout(() => {
          sendPv({
            ctu: Date.now() - this.useTime - 4,
            page,
            refer: historyList.length>1 ? historyList[historyList.length - 2] : '',
            firstScreen
          });
          if(firstScreen) firstScreen = !firstScreen;
        }, 4);
      }
    },
    componentDidMount: function() {
      if (this.state.state === STATE_LIST.RESOLVED && !this.didSend) {
        this.didSend = true;
        const preHis = historyList.pop();
        setTimeout(() => {
          sendPv({
            ctu: Date.now() - this.useTime - 4,
            page,
            refer: preHis || '',
            firstScreen
          });
          if(firstScreen) firstScreen = !firstScreen;
        }, 4);
      }
      const l = historyList.length;
      if(!l){
        historyList.push(page);
      }else if(historyList[l - 1] != page){
        if (l >= 10) historyList.shift();
        historyList.push(page);
      }
    },
    render: function() {
      switch (this.state.state) {
        case STATE_LIST.RESOLVED:
          return React.createElement(Result, this.props);
        default:
          return React.createElement(Loading, this.props, { err: error && error.toString() });
      }
    }
  });
}
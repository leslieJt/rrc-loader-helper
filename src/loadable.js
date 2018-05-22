/**
 * Created by fed on 2017/8/31.
 */
import React from 'react';
import createReactClass from 'create-react-class';
import { send } from 'sheinq';

import { set as setPage } from './current-page';

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
    },
    componentDidUpdate: function(){
      if(!this.didSend && this.state.state===STATE_LIST.RESOLVED){
        this.didSend = true;
        setTimeout(() => {
          send({
            ctu: Date.now() - this.useTime - 4,
            page,
          });
        }, 4);
      }
    },
    componentDidMount: function() {
      if(this.state.state===STATE_LIST.RESOLVED && !this.didSend){
        this.didSend = true;
        setTimeout(() => {
          send({
            ctu: Date.now() - this.useTime - 4,
            page,
          });
        }, 4);
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
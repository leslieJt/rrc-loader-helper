import test from 'ava';
import transformReducer from '../src/util/transform-reducer';

test('#transform reducer', t => {
  const page = 'kkk';

  const raw = {
    defaultState: {
      a: 1
    },
    hello: (state, action) => {
      state.value = action.value;
    },
    *zz(action, ctx, put) {
      yield 1;
    },
  };

  const expected = {
    defaultState: `${page}/defaultState`,
    hello: `${page}/hello`,
    zz: `${page}/zz`,
    ['.__inner__']: {
      originalObject: raw,
      mapping: Object.assign(Object.create(raw), {
        [`${page}/defaultState`]: raw.defaultState,
        [`${page}/hello`]: raw.hello,
      }),
    }
  };

  t.deepEqual(transformReducer(raw, page), expected);
});

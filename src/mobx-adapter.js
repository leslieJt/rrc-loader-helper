import genSaga from './util/gen-sage';
import transformReducer from './util/transform-reducer';

import { getStore } from './inj-dispatch';
import { updateSaga } from './actions';

export default function adaptToMobx(obj, page) {
  const ctx = transformReducer(obj, page);
  const saga = genSaga(obj, page, ctx);
  // @TODO can i use store?
  if (saga) {
    getStore(function (store) {
      store.dispatch({
        type: updateSaga,
        saga,
      });
    });
  }
  return ctx;
}

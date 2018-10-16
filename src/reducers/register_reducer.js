import invariant from '../util/invariant';

export const registeredReducers = [];

// reducer can access global state.
export function registerReducer(reducer) {
  const isValid = invariant(typeof reducer === 'function', 'handler must be a function!');

  if (!isValid) return;

  registeredReducers.push(reducer);

  // revoke
  return () => {
    const index = registeredReducers.findIndex(reducer);
    if (index === -1) return;
    registeredReducers.splice(index, 1);
  }
}

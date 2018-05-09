let store;

export default function injectStore(s) {
  store = s;
}

export function getStore() {
  return store;
}

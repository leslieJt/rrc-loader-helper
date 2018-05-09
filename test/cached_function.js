import test from 'ava';

import getCachedFunction from '../src/util/cached_function';

test('#getCachedFunction', t => {
  const page = 'page';
  const key = 'a.b.c';
  const mapping = {
    name: 'username',
  };
  const allow = (val) => val > 1;

  const old = getCachedFunction(page, key, mapping);
  t.is(old, getCachedFunction(page, key, mapping), 'no allow should always return same');
  t.not(getCachedFunction(page, key, mapping, allow), getCachedFunction(page, key, mapping, allow),
    'with allow should not cache');
});

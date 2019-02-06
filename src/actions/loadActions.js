export const loadStart = () => ({
  type: 'LOAD_START',
});

export const loadEnd = xmlDoc => ({
  type: 'LOAD_END',
  xmlDoc,
});

export const loadFail = error => ({
  type: 'LOAD_FAIL',
  error,
});

export const clear = () => ({
  type: 'CLEAR',
});

export const highlight = cells => ({
  type: 'HIGHLIGHT',
  cells,
});

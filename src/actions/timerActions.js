export const increment = () => ({
  type: 'INCREMENT',
});

export const start = newTimer => ({
  type: 'START',
  newTimer,
});

export const stop = () => ({
  type: 'STOP',
});

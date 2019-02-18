import { Actions } from 'enums';

export const changeSmile = newSmile => ({
  type: Actions.CHANGE_SMILE,
  newSmile,
});

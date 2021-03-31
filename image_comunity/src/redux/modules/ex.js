import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
const SET_LIKE = "SET_LIKE";
const ADD_LIKE = "ADD_LIKE";


const setLike = createAction(SET_LIKE, (like) => ({ like }));
const addLike = createAction(ADD_LIKE, (like) => ({ like }));

const addEx = (list) => {
    return function(dispatch, getState) {
        dispatch(addLike(like+1))
    }
}

const initialState = {
  like: 0,
};



export default handleActions(
  {
    [SET_LIKE]: (state, action) => {
      produce(state, (draft) => {
        draft.like = action.payload.like;
      });
    },
    [ADD_LIKE]: (state, action) => {
      produce(state, (draft) => {
        draft.like = action.payload.like;
      });
    },
  },
  initialState
);
const actionCreators = {
  setLike,
  addLike,
};
export { actionCreators };

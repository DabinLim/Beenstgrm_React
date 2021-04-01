import { firestore } from "../../shared/firebase";
import { createAction, handleActions } from "redux-actions";
import firebase from "firebase/app";
import { produce } from "immer";
import { useSelector } from "react-redux";
import {actionCreators as postActions} from './post';

const ADD_LIKE = "ADD_LIKE";
const SET_LIKE = "SET_LIKE";

const addLike = createAction(ADD_LIKE, (like) => ({ like }));
const setLike = createAction(SET_LIKE, (like) => ({ like }));

const initialState = {
  list: [],
  like: false,
};

const setLikeFB = (post_id) => {
  return function (dispatch, getState) {
    const likeDB = firestore.collection("like");
    if (!getState().user.user){
        return
    }
    const user_id = getState().user.user.uid;

    likeDB
      .where("post_id", "==", post_id)
      .where("user_id", "==", user_id)
      .get()
      .then((docs) => {
        let like_list = [];
        docs.forEach((doc) => {
          like_list = {...doc.data(), id:doc.id};
        });
        dispatch(setLike(like_list));
      });
  };
};

const addLikeFB = (post_id, like_id, nowLike) => {
  return function (dispatch, getState, {history}) {
    const likeDB = firestore.collection("like");
    const postDB = firestore.collection('post');

    // 현재 좋아요 상태에 따른 변하게 될 좋아요
    let newLike;
    if (nowLike) {
      newLike = false;
    } else {
      newLike = true;
    }

    // 유저 정보가 없다면 리턴
    if(!getState().user.user){
        window.alert('로그인 하셔야 좋아요를 누를 수 있어요.')
        return
    }
    // 로그인한 유저 정보
    const user_id = getState().user.user.uid;

    let like = {
      post_id: post_id,
      user_id: user_id,
      user_like: newLike,
    };

    likeDB
      .where("post_id", "==", post_id)
      .where("user_id", "==", user_id)
      .get()
      .then((docs) => {
        // likeDB에 해당 데이터가 없다면 새로 만들어주고 좋아요 숫자 1 증가
        if (docs.empty) {
          likeDB.add(like).then((doc) => {
            like = {...like, id:doc.id};
            
            dispatch(addLike(like));
            dispatch(setLike(like));
            // 좋아요 숫자 증가를 위해 post 리덕스에서 id가 현재 post_id와 일치하는 데이터 찾아옴
            const post = getState().post.list.find(l => l.id === post_id);
            const increment = firebase.firestore.FieldValue.increment(1);
            postDB.doc(post_id).update({like_cnt: increment}).then(
                dispatch(postActions.editPost(post_id,{like_cnt: parseInt(post.like_cnt) + 1}))
            )
          }) 
        } else {
          likeDB.doc(like_id).update({user_like: newLike}).then((doc)=>{
            const post = getState().post.list.find(l => l.id === post_id);
            const increment = firebase.firestore.FieldValue.increment(1);
            const decrement = firebase.firestore.FieldValue.increment(-1);
            if(newLike){
                postDB.doc(post_id).update({like_cnt: increment}).then(
                    dispatch(postActions.editPost(post_id,{like_cnt: parseInt(post.like_cnt)+1}))
                )
            } else {
                postDB.doc(post_id).update({like_cnt:decrement}).then(
                    dispatch(postActions.editPost(post_id,{like_cnt: parseInt(post.like_cnt)-1}))
                )
            }
            
              like = {
                  post_id:post_id,
                  user_id:user_id,
                  user_like: newLike,
                  id:like_id,
              };
              
              dispatch(setLike(like))
          })
        }
      });
  };
};


export default handleActions(
  {
    [SET_LIKE]: (state, action) =>
      produce(state, (draft) => {
        draft.list.push(action.payload.like);
        draft.list = draft.list.reduce((acc, cur) => {
          if (acc.findIndex((a) => a.post_id === cur.post_id) === -1) {
            return [...acc, cur];
          } else {
              // 중복이 있다면 기존의 list를 새 list로 대체
              acc[acc.findIndex(a => a.id === cur.id)] = cur;
            return acc;
          }
        }, []);
      }),

    [ADD_LIKE]: (state, action) =>
      produce(state, (draft) => {
        draft.list.push(action.payload.like);
        draft.list = draft.list.reduce((acc, cur) => {
          if (acc.findIndex((a) => a.post_id === cur.post_id) === -1) {
            return [...acc, cur];
          } else {
            // acc[acc.findIndex(a => a.id === cur.id)] = cur;
            return acc;
          }
        }, []);
      }),
  },
  initialState
);

const actionCreators = {
  addLikeFB,
  setLikeFB,
  setLike
};

export { actionCreators };

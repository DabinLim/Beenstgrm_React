import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { firestore, realtime } from "../../shared/firebase";
import "moment";
import moment from "moment";
import firebase from 'firebase/app';
import {actionCreators as postActions} from './post';


const SET_COMMENT = "SET_COMMENT";
const ADD_COMMENT = "ADD_COMMENT";
const DELETE_COMMENT = 'DELETE_COMMENT';

const LOADING = "LOADING";

const setComment = createAction(SET_COMMENT, (post_id, comment_list) => ({post_id, comment_list}));
const addComment = createAction(ADD_COMMENT, (post_id, comment) => ({post_id, comment}));
const deleteComment = createAction(DELETE_COMMENT, (post_id,comment_id) => ({post_id, comment_id}));

const loading = createAction(LOADING, (is_loading) => ({ is_loading }));

const initialState = {
  list: {},
  is_loading: false,
};

const addCommentFB = (post_id, contents) => {
    return function(dispatch, getState, {history}){
        const commentDB = firestore.collection('comment');

        // user 리덕스에서 state 가져오기
        const user_info = getState().user.user;
        // 받아온 코멘트와, 유저정보, 현재시간을 묶어서 comment데이터 만듬
        let comment = {
            post_id: post_id,
            user_id: user_info.uid,
            user_name: user_info.user_name,
            user_profile: user_info.user_profile,
            contents: contents,
            insert_dt: moment().format('YYYY-MM-DD hh:mm:ss')
        }
        // 만든 comment데이터를 보냄
        commentDB.add(comment).then((doc) => {
            // 유저가 화면을 보고 있는 동안 (리덕스에서 댓글 개수는 그대로인 동안) firebase의 댓글 개수가 달라질 수 있음
            // 그러므로 firebase의 comment_cnt를 업데이트함
            // 현재 firebase의 comment_cnt 값을 가져오기 위해 연결
            const postDB = firestore.collection('post');
            // post 리덕스의 데이터 중 id값이 post_id 값과 같은 리스트를 찾아 comment 변수에 넣는다.
            const post = getState().post.list.find(l => l.id === post_id);
            // comment에 id값을 추가
            comment = {...comment, id:doc.id};

            // firebase 데이터 값 변경
            const increment = firebase.firestore.FieldValue.increment(1);
            // comment_cnt의 값을 1 올려준다.
            postDB.doc(post_id).update({comment_cnt: increment}).then((_post) => {
                dispatch(addComment(post_id, comment))
                // post 정보가 있을때 유저가 보고 있는 화면의 댓글 갯수도 변경시키기 위해 post 리덕스의 state도 업데이트
                if(post){
                    dispatch(postActions.editPost(post_id,{comment_cnt: parseInt(post.comment_cnt) + 1}))
                }
            })
            const _noti_item = realtime.ref(`noti/${post.user_info.user_id}/list`).push();

            _noti_item.set({
                post_id:post.id,
                user_name: comment.user_name,
                image_url: post.image_url,
                insert_dt: comment.insert_dt,

            }, (err) => {
                if(err){
                    console.log('알림저장에 실패했어요');
                }else {
                    const notiDB = realtime.ref(`noti/${post.user_info.user_id}`);

                    notiDB.update({read:false});
                }
            })
        })
    }
}

const getCommentFB = (post_id) => {
    return function(dispatch, getState, {history}){
        if (!post_id){
            return;
        }
        const commentDB = firestore.collection('comment');
        // firebase내의 데이터에 post_id와 인자로 받은 post)id의 값이 같은 데이터들만 날짜오름차순으로 정렬하여 가져온다.
        commentDB.where('post_id', '==', post_id).orderBy('insert_dt', 'desc').get().then((docs) => {
            let list = [];

            docs.forEach((doc) => {
                list.push({...doc.data(), id: doc.id});
            })
            dispatch(setComment(post_id,list));
        }).catch(err => {
            console.log('댓글 정보를 가져올 수 없어요', err);
        });
    }
}

const deleteCommentFB = (post_id, comment_id) => {
    return function(dispatch, getState) {
        const commentDB = firestore.collection('comment');
        commentDB.doc(comment_id).delete().then((docs) => {
            const postDB = firestore.collection('post')
            const post = getState().post.list.find(l => l.id === post_id);
            const decrement = firebase.firestore.FieldValue.increment(-1);
            postDB.doc(post_id).update({comment_cnt:decrement}).then(
                dispatch(postActions.editPost(post_id,{comment_cnt: parseInt(post.comment_cnt)-1}))
            )
            dispatch(deleteComment(post_id, comment_id))
        })
    }
}


export default handleActions(
  {
      [SET_COMMENT]: (state, action) => produce(state, (draft) => {
        draft.list[action.payload.post_id] = action.payload.comment_list;
      }),
      [ADD_COMMENT]: (state, action) => produce(state, (draft)=> {
        draft.list[action.payload.post_id].unshift(action.payload.comment);
      }),

      [DELETE_COMMENT]: (state, action) =>
        produce(state, (draft) => {
          let new_comment = draft.list[action.payload.post_id].filter((v) => {
            if (v.id !== action.payload.comment_id){
              return v;
            }
          })
          draft.list[action.payload.post_id] = new_comment
        }),

      [LOADING]: (state, action) => 
      produce(state, (draft) => {
        draft.is_loading = action.payload.is_loading;
      })
  },
  initialState
);

const actionCreators = {
  getCommentFB,
  addCommentFB,
  setComment,
  addComment,
  deleteCommentFB,
};

export { actionCreators };
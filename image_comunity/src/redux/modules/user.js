import { createAction, handleActions } from "redux-actions";
import { produce } from "immer"; // 불변성 관리
import { setCookie, getCookie, deleteCookie } from "../../shared/Cookie";
import { auth } from "../../shared/firebase";
import firebase from "firebase/app";
import {realtime} from '../../shared/firebase';
import moment from 'moment';
import {actionCreators as likeActions} from './like';


// actions

const LOG_OUT = "LOG_OUT";
const GET_USER = "GET_USER";
const SET_USER = "SET_USER";

// action creators

const setUser = createAction(SET_USER, (user) => ({ user }));
const logOut = createAction(LOG_OUT, (user) => ({ user }));
const getUser = createAction(GET_USER, (user) => ({ user }));

// default state

const initialState = {
  user: null,
  is_login: false,
};

// 유저 정보 초기화
const user_initial = {
  user_name: "dabin",
};


// middleware actions

// 로그인 상태인지 체크

const loginCheckFB = () => {
    return function (dispatch, getState, {history}){
        auth.onAuthStateChanged((user) => {
            
            // 이미 로그인이 된 상태라면 (user값이 존재한다면)
            if(user){

                // 리덕스에 유저 정보 넣기
                dispatch(setUser({
                    user_name: user.displayName,
                    user_profile: '',
                    id: user.email,
                    uid: user.uid,
                }))
            }else {
                // 로그인 상태가 아니라면 리덕스 정보도 로그아웃 상태로
                dispatch(logOut());
            }
        })
    }
}

// 로그아웃 
const logoutFB = () => {
    return function (dispatch, getState, {history}) {
        auth.signOut().then(() => {
            // 로그아웃 액션 
            dispatch(logOut());
            dispatch(likeActions.setLike([]))
            // 뒤로가기 안됨
            history.replace('/');
        })
    }
}

const loginFB = (id, pwd) => {
  return function (dispatch, getState, { history }) {


    // 로그인 정보를 세션에 저장
    auth.setPersistence(firebase.auth.Auth.Persistence.SESSION).then((res) => {

    // id 와 pwd를 받아 로그인 (정보는 세션에 저장)
      auth
        .signInWithEmailAndPassword(id, pwd)
        .then((user) => {
          console.log(user);
          dispatch(
            setUser({
              id: id,
              user_name: user.user.displayName,
              user_profile: "",
              uid: user.user.uid,
            })
          );
          history.push("/");
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorCode, errorMessage);
        });
    });
  };
};

const signupFB = (id, pwd, user_name) => {
  return function (dispatch, getState, { history }) {

    // id와 pwd를 받아 회원 가입, 프로필(displayName) 은 user_name 으로 저장
    auth
      .createUserWithEmailAndPassword(id, pwd)
      .then((user) => {
        console.log(user);
        auth.currentUser
          .updateProfile({
            displayName: user_name,
          })
          .then(() => {
            dispatch(
              setUser({ user_name: user_name, id: id, user_profile: "", uid: user.user.uid})
            );
            const _noti_item = realtime.ref(`noti/${user.user.uid}/list`).push();
            _noti_item.set({
              post_id:'new',
              user_name:user_name,
              image_url: 'https://firebasestorage.googleapis.com/v0/b/dab-react.appspot.com/o/dasfasd.jpeg?alt=media&token=d1c2f213-ced8-44c9-8112-7374bb695558',
              insert_dt: moment().format('YYYY-MM-DD hh:mm:ss') 
            })
            const _noti_list = realtime.ref(`noti/${user.user.uid}`).push();
            _noti_list.set({
              read:false
            })
            history.push("/");
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage);
        if (errorMessage === 'The email address is already in use by another account.'){
          window.alert('이메일이 이미 존재합니다')
        }
      });
  };
};

// reducer
// draft == 현재 리덕스의 state

export default handleActions(
  {
    [SET_USER]: (state, action) =>
      produce(state, (draft) => {
        setCookie("is_login", "success");
        draft.user = action.payload.user;
        draft.is_login = true;
      }),
    [LOG_OUT]: (state, action) =>
      produce(state, (draft) => {
        deleteCookie("is_login");
        draft.user = null;
        draft.is_login = false;
      }),
    [GET_USER]: (state, action) => produce(state, (draft) => {}),
  },
  initialState
);

// action creator export

const actionCreators = {
  logOut,
  setUser,
  getUser,
  signupFB,
  loginFB,
  loginCheckFB,
  logoutFB,
};

export { actionCreators };

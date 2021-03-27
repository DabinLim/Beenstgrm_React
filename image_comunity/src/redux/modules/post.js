import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { firestore } from "../../shared/firebase";
import moment from "moment";

// actions
const SET_POST = "SET_POST";
const ADD_POST = "ADD_POST";

// action creater
const setPost = createAction(SET_POST, (post_list) => ({ post_list }));
const addPost = createAction(ADD_POST, (post) => ({ post }));

const initialState = {
  list: [],
};

const initialPost = {
  //   id: 0,
  //   user_info: {
  //     user_name: "Dabin",
  //     user_profile:
  //       "https://reactdabin.s3.ap-northeast-2.amazonaws.com/file-2021-03-03-21-38-26.png",
  //   },
  image_url:
    "https://reactdabin.s3.ap-northeast-2.amazonaws.com/file-2021-03-03-21-38-26.png",
  contents: "",
  comment_cnt: 0,
  insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
};

// firebase 통신

const addPostFB = (contents = "") => {
  return function (dispatch, getState, { history }) {
    const _user = getState().user.user;
    const postDB = firestore.collection("post");
    const user_info = {
      user_name: _user.user_name,
      user_id: _user.uid,
      user_profile:
        "https://reactdabin.s3.ap-northeast-2.amazonaws.com/file-2021-03-03-21-38-26.png",
    };
    const _post = {
      ...initialPost,
      contents: contents,
      insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
    };

    postDB
      .add({ ...user_info, ..._post })
      .then((doc) => {
        dispatch(addPost({ user_info, ..._post, id: doc.id }));
        history.replace("/");
      })
      .catch((err) => {
        console.log("post 작성에 실패했어요", err);
      });
  };
};

const getPostFB = () => {
  return function (dispatch, getState, { history }) {
    // postDB = firestore 의 post 컬렉션에서 가져온 데이터들
    const postDB = firestore.collection("post");
    // postDB를 가져온다 가져오고 나면 docs(데이터들)을 각각 하나씩 _post에 넣는다
    postDB.get().then((docs) => {
      let post_list = [];
      docs.forEach((doc) => {
        let _post = doc.data();

        // _post의 키값들을 배열로 만든다 -> 기본값으로 아이디를 먼저 넣고 [키] (key) : _post[키] (value)를 돌면서 넣는다.
        let post = Object.keys(_post).reduce(
          (acc, cur) => {
              console.log(cur.indexOf('user_'))
              // cur에서 'user_'의 인덱스가 -1이 아니라면 (user_가 포함이 되어 있다면)
            if (cur.indexOf("user_") !== -1) {
              return {
                // ...acc = id:doc.id
                ...acc,
                // ...acc.user_info = {}
                user_info: { ...acc.user_info, [cur]: _post[cur] },
              };
            }
            return { ...acc, [cur]: _post[cur] };
          },
          { id: doc.id, user_info: {} }
        );

        // 일일히 넣는 방법
        // let _post = {
        //   id: doc.id,
        //   ...doc.data(),
        // };

        // let post = {
        //   id: doc.id,
        //   user_info: {
        //     user_name: _post.user_name,
        //     user_profile: _post.user_profile,
        //     user_id: _post.user_id,
        //   },
        //   image_url: _post.user_id,
        //   contents: _post.contents,
        //   comment_cnt: _post.comment_cnt,
        //   insert_dt: _post.insert_dt,
        // };
        post_list.push(post);
      });
      dispatch(setPost(post_list));
    });
  };
};

export default handleActions(
  {
    [SET_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list = action.payload.post_list; // action에서 넘겨받은 post_list로 draft.list(리덕스의 state)를 갈아끼운다
      }),

    [ADD_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list.unshift(action.payload.post);
      }),
  },
  initialState
);

const actionCreators = {
  setPost,
  addPost,
  getPostFB,
  addPostFB,
};

export { actionCreators };

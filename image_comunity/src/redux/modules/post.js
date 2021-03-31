import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { firestore, storage } from "../../shared/firebase";
import moment from "moment";
import { actionCreators as imageActions } from "./image";
import like from "./like";

// actions
const SET_POST = "SET_POST";
const ADD_POST = "ADD_POST";
const EDIT_POST = "EDIT_PODT";
const LOADING = "LOADING";

// action creater
const setPost = createAction(SET_POST, (post_list, paging, like_list) => ({ post_list, paging, like_list }));
const addPost = createAction(ADD_POST, (post) => ({ post }));
const editPost = createAction(EDIT_POST, (post_id, post) => ({
  post_id,
  post,
}));
const loading = createAction(LOADING, (is_loading) => ({is_loading}))

const initialState = {
  list: [],
  paging: {start: null, next: null, size: 3},
  is_loading: false,
  like_list:[],
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
  like_cnt: 0,
  insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
};

// firebase 통신

const editPostFB = (post_id = null, post = {}) => {
  return function (dispatch, getState, { history }) {
    if (!post_id) {
      console.log("post_id 가 없네");
      return;
    }
    // preview의 data_url 가져오기
    const _image = getState().image.preview;
    // post.list에서 현재 넘겨받은 post_id 와 id가 같은 데이터의 인덱스 값을 가져온다.
    const _post_idx = getState().post.list.findIndex((p) => p.id === post_id);
    // 그 list를 가져온다.
    const _post = getState().post.list[_post_idx];

    console.log(_post);

    const postDB = firestore.collection("post");

    if (_image === _post.image_url) {
      postDB
        .doc(post_id)
        .update(post)
        .then((doc) => {
          dispatch(editPost(post_id, { ...post }));
          history.replace("/");
          return;
        });
    } else {
      const user_id = getState().user.user.uid;
      const _upload = storage
        .ref(`images/${user_id}_${new Date().getTime()}`)
        .putString(_image, "data_url");

      _upload.then((snapshot) => {
        // 방금 storage에 저장한 파일의 다운로드url 가져옴
        snapshot.ref
          .getDownloadURL()
          .then((url) => {
            return url;
            // 이미지가 storage에 저장되고 download url을 가져온 후에는 firestore에 저장한다.
          })
          .then((url) => {
            postDB
              .doc(post_id)
              .update({ ...post, image_url: url })
              .then((doc) => {
                dispatch(editPost(post_id, { ...post, image_url :url }));
                history.replace("/");
                // 업로드가 끝나면 image 리덕스의 preview 값을 다시 null로 바꿔준다.
                dispatch(imageActions.setPreview(null));
              })
              .catch((err) => {
                window.alert("게시물 작성에 실패했어요");
                console.log(err);
              });
          })
          .catch((err) => {
            window.alert("이미지 업로드에 실패했어요");
            console.log(err);
          });
      });
    }
  };
};

const addPostFB = (contents = "", layout) => {
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
      layout: layout,
      contents: contents,
      insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
    };

    // preview 에 있는 data_url을 가져옴
    const _image = getState().image.preview;
    console.log(_image);
    console.log(typeof _image);

    // preview의 data_url 을 putString을 이용해 이미지 파일로 변환하여 storage에 저장
    const _upload = storage
      .ref(`images/${user_info.user_id}_${new Date().getTime()}`)
      .putString(_image, "data_url");

    _upload.then((snapshot) => {
      // 방금 storage에 저장한 파일의 다운로드url 가져옴
      snapshot.ref
        .getDownloadURL()
        .then((url) => {
          return url;
          // 이미지가 storage에 저장되고 download url을 가져온 후에는 firestore에 저장한다.
        })
        .then((url) => {
          postDB
            .add({ ...user_info, ..._post, image_url: url })
            .then((doc) => {
              dispatch(
                addPost({ user_info, ..._post, image_url: url, id: doc.id })
              );
              history.replace("/");
              // 업로드가 끝나면 image 리덕스의 preview 값을 다시 null로 바꿔준다.
              dispatch(imageActions.setPreview(null));
            })
            .catch((err) => {
              window.alert("게시물 작성에 실패했어요");
              console.log(err);
            });
        })
        .catch((err) => {
          window.alert("이미지 업로드에 실패했어요");
          console.log(err);
        });
    });
  };
};

const getPostFB = (start = null, size = 3) => {
  return function (dispatch, getState, { history }) {
    // PostList 컴포넌트에서 paging.next를 인자로 받아 start에 넣었으므로 start는 이전 포스트때의 next가 됨
    // 만약 첫 렌더링 이라면 start는 null
    
    let _paging = getState().post.paging;

    if(_paging.start && !_paging.next) {
      window.alert('다음 게시물이 없습니다.')
      return;
    }
    // 데이터를 가져오기 시작하면 현재 로딩중으로 바꿔준다.
    dispatch(loading(true))
    // postDB = firestore 의 post 컬렉션에서 가져온 데이터들
    const postDB = firestore.collection("post");
    // postDB의 데이터를 insert_dt 를 기준으로 정렬해서 가져온다
    let query = postDB.orderBy('insert_dt','desc')

    //start가 null이 아니라면 start부터 데이터 가져옴
    if(start){
      console.log(start.data())
      query = query.startAt(start);
    }


    // 데이터를 size+1개 까지만 가져온다. -> 다음 데이터가 있는지 구분하기 위해서 state에 넣을 값보다 +1 만큼 가져옴
    query.limit(size + 1).get().then(docs => {
      let paging = {
        start: docs.docs[0],
        // 가져온 데이터의 길이가 size+1 이랑 같다면 다음 데이터가 있으니 다음데이터의 가져와야할 부분을 next로 , 아니라면 다음 데이터가 없으니 next는 null
        next: docs.docs.length === size+1? docs.docs[docs.docs.length-1] : null,
        size: size, 
      }

      let post_list = [];
      docs.forEach((doc) => {
        let _post = doc.data();
        // _post의 키값들을 배열로 만든다 -> 기본값으로 아이디를 먼저 넣고 [키] (key) : _post[키] (value)를 돌면서 넣는다.
        let post = Object.keys(_post).reduce(
          (acc, cur) => {
            console.log(cur.indexOf("user_"));
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
        //   like_state: {
        //   },
        // };
        
        post_list.push(post);
      });
      // 3개를 렌더링 하려는데 4개를 가져왔으므르 하나 빼준다. 4개 미만으로 가져왔다면(next==null 이라는 뜻) 모두 렌더링 해야 하므로 빼주지 않는다.
      if(post_list.length === size +1){
        post_list.pop()
      }
      // const likeDB = firestore.collection('like');
      // const user_id = getState().user.user.uid;
      // let like_list = []
      // for (let i = 0; i < post_list.length; i ++){
      //   likeDB.where('post_id','==',post_list[i].id).where('user_id','==',user_id).get().then((docs)=>{
      //     docs.forEach((doc) => {
      //       if(doc){
      //         console.log(doc.data().user_like)
      //       }
      //     })
      //   })
      // }
      dispatch(setPost(post_list, paging));
    });

    return;
    // postDB를 가져온다 가져오고 나면 docs(데이터들)을 각각 하나씩 _post에 넣는다
    // postDB.get().then((docs) => {
    //   let post_list = [];
    //   docs.forEach((doc) => {
    //     let _post = doc.data();

    //     // _post의 키값들을 배열로 만든다 -> 기본값으로 아이디를 먼저 넣고 [키] (key) : _post[키] (value)를 돌면서 넣는다.
    //     let post = Object.keys(_post).reduce(
    //       (acc, cur) => {
    //         console.log(cur.indexOf("user_"));
    //         // cur에서 'user_'의 인덱스가 -1이 아니라면 (user_가 포함이 되어 있다면)
    //         if (cur.indexOf("user_") !== -1) {
    //           return {
    //             // ...acc = id:doc.id
    //             ...acc,
    //             // ...acc.user_info = {}
    //             user_info: { ...acc.user_info, [cur]: _post[cur] },
    //           };
    //         }
    //         return { ...acc, [cur]: _post[cur] };
    //       },
    //       { id: doc.id, user_info: {} }
    //     );

    //     // 일일히 넣는 방법
    //     // let _post = {
    //     //   id: doc.id,
    //     //   ...doc.data(),
    //     // };

    //     // let post = {
    //     //   id: doc.id,
    //     //   user_info: {
    //     //     user_name: _post.user_name,
    //     //     user_profile: _post.user_profile,
    //     //     user_id: _post.user_id,
    //     //   },
    //     //   image_url: _post.user_id,
    //     //   contents: _post.contents,
    //     //   comment_cnt: _post.comment_cnt,
    //     //   insert_dt: _post.insert_dt,
    //     // };
    //     post_list.push(post);
    //   });
    //   dispatch(setPost(post_list));
    // });
  };
};

const getOnePostFB = (id) => {
  return function(dispatch, getState, {history}){
    const postDB = firestore.collection("post");
    postDB
      .doc(id)
      .get()
      .then((doc) => {
        console.log(doc);
        console.log(doc.data());
        let _post = doc.data();
        let post = Object.keys(_post).reduce(
          (acc, cur) => {
            console.log(cur.indexOf("user_"));
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
        dispatch(setPost([post]))
      });
  }
}

export default handleActions(
  {
    [SET_POST]: (state, action) =>
      produce(state, (draft) => {
        // action에서 넘겨받은 post_list를 draft.list(리덕스의 state)에 추가한다.
        draft.list.push(...action.payload.post_list) 
        // 현재 state의 list를 돌면서 현재값이 누산된 값에 있지 않다면 ( -1 )  누산된 값에 현재 값 더함 즉, 모든 값을 배열에 넣음
        draft.list = draft.list.reduce((acc, cur) => {
          if(acc.findIndex(a => a.id === cur.id) === -1) {
            return [...acc, cur]
          } else {
            // acc[acc.findIndex(a => a.id === cur.id)] = cur;
            return acc;
          }
        },[]);

        if(action.payload.paging){
        draft.paging = action.payload.paging;
        draft.is_loading = false;
        }

        if(action.payload.like_list){
          draft.like_list = action.payload.like_list;
        }
      }),

    [ADD_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list.unshift(action.payload.post);
      }),

    [EDIT_POST]: (state, action) =>
      produce(state, (draft) => {
        // action에서 받은 포스트의 id 와 state의 id를 비교해서 일치하는 id의 인덱스를 가져온다.
        let idx = draft.list.findIndex((p) => p.id === action.payload.post_id);
        // 인덱스를 이용해 list 정보와, action의 포스트 정보를 함께 업데이트한다.
        draft.list[idx] = { ...draft.list[idx], ...action.payload.post };
      }),

      [LOADING]: (state, action) =>
      produce(state, (draft) => {
        draft.is_loading = action.payload.is_loading;
      }),
  },
  initialState
);

const actionCreators = {
  setPost,
  addPost,
  editPost,
  getPostFB,
  addPostFB,
  editPostFB,
  getOnePostFB,
};

export { actionCreators };

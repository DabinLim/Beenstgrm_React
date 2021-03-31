import React from "react";
import Post from "../components/Post";
import { useSelector, useDispatch } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";
import InfinityScroll from "../shared/InfinityScroll";
import { Grid } from "../elements";

const PostList = (props) => {
  const dispatch = useDispatch();
  // post.js 리덕스의 state 값 중 list를 가져온다.
  const post_list = useSelector((state) => state.post.list);
  const user_info = useSelector((state) => state.user.user);
  const is_loading = useSelector((state) => state.post.is_loading);
  const paging = useSelector((state) => state.post.paging);
  const { history } = props;
  // console.log(user_info.uid)

  // getPostFB로 firbase의 데이터 가져오기
  React.useEffect(() => {
    if (post_list.length < 2) {
      dispatch(postActions.getPostFB());
    }
  }, []);
  return (
    <React.Fragment>
      <Grid bg={'#EFF6FF'} padding="20px 0px 20px 0px">
        <InfinityScroll
          callNext={() => {
            dispatch(postActions.getPostFB(paging.next));
          }}
          is_next={paging.next ? true : false}
          is_loading={is_loading}
        >
          {post_list.map((p, idx) => {
            if (p.user_info.user_id === user_info?.uid) {
              return (
                <Grid
                bg={'#FFFFFF'}
                margin='10px 0px'
                  key={p.id}
                >
                  <Post {...p} is_me />
                </Grid>
              );
            } else {
              return (
                <Grid
                bg={'#FFFFFF'}
                margin='10px 0px'
                  key={p.id}      
                >
                  <Post {...p} />
                </Grid>
              );
            }
          })}
          {/* <button onClick={()=> {
                    dispatch(postActions.getPostFB(paging.next))
                }}>추가로드</button> */}
        </InfinityScroll>
      </Grid>
    </React.Fragment>
  );
};

export default PostList;

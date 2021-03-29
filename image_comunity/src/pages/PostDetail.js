import React from "react";
import Post from "../components/Post";
import CommentList from "../components/CommentList";
import CommentWrite from "../components/CommentWrite";

import { useDispatch, useSelector } from "react-redux";
import {actionCreators as postActions} from'../redux/modules/post';

import Permit from '../shared/Permit';

const PostDetail = (props) => {
  const dispatch = useDispatch()
  const id = props.match.params.id;

  const user_info = useSelector((state) => state.user.user);
  const post_list = useSelector((state) => state.post.list);
  // post_list 에서 현재 url의 id와 id가 같은 데이터의 인덱스를 구함
  const post_idx = post_list.findIndex((p) => p.id === id);
  // 그 인덱스의 데이터는 post_data
  const post = post_list[post_idx];


  // firebase에서 가져온 데이터를 state에 저장 (단일데이터를 컴포넌트에서 직접 firebase로부터 가져올때 사용하던 코드)
  // const [post, setPost] = React.useState(post_data ? post_data : null);

  React.useEffect(() => {
    if (post) {
      return;
    }
    // 데이터 하나만 불러오기
    dispatch(postActions.getOnePostFB(id))
    
  }, []);

  console.log(post);
  return (
    <React.Fragment>
      {post && (
        <Post {...post} is_me={post.user_info.user_id === user_info?.uid} />
      )}
      <Permit>
      <CommentWrite post_id={id}/>
      </Permit>
      <CommentList post_id={id}/>
    </React.Fragment>
  );
};

export default PostDetail;

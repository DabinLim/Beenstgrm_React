import React from 'react';
import Post from '../components/Post';
import {useSelector, useDispatch} from 'react-redux';
import {actionCreators as postActions} from '../redux/modules/post';

const PostList = (props) => {
    const dispatch = useDispatch();
    // post.js 리덕스의 state 값 중 list를 가져온다.
    const post_list = useSelector((state) => state.post.list);
    

    // getPostFB로 firbase의 데이터 가져오기
    React.useEffect(() => {
        if(post_list.length === 0){

            dispatch(postActions.getPostFB());
        }
    },[]) 
    return (
        <React.Fragment>
            {post_list.map((p, idx) => {
                return <Post key={p.id} {...p} />
            })}
        </React.Fragment>
    )
}

export default PostList

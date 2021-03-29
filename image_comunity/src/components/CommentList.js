import React from 'react';
import {Grid, Image, Text} from '../elements';

import { useDispatch, useSelector } from 'react-redux';
import {actionCreators as commentActions} from '../redux/modules/comment';

const CommentList = (props) => {
    // 드릴링을 줄이기 위해 자식컴포넌트에서 데이터를 불러오겟슴 (부모컴포넌트에서 데이터를 받는 경우 comment의 데이터가 변하면 둘 다 리렌더링되어 비효율적)   
    const dispatch = useDispatch();
    const comment_list = useSelector(state => state.comment.list)
    const {post_id} = props;

    React.useEffect(() => {
        if(!comment_list[post_id]){
            dispatch(commentActions.getCommentFB(post_id));
        }
    },[])

    if(!comment_list[post_id] || !post_id){
        return null;
    }

    return (
        <React.Fragment>
            <Grid padding='16px'>
                {comment_list[post_id].map(c => {
                    return (<CommentItem key={c.id} {...c}/>)
                })}
            </Grid>
        </React.Fragment>
    )
}

CommentList.defaultProps = {
    post_id: null,
}

export default CommentList;

const CommentItem = (props) => {

    const {user_profile, user_name, user_id, post_id, contents, insert_dt} = props
    
    return (
        <Grid is_flex>
            <Grid is_flex width='auto'>
                <Image shape='circle'/>
                <Text bold>{user_name}</Text>
            </Grid>
            <Grid is_flex margin='0px 4px'>
                <Text >{contents}</Text>
                <Text >{insert_dt}</Text>
            </Grid>
        </Grid>
    )
}

CommentItem.defaultProps = {
    user_profile: '',
    user_name: 'dabin',
    user_id: '',
    post_id: 1,
    contents: '귀여운 콩이네요',
    insert_dt: '2021-01-01 19:00:00'
}

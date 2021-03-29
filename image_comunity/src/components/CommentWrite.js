import React from 'react';
import {Grid, Image, Input, Text, Button} from '../elements';
import {useDispatch, useSelector} from 'react-redux';
import {actionCreators as commentActions} from '../redux/modules/comment';

const CommentWrite = (props) => {
    const [comment_text, setCommentText] = React.useState();
    const dispatch = useDispatch()
    const {post_id} = props;

    const onChange = (e) => {
        setCommentText(e.target.value);
    }

    const write = () => {
        // 작성 버튼을 누르면 input 창의 내용 지우기
        setCommentText('');
        // post_id 와 현재 작성된 comment 내용 보내기
        dispatch(commentActions.addCommentFB(post_id, comment_text));
    }

    return (
        <React.Fragment>
            <Grid padding='16px' is_flex>
                <Input is_Submit onSubmit={write} _onChange={onChange} value={comment_text}
                placeholder='댓글 내용을 입력하세요.' text='댓글'/>
                <Button _onClick={write} width='60px' margin='0px 2px 0px 2px'>작성</Button>
            </Grid>
        </React.Fragment>
    )
}

export default CommentWrite;
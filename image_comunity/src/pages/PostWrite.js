import React from 'react';
import {Grid, Text, Button, Image, Input} from '../elements';
import Upload from '../shared/Upload';
import {useSelector, useDispatch} from'react-redux';
import {actionCreators as postActions} from '../redux/modules/post';


const PostWrite = (props) => {
    const dispatch = useDispatch()
    // 부모 컴포넌트에서 이미 세션을 확인하고 세션이 있을때만 리덕스 상태를 로그인으로 바꿔주므로 리덕스만 확인
    const is_login = useSelector((state) => state.user.is_login);
    const {history} = props;

    const [contents, setContents] = React.useState('');

    const changeContents = (e) => {
        setContents(e.target.value);
    }

    const addPost = () => {
        dispatch(postActions.addPostFB(contents));
    }
    if(!is_login){
        return (
            <Grid margin='100px 0px' padding='16px' center> 
                <Text size='32px' bold>잠시만요!</Text>
                <Text size='16px'>로그인을 하셔야 글을 작성할 수 있어요.</Text>
                <Button _onClick={() => {history.replace('/login');}}>로그인 하러가기</Button>
            </Grid>
        )
    }

    return (
        <React.Fragment>
            <Grid padding='16px'>
                <Text margin='0px' size='36px' bold>게시글 작성</Text>
                <Upload/>
            </Grid>
            <Grid>
                <Grid padding='16px'>
                    <Text margin='0px' size='24px' bold>미리보기</Text>
                </Grid>
                <Image shape='rectangle'/>
            </Grid>
            <Grid padding='16px'>
                <Input _onChange={changeContents} label='게시글 내용' placeholder='게시글 작성' multiLine/>
            </Grid>
            <Grid>
                <Button _onClick={addPost}>게시글 작성</Button>
            </Grid>
        </React.Fragment>
    )
}

export default PostWrite;
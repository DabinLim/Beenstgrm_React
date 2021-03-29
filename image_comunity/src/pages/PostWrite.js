import React from 'react';
import {Grid, Text, Button, Image, Input} from '../elements';
import Upload from '../shared/Upload';
import {useSelector, useDispatch} from'react-redux';
import {actionCreators as postActions} from '../redux/modules/post';
import {actionCreators as imageActions} from '../redux/modules/image';


const PostWrite = (props) => {
    const dispatch = useDispatch()
    // 부모 컴포넌트에서 이미 세션을 확인하고 세션이 있을때만 리덕스 상태를 로그인으로 바꿔주므로 리덕스만 확인
    const is_login = useSelector((state) => state.user.is_login);
    const preview = useSelector((state) => state.image.preview);
    const post_list = useSelector((state) => state.post.list);
    const {history} = props;

    console.log(props.match.params.id)

    const post_id = props.match.params.id;
    const is_edit = post_id? true : false;

    let _post = is_edit? post_list.find((p) => p.id === post_id) : null;

    console.log(_post)
    const [contents, setContents] = React.useState(_post? _post.contents : '');

    React.useEffect(() => {
        if(is_edit && !_post) {
            window.alert('post정보가 없습니다.');
            history.goBack();
            return
        }

        if(is_edit){
            dispatch(imageActions.setPreview(_post.image_url))
        }
    },[])

    const changeContents = (e) => {
        setContents(e.target.value);
    }

    const editPost = () => {
        dispatch(postActions.editPostFB(post_id, {contents: contents}))
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
                <Text margin='0px' size='36px' bold>{is_edit? '게시글 수정':'게시글 작성'}</Text>
                <Upload/>
            </Grid>
            <Grid>
                <Grid padding='16px'>
                    <Text margin='0px' size='24px' bold>미리보기</Text>
                </Grid>
                <Image shape='rectangle' src={preview? preview : 'https://firebasestorage.googleapis.com/v0/b/dab-react.appspot.com/o/images%2Fnone.gif?alt=media&token=b44f7f14-54e1-48d5-92df-9a6090d0859c' }/>
            </Grid>
            <Grid padding='16px'>
                <Input value={contents} _onChange={changeContents} label='게시글 내용' placeholder='게시글 작성' multiLine/>
            </Grid>
            <Grid>
                {is_edit? <Button _onClick={editPost}>게시물 수정</Button> : <Button _onClick={addPost}>게시물 작성</Button>}
            </Grid>
        </React.Fragment>
    )
}

export default PostWrite;
import React from "react";
import { Grid, Text, Button, Image, Input } from "../elements";
import Upload from "../shared/Upload";
import { useSelector, useDispatch } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";
import { actionCreators as imageActions } from "../redux/modules/image";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@material-ui/core";

const PostWrite = (props) => {
  const [checked, setChecked] = React.useState('');
  const [isActive, setIsActive] = React.useState(true);
  const handleChange = (event) => {
    setChecked(event.target.value);
  };
  const dispatch = useDispatch();
  // 부모 컴포넌트에서 이미 세션을 확인하고 세션이 있을때만 리덕스 상태를 로그인으로 바꿔주므로 리덕스만 확인
  const is_login = useSelector((state) => state.user.is_login);
  const preview = useSelector((state) => state.image.preview);
  const post_list = useSelector((state) => state.post.list);
  const { history } = props;

  const post_id = props.match.params.id;
  const is_edit = post_id ? true : false;

  let _post = is_edit ? post_list.find((p) => p.id === post_id) : null;


  const [contents, setContents] = React.useState(_post ? _post.contents : "");

  React.useEffect(() => {
    if (is_edit && !_post) {
      window.alert("post정보가 없습니다.");
      history.goBack();
      return;
    }

    if (is_edit) {
      dispatch(imageActions.setPreview(_post.image_url));
    }
  }, []);

  const changeContents = (e) => {
    setContents(e.target.value);
  };

    if (contents && preview && isActive){
        setIsActive(false)
    }

  // let checkedLayout;
  // const getLayout = (e) => {
  //   checkedLayout = e.target.value;
  //   console.log(checkedLayout)
  // };
  

  const editPost = () => {
    dispatch(
      postActions.editPostFB(post_id, { contents: contents })
    );
  };
  const addPost = () => {
    if(!checked){
        window.alert('레이아웃도 빼먹지 마세요ㅎ')
        return
    }
    
    dispatch(postActions.addPostFB(contents, checked));
  };
  if (!is_login) {
    return (
      <Grid margin="100px 0px" padding="16px" center>
        <Text size="32px" bold>
          잠시만요!
        </Text>
        <Text size="16px">로그인을 하셔야 글을 작성할 수 있어요.</Text>
        <Button
          _onClick={() => {
            history.replace("/login");
          }}
        >
          로그인 하러가기
        </Button>
      </Grid>
    );
  }

  return (
    <React.Fragment>
      <Grid padding="16px">
          <Upload/>
        <Text margin="0px" size="36px" bold>
          {is_edit ? "게시글 수정" : "게시글 작성"}
        </Text>
        {is_edit || (
          <FormControl component="fieldset">
            <FormLabel component="legend">Layout</FormLabel>
            <RadioGroup
              aria-label="gender"
              name="gender1"
              onChange={handleChange}
            >
              <FormControlLabel
                onChange={handleChange}
                value="is_flex"
                control={<Radio />}
                label="텍스트,이미지"
              />
              <FormControlLabel
                onChange={handleChange}
                value="is_reverse"
                control={<Radio />}
                label="이미지,텍스트"
              />
              <FormControlLabel
                onChange={handleChange}
                value="is_column"
                control={<Radio />}
                label="텍스트 상, 이미지 하"
              />
            </RadioGroup>
          </FormControl>
        )}
      </Grid>
      <Grid>
        <Grid padding="16px">
          <Text margin="0px" size="24px" bold>
            미리보기
          </Text>
        </Grid>
        <Image
          shape="rectangle"
          src={
            preview
              ? preview
              : "https://firebasestorage.googleapis.com/v0/b/dab-react.appspot.com/o/images%2Fnone.gif?alt=media&token=b44f7f14-54e1-48d5-92df-9a6090d0859c"
          }
        />
      </Grid>
      <Grid padding="16px">
        <Input
          value={contents}
          _onChange={changeContents}
          label="게시글 내용"
          placeholder="게시글 작성"
          multiLine
        />
      </Grid>
      <Grid>
        {is_edit ? (
          <Button _disabled={isActive} _onClick={editPost}>게시물 수정</Button>
        ) : (
          <Button _disabled={isActive} _onClick={addPost}>게시물 작성</Button>
        )}
      </Grid>
    </React.Fragment>
  );
};

export default PostWrite;

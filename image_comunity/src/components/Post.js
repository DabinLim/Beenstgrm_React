import React from "react";
import { Grid, Image, Text, Button } from "../elements";
import { history } from "../redux/configStore";
import Like from "../elements/Like";
import ChatBubbleOutlineRoundedIcon from "@material-ui/icons/ChatBubbleOutlineRounded";
import { useSelector, useDispatch } from "react-redux";
import { actionCreators as likeActions } from "../redux/modules/like";

const Post = (props) => {
  const dispatch = useDispatch();
  const like_state = useSelector((state) => state.like.list);
  const match_id = (e) => {
    if (e.post_id === props.id) {
      return true;
    }
  };

  const changeLike = () => {
    let like_id;
    let nowLike;
    // 현재 props.id와 post_id가 일치하는 데이터만 필터링함 (1개가 나옴)
    const _match = like_state.filter(match_id);
    console.log(_match)
    // _match[0] 으로 _match에 접근이 불가능해 for문을 돌려 접근 ( _match의 형태는 [{..}]) 배열안의 객체 형태 ) 
    for (let i = 0; i < _match.length; i++) {
      if (_match[i].id) {
        like_id = _match[i].id;
        nowLike = _match[i].user_like;
        console.log(_match[i])
      }
    }
    console.log(like_id)
    console.log(nowLike)
    console.log('go')
    dispatch(likeActions.addLikeFB(props.id, like_id, nowLike));

  };

  return (
    <React.Fragment>
      <Grid>
        <Grid is_flex>
          <Grid is_flex width="auto">
            <Image shape="circle" src={props.src} />
            <Text margin="14px 10px" bold>
              {props.user_info.user_name}
            </Text>
          </Grid>
          <Grid is_flex width="auto">
            <Text>{props.insert_dt}</Text>
            {props.is_me && (
              <Grid margin='0px' width='auto'>
              <Button
                width="auto"
                padding="8px"
                margin="4px"
                _onClick={() => {
                  history.push(`/write/${props.id}`);
                }}
              >
                수정
              </Button>
              <Button
              width="auto"
              padding="8px"
              margin="4px"  
            >
              삭제
            </Button>
              </Grid>
            )}
          </Grid>
        </Grid>
        {/* <Grid padding="16px">
          <Text>{props.contents}</Text>
        </Grid> */}
        <Grid layout={props.layout} _onClick={()=>{history.push(`post/${props.id}`)}}>
        <Text>{props.contents}</Text>
          <Image shape="rectangle" src={props.image_url}/>
        </Grid>
        <Grid padding="16px">
          <Grid is_flex width="20%">
            <Grid>
              <Like id={props.id} _onClick={changeLike} />
            </Grid>
            <Grid>
              <ChatBubbleOutlineRoundedIcon onClick={()=>{history.push(`post/${props.id}`)}}/>
            </Grid>
          </Grid>
          <Text bold margin="0px">
            댓글 {props.comment_cnt}개
          </Text>
          <Text bold margin="0px">
            좋아요 {props.like_cnt}개
          </Text>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

Post.defaultProps = {
  user_info: {
    user_name: "Dabin",
    user_profile:
      "https://reactdabin.s3.ap-northeast-2.amazonaws.com/file-2021-03-03-21-38-26.png",
  },
  image_url:
    "https://reactdabin.s3.ap-northeast-2.amazonaws.com/file-2021-03-03-21-38-26.png",
  contents: "콩이네요",
  comment_cnt: "10",
  like_cnt: "10",
  insert_dt: "2021-03-26T16:29",
  is_me: false,
};

export default Post;

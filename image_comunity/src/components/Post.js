import React from "react";
import {Grid, Image, Text, Button} from '../elements';
import {history} from '../redux/configStore';

const Post = (props) => {

  return (
    <React.Fragment>
      <Grid>
        <Grid is_flex>
            <Grid is_flex width='auto'>
            <Image shape='circle' src={props.src}/>
            <Text margin='14px 10px' bold>{props.user_info.user_name}</Text>
            </Grid>
            <Grid is_flex width='auto'>
            <Text>{props.insert_dt}</Text>
            {props.is_me && <Button width='auto' padding='8px' margin='4px' _onClick={() => {
              history.push(`/write/${props.id}`)
            }}>수정</Button>}
            </Grid>
        </Grid>
        <Grid padding="16px">
            <Text>{props.contents}</Text>
        </Grid>
        <Grid>
            <Image shape='rectangle' src={props.image_url}/>
        </Grid>
        <Grid padding="16px">
          <Text bold>댓글 {props.comment_cnt}개</Text>
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
  comment_cnt: '댓글 10개',
  insert_dt: "2021-03-26T16:29",
  is_me: false,
};

export default Post;

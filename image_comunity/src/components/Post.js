import React from "react";
import {Grid, Image, Text} from '../elements';

const Post = (props) => {
  return (
    <React.Fragment>
      <Grid>
        <Grid is_flex>
            <Image shape='circle' src={props.src}/>
            <Text bold>{props.user_info.user_name}</Text>
            <Text>{props.insert_dt}</Text>
        </Grid>
        <Grid padding="16px">
            <Text>{props.contents}</Text>
        </Grid>
        <Grid>
            <Image shape='rectangle' src={props.src}/>
        </Grid>
        <Grid padding="16px">
          <Text bold>{props.comment_cnt}</Text>
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
};

export default Post;

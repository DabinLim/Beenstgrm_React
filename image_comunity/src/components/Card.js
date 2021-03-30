import React from "react";
import { Grid, Image, Text } from "../elements";

import {history} from '../redux/configStore';

const Card = (props) => {
  const { image_url, user_name, post_id } = props;

  return (
    <Grid _onClick={()=>{history.push(`/post/${post_id}`)}} padding="16px" is_flex bg="#ffffff" margin="16px 0px">
      <Grid width="auto">
        <Image size={85} shape="square" src={image_url} />
      </Grid>
      <Grid margin="18px">
        <Text>
          <b>{user_name}</b> 님이 게시글에 댓글을 남겼습니다!
        </Text>
      </Grid>
    </Grid>
  );
};

Card.defaultProps = {
    image_url:'',
    user_name: '',
    post_id: null,
}

export default Card;
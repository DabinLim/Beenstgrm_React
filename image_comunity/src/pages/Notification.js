import React from "react";
import Card from "../components/Card";
import { Grid, Text, Image } from "../elements";
import post from "../redux/modules/post";

const Notification = (props) => {
  let noti = [
    {
      user_name: "dabin",
      post_id: "post1",
      image_url: "",
    },
    {
      user_name: "dabin",
      post_id: "post2",
      image_url: "",
    },
    {
      user_name: "dabin",
      post_id: "post3",
      image_url: "",
    },
    {
      user_name: "dabin",
      post_id: "post4",
      image_url: "",
    },
  ];
  return (
    <React.Fragment>
      <Grid padding="16px" bg="#EFF6FF">
        {noti.map((n) => {
          return (
            <Card key={post.id} {...n}></Card>
          );
        })}
      </Grid>
    </React.Fragment>
  );
};

export default Notification;

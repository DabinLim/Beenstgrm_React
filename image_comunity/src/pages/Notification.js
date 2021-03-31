import React from "react";
import Card from "../components/Card";
import { Grid, Text, Image } from "../elements";
import post from "../redux/modules/post";

import {realtime} from '../shared/firebase';
import {useSelector} from 'react-redux';

const Notification = (props) => {
  const user = useSelector(state => state.user.user);
  const [noti, setNoti] = React.useState([]);
  React.useEffect(() => {
    if(!user){
      return;
    }

    const notiDB = realtime.ref(`noti/${user.uid}/list`);

    // realtimeDB의 경우는 오름차순만 지원
    const _noti = notiDB.orderByChild('insert_dt');

    _noti.once('value', snapshot => {
      if(snapshot.exists()){
        let _data = snapshot.val();
        console.log(_data)
        // 내림차순으로 정렬
        let _noti_list = Object.keys(_data).reverse().map(s => {
          return _data[s];
        })

        console.log(_noti_list);
        setNoti(_noti_list)
      }
    })
  },[user]);

  return (
    <React.Fragment>
      <Grid padding="16px" bg="#EFF6FF">
        {noti.map((n, index) => {
          if (n.post_id ==='new'){
            return (<Grid>가입을 축하합니다.</Grid>)
          }else{
            return (
              <Card key={`noti_${index}`} {...n}></Card>
            );
          }
        })}
      </Grid>
    </React.Fragment>
  );
};

export default Notification;

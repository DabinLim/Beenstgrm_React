import React from "react";
import { Grid, Text, Button } from "../elements";
import { getCookie, deleteCookie } from "../shared/Cookie";

import { useSelector, useDispatch } from "react-redux";
import { actionCreators as userActions } from "../redux/modules/user";
import { history } from "../redux/configStore";
import { apiKey } from "../shared/firebase";

const Header = (props) => {
  const dispatch = useDispatch();

  // 리덕스의 로그인 상태 가져오기
  const is_login = useSelector((state) => state.user.is_login);

  // 세션에 저장된 키 가져오기
  const _session_key = `firebase:authUser:${apiKey}:[DEFAULT]`;

  // 세션 스토리지에 세션이 있으면 true 없으면 false
  const is_session = sessionStorage.getItem(_session_key)? true: false;

  // 리덕스의 로그인 상태가 true이고 세션 스토리지의 세션이 있다면 렌더링
  if (is_login && is_session ) {
    return (
      <React.Fragment>
        <Grid is_flex padding="4px">
          <Grid>
            <Text margin="0px" size="24px" bold>
              헬로
            </Text>
          </Grid>
          <Grid is_flex>
            <Button text="내 정보"></Button>
            <Button _onClick={() => {
              history.push('/noti')
            }}text="알림"></Button>
            <Button
              text="로그아웃"
              _onClick={() => {
                dispatch(userActions.logoutFB());
              }}
            ></Button>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <Grid is_flex padding="4px">
          <Grid>
            <Text margin="0px" size="24px" bold>
              헬로
            </Text>
          </Grid>
          <Grid is_flex>
            <Button
              text="로그인"
              _onClick={() => {
                history.push("/login");
              }}
            ></Button>
            <Button
              text="회원가입"
              _onClick={() => {
                history.push("/signup");
              }}
            ></Button>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
};

Header.defaultProps = {};

export default Header;

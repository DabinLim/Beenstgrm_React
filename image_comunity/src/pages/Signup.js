import React from "react";

import { Input, Grid, Text, Button } from "../elements";
import {useDispatch} from 'react-redux';
import {actionCreators as userActions} from '../redux/modules/user';
import {emailCheck, pwdCheck} from '../shared/common';

const Signup = (props) => {
  const dispatch = useDispatch();
  const [id, setId] = React.useState('');
  const [pwd, setPwd] = React.useState('');
  const [user_name, setUserName] = React.useState('');
  const [pwd_check, setPwdCheck] = React.useState('');
  let num = 0;
  const signup = () => {
    if(id === '' || pwd === '' || user_name === ''){
      window.alert('이메일, 패스워드, 닉네임을 모두 입력하세요.')
      return;
    }
    if(pwd !== pwd_check){
      if (num<3){
        num += 1;
        window.alert('패스워드가 다릅니다.'+num)
        return;
      } else {
        window.alert('너 바보냐?');
        return;
      }
    }
    if(!pwdCheck(pwd)){
      window.alert('영문,숫자,특수문자를 조합하여 9~16자리 비밀번호를 설정해주세요.')
      return
    }
    if(!emailCheck(id)){
      window.alert('이메일 형식이 올바르지 않습니다.');
      return;
    }
    dispatch(userActions.signupFB(id, pwd, user_name))
  }
  return (
    <React.Fragment>
      <Grid padding="16px">
        <Text size="32px" bold>
          회원가입
        </Text>
        <Grid padding="16px 0px">
          <Input
            label="아이디"
            placeholder="아이디를 입력해주세요."
            _onChange={(e) => {
              setId(e.target.value);
            }}
          ></Input>
        </Grid>
        <Grid padding="16px 0px">
          <Input
            label="닉네임"
            placeholder="닉네임을 입력해주세요."
            _onChange={(e) => {
              setUserName(e.target.value);
            }}
          ></Input>
        </Grid>
        <Grid padding ='16px 0px'>
          <Input
            type='password'
            label="패스워드"
            placeholder="패스워드를 입력해주세요."
            _onChange={(e) => {
              setPwd(e.target.value);
            }}
          ></Input>
        </Grid>
        <Grid padding ='16px 0px'>
          <Input
            type='password'
            label="패스워드 확인"
            placeholder="패스워드를 다시 입력해주세요."
            _onChange={(e) => {
              setPwdCheck(e.target.value);
            }}
          ></Input>
        </Grid>
      <Grid>
        <Button
          text="회원가입하기"
          _onClick={() => {
            signup();
          }}
        ></Button>
      </Grid>
      </Grid>
    </React.Fragment>
  );
};

Signup.defaultProps = {};

export default Signup;

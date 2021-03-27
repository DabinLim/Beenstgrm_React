import React from "react";
import styled from "styled-components";
import { Input, Grid, Text, Button } from "../elements";
import {useDispatch} from 'react-redux';
import {actionCreators as userActions} from '../redux/modules/user';

const Signup = (props) => {
  const dispatch = useDispatch();
  const [id, setId] = React.useState('');
  const [pwd, setPwd] = React.useState('');
  const [user_name, setUserName] = React.useState('');
  const [pwd_check, setPwdCheck] = React.useState('');

  const signup = () => {

    dispatch(userActions.signupFB(id, pwd, user_name))
    if(id === '' || pwd === '' || user_name === ''){
      return;
    }
    if(pwd !== pwd_check){
      return;
    }
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

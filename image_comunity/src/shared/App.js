import "./App.css";
import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import {ConnectedRouter} from 'connected-react-router';
import {history} from '../redux/configStore';
import PostList from "../pages/PostList";
import Login from "../pages/Login";
import Signup from '../pages/Signup';
import Header from "../components/Header";
import { Grid } from "../elements";
import {actionCreators as userActions} from '../redux/modules/user';
import {useDispatch} from 'react-redux';
import { apiKey } from "./firebase";

function App() {
  const dispatch = useDispatch();

  
  // 세션 정보가 있는지 확인
  const _session_key = `firebase:authUser:${apiKey}:[DEFAULT]`;
  const is_session = sessionStorage.getItem(_session_key)? true: false;

  React.useEffect(() => {
    // 세션에 로그인 정보가 있다면
    if(is_session){
      // 로그인 체크 
      dispatch(userActions.loginCheckFB());
    }
  },[]);
  return (
    <React.Fragment>
      <Grid>
        <Header></Header>
        <BrowserRouter>
        <ConnectedRouter history={history}>
          <Route path="/" exact component={PostList} />
          <Route path="/login" exact component={Login} />
          <Route path="/signup" exact component={Signup} />
          </ConnectedRouter>
        </BrowserRouter>
      </Grid>
    </React.Fragment>
  );
}

export default App;
import React from "react";
import { useSelector } from "react-redux";
import { apiKey } from "./firebase";

const Permit = (props) => {
  const is_login = useSelector((state) => state.user.is_login);

  // 세션에 저장된 키 가져오기
  const _session_key = `firebase:authUser:${apiKey}:[DEFAULT]`;

  // 세션 스토리지에 세션이 있으면 true 없으면 false
  const is_session = sessionStorage.getItem(_session_key) ? true : false;

  if (is_session && is_login) {
    return <React.Fragment>{props.children}</React.Fragment>;
  } 
    return null;
};

export default Permit;

export const emailCheck = (email) => {
    // ^ (첫글자) 0-9까지 a-z까지 A-Z까지 , ([-_.의 특수문자 및 숫자 알파벳 여러개])*
    let _reg = /^[0-9a-zA-Z]([-_.0-9a-zA-Z])*@[0-9a-zA-Z]([-_.0-9a-zA-Z])*.([a-zA-Z])*/;
    return _reg.test(email);
}
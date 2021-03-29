import React from 'react';
import _ from 'lodash';

const Search = () => {

    const [text, setText] = React.useState('');

    const debounce = _.debounce((e) => {
        console.log('debounce:::',e.target.value);
    }, 1000)
    // 컴포넌트가 리렌더링 되더라도 debounce 는 초기화 시키지 않음, 2번쨰로 준 인자값 [] 의 값이 변하면 debounce를 초기화 시킴
    const keyPress = React.useCallback(debounce, []);
    // state가 바뀔때마다 debounce가 초기화(리렌더링) 돼서 제대로 동작을 못함.

    const onChange = (e) => {
        setText(e.target.value);
        keyPress(e)
    }

    const throttle = _.throttle((e) => {
        console.log('throttle:::',e.target.value);
    }, 1000)

    return (
        <div>
            <input type='text' onChange={onChange} value={text}/>
        </div>
    )
}

export default Search;
import React from 'react';
import styled from 'styled-components';
import { Text, Grid } from './index'

const Input = (props) => {

    const {label, placeholder, _onChange, type, multiLine} = props

    if(multiLine){
        return (
            <Grid>
                <Text margin='0px'>{label? label : ''}</Text>
                <ElTextArea rows={10} placeholder={placeholder} onChange={_onChange}></ElTextArea>
            </Grid>
        )
    }

    return (
        <React.Fragment>
            <Grid>
            <Text margin = '0px'>{label? label : ''}</Text>
            <ElInput type = {type} placeholder ={placeholder} onChange ={_onChange}/>
            </Grid>
        </React.Fragment>
    )
}

Input.defaultProps = {
    multiLine: false,
    label: false,
    placeholder: '텍스트를 입력해주세요.',
    _onChange: () => {},
    type: 'text',
};

const ElTextArea = styled.textarea`
    border: 1px solid #212121;
    border-radius: 5px;
    width: 100%;
    padding: 12px 4px;
    box-sizing: border-box;
`;

const ElInput = styled.input`
    border: 1px solid #212121;
    border-radius: 5px;
    width: 100%;
    padding: 12px 4px;
    box-sizing: border-box;
`;

export default Input;
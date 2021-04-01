import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {actionCreators} from '../redux/modules/image';

const Upload = (props) => {
    const dispatch = useDispatch();
    const fileInput = React.useRef();
    const is_uploading = useSelector(state => state.image.uploading);

    const selectFile =(e) => {
        // FileReader 객체 생성
        const reader = new FileReader();
        const file = fileInput.current.files[0];
        // 파일의 data_url 값 가져오기
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            // image 리덕스에 data_url 보내기
            dispatch(actionCreators.setPreview(reader.result))
        }
    }

    return (
        <React.Fragment>
            <input type='file' onChange={selectFile} ref={fileInput} disabled={is_uploading}/>
            
        </React.Fragment>
    )
}

export default Upload;
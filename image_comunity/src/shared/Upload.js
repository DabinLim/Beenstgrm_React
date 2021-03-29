import React from 'react';
import {Button} from '../elements';
import {storage} from'../shared/firebase';
import { useDispatch, useSelector } from 'react-redux';
import {actionCreators, actionCreators as imageAction} from '../redux/modules/image';

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
    const uploadFB = () => {
        // uploadImageFB 로 현재 선택한 파일 보냄
        let image = fileInput.current.files[0];
        dispatch(imageAction.uploadImageFB(image));
    }


    return (
        <React.Fragment>
            <input type='file' onChange={selectFile} ref={fileInput} disabled={is_uploading}/>
            <Button _onClick={uploadFB}>업로드하기</Button>
        </React.Fragment>
    )
}

export default Upload;
import {createAction, handleActions} from 'redux-actions';
import produce from 'immer';
import {storage} from '../../shared/firebase';

const UPLOADING = 'UPLOADING';
const UPLOAD_IMAGE = 'UPLOAD_IMAGE';
const SET_PREVIEW = 'SET_PREVIEW';

const uploading = createAction(UPLOADING, (uploading) => ({uploading}));
const uploadImage = createAction(UPLOAD_IMAGE, (image_url) => ({image_url}));
// data_url을 받아옴
const setPreview = createAction(SET_PREVIEW, (preview) => ({preview}));

const initialState = {
    image_url:'',
    uploading:false,
    preview:null,
}

const uploadImageFB = (image) => {
    return function(dispatch, getState, {history}){

        dispatch(uploading(true))
        // storage에 받아온 이미지 저장
        const _upload = storage.ref(`images/${image.name}`).put(image);
        // 이미지 저장 후 그 이미지의 다운로드 url을 uploadImage 액션을 생성시켜 리덕스 state에 저장
        _upload.then((snapshot) => {
            snapshot.ref.getDownloadURL().then((url) => {
                dispatch(uploadImage(url))
                console.log(url)
            })
        })
    }
}


export default handleActions({
    [UPLOAD_IMAGE]: (state, action) => produce(state, (draft) => {
        draft.image_url = action.payload.image_url;
        draft.uploading = false
    }),

    [UPLOADING]: (state, action) => produce(state, (draft) => {
        draft.uploading = action.payload.uploading;
    }),

    [SET_PREVIEW]: (state, action) => produce(state, (draft) => {
        draft.preview = action.payload.preview;
    })

},initialState);

const actionCreators = {
    uploadImage,
    uploadImageFB,
    setPreview,
}

export {actionCreators};
import React from 'react';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderRoundedIcon from '@material-ui/icons/FavoriteBorderRounded';
import {firestore} from'../shared/firebase';
import {actionCreators as likeActions} from '../redux/modules/like';

import {useSelector, useDispatch} from 'react-redux';

const Like = (props) => {
    const dispatch = useDispatch()
    const { _onClick } = props
    const [like,setLike] = React.useState(false)
    const like_state = useSelector(state => state.like.list)
    console.log(like_state)
    const match_id = (e) => {
        if(e.post_id === props.id){
            return true
        }
    }
    const _match = like_state.filter(match_id);
    let match_like = false
    for(let i = 0; i<_match.length; i ++){
        if(_match[i].user_like === true){
            match_like = true
        }else {
            match_like = false
        }
    }
    React.useEffect(()=>{
         
            dispatch(likeActions.setLikeFB(props.id))
        
    },[])
    // const user_id = useSelector(state => state.user.user.uid)
    // const likeDB = firestore.collection('like');
    // likeDB.where('post_id','==',props.id).where('user_id','==',user_id).get().then((docs) => {
    //     docs.forEach((doc) => {
    //         setLike(doc.data().user_like)
    //     }
    // )})
    return (
        <React.Fragment>
            {match_like? <FavoriteIcon color='secondary' onClick={_onClick}/> : <FavoriteBorderRoundedIcon onClick={_onClick}/>}
        </React.Fragment>
    )
}

Like.defaultProps = {
    _onClick: () => {}
}

export default Like;
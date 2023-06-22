
import { combineReducers } from 'redux';
import { createStore } from 'redux';
const userDetails = (state = {userdetails:{}}, action) => {
    switch (action.type) {
        case 'SET_Token':
            state.userdetails = action.userdetails;
            return state.userdetails;
        default:
            return state.userdetails;

    }
}
const reducer = combineReducers({ userDetails });
const Store=createStore(reducer)


export default Store
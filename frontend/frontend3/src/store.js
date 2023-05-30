import {createStore,combineReducers,applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import {authReducer} from './reducers/userReducer'
import { cryptoReducer } from './reducers/cryptoReducer'



let initialState=localStorage.getItem('reduxState') ? JSON.parse(localStorage.getItem('reduxState')): {}
const reducer =combineReducers({
    auth:authReducer,
    crypto:cryptoReducer
})
const middleware=[thunk]
const store=createStore(reducer,initialState,composeWithDevTools(applyMiddleware(...middleware)))

export default store
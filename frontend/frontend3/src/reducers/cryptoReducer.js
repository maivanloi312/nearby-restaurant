import { CRYPTO_CURRENCY_REQUEST, CRYPTO_REQUEST_SUCCESS } from "../constants/etherConstants"

export const cryptoReducer=(state={crypto:{}},action)=>{
    switch(action.type){
        case CRYPTO_CURRENCY_REQUEST:
        case CRYPTO_REQUEST_SUCCESS:
            return {
                ...state,
                crypto:action.payload
            }
        default:
            return state
    }
}
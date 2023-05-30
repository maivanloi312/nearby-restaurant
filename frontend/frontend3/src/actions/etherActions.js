import clientRequest from "../APIFeatures/clientRequest"
import { CRYPTO_CURRENCY_REQUEST, CRYPTO_REQUEST_SUCCESS } from "../constants/etherConstants"

export const getCryptoCurrency=()=>async( dispatch )=>{
    try{
        dispatch({type:CRYPTO_CURRENCY_REQUEST})
        const crypto=await clientRequest.getCryptoCompare()
        console.log(crypto)
        dispatch({
            type:CRYPTO_REQUEST_SUCCESS,
            payload:crypto
        })
    }
    catch(error){

    }
}
import Singleton from "../designpatterns/singleton"
import { IUser } from './../designpatterns/factory';

export default class UserRegisterDTO{
    private email: string
    private password: string

    constructor(email:string, password:string){
        this.email=email
        this.password=password
    }

    public static getInstance(email:string, password:string):UserRegisterDTO{
        return Singleton<UserRegisterDTO> ('user-register-dto', UserRegisterDTO,email,password) 
    }
}


export interface IUser{
    registerUser(email:string,password:string):any
}

export class UserFactory{
    public static registerUser(type: string){
        if(type==='REGISTER_USER'){
        }
    }
}
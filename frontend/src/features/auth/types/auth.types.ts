export interface User {

 id:string;

 email:string;

 first_name:string;

 last_name:string;

 phone?:string;

 country?:string;

 role: "admin"| "syndic"| "owner" | undefined;

}

export interface ForgotpasswordData {
 
    email:string;

}

export interface LoginData {
 
    email:string;
    
 password:string;

}



export interface RegisterData {

 email:string;

 password:string;

 first_name:string;

 last_name:string;

 phone?:string;

 country?:string;

 role: "admin"| "syndic"| "owner";
}



export interface LoginResponse {

 success:boolean;

 token:string;

 user?:User;

}



export interface MeResponse {

 success:boolean;

 data:User;

}
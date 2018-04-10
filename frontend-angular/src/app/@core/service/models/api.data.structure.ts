export interface APIData {
    err,
    msg: String,
    data;
}

export interface User {
    email:any,
    password:any,
    role:any,
    username:any

}

export interface Profile {
    email ,
    description,
    password,
    confirmPassword;
}

export interface FileData {
    file: File
  }

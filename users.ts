export interface Users{
  id : number
  username:string
  password:string

}

export const users : Array<Users> = [
    { id: 1, 
      username: 'admin', 
    password: 'admin@123' },
    { id: 2,
       username: 'admin2', 
       password: 'strongpasswordEverywhere' }
];

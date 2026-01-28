import { UserState } from './user-state';

export interface User {
    userId:string;
    rolId:string;
    stateId:string;
    name:string;
    email:string;
    verifiedAt:Date,
    createdAt:Date,
    updatedAt:Date,
    state?:UserState,
}

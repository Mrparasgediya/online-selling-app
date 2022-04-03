import {HydratedDocument} from 'mongoose'

export default interface IUser {
    username: string,
    password: string,
    role: 'admin' | 'customer'
};

export type UserDocument = HydratedDocument<IUser>;

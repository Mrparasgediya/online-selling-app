import mongoose from "mongoose";
import IUser from 'types/IUser'

const userSchema = new mongoose.Schema<IUser>({
    username: {
        type: String,
        required: [true, 'Enter username'],
        validate: {
            validator: (usernameToValidate: string) => !!usernameToValidate.trim().length,
            message: () => "Entner valid username"
        }
    },
    password: {
        type: String,
        required: [true, 'Enter passwrod'],
        validate: {
            validator: (passwordToValidate: string) => !!passwordToValidate.trim().length,
            message: "Entner valid password"
        }
    },
    role: {
        type: String,
        enum: ['admin', 'customer'],
        required: [true, 'Enter user role'],
        validate: {
            validator: (roleToCheck) => !!roleToCheck.trim().length && (roleToCheck === 'admin' || roleToCheck === 'customer'),
            message: "Enter valid user role"
        }
    }
}, {
    timestamps: true
});

const User: mongoose.Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema)

export default User;
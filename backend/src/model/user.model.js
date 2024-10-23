import { Schema, model } from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
        index: true
    },
    email: {
        unique: true,
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: true
    }
}, {timestamps: true});

userSchema.pre("save", async function(next){
    // Check if the password is modified or not
    if(!this.isModified("password")) return next();

    const salRound = 10;
    // Hash the password
    try {
        const hashedPass = await bcrypt.hash(this.password, salRound);
        this.password = hashedPass;
        return next();    
    } catch (error) {
        console.log(error);
        return next(error);
    }

});

userSchema.methods.comparePassword = async function(enteredPass){
    try {
        return await bcrypt.compare(enteredPass, this.password);
    } catch (error) {
        console.log( 'password comparison failed', error);
        return false;
    }
}

userSchema.index("username", {unique: true});
userSchema.index("email", {unique: true});

const User = model("User", userSchema);

export {User};
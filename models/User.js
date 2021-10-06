// import { model, Schema } from 'mongoose';
import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    createAt: String
});

export default model('User', userSchema);
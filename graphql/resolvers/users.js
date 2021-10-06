import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/User.js';
import path from 'path';

const __dirname = path.resolve();
const envPath = path.join(__dirname, "./.env");

const { SECRET_KEY } = process.env;

export default {
    Mutation: {
        // parent : what was input ? 
        //args : registerInput 
        register(_, { registerInput: { username, email, password, confirmPassword } }, context, info) {
            //TODO : validate user data
            // TODO : Make sure user doesn't already exist
            //TODO : hass password and create an auth token
            password = (async () => {

                await bcrypt.hash(password, 12)
            });

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            });

            const res = (async () => {
                await newUser.save()

            });

            const token = jwt.sign({
                id: res.id,
                email: res.email,
                username: res.username
            }, `${SECRET_KEY}`, { expiresIn: '1h' });
            return {
                ...res._doc,
                id: res._id,
                token
            }
        }
    }
}
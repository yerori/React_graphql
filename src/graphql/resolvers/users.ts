import { UserInputError } from 'apollo-server-express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/User';
import { validateLoginInput } from '../../util/validators';
// import path from 'path';
// import { IUser } from '../../type/interfaces';
function generateToken(user) {

    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, process.env.SECRET_KEY, { expiresIn: '1h' }
    );
}


export default {
    Mutation: {
        async login(_, { username, password }) {
            const { errors, valid } = validateLoginInput(username, password);

            if (!valid) {
                throw new UserInputError('Errors', { errors });
            }

            const user = await User.findOne({ username });

            if (!user) {
                username = 'User not found';
                throw new UserInputError('User not found', { errors });
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                password = 'Wrong crendetials';
                throw new UserInputError('Wrong crendetials', { errors });
            }

            const token = generateToken(user);

            return {
                ...user._doc,
                id: user._id,
                token
            }
        },
        // parent : what was input ? 
        //args : registerInput 
        async register(_, { registerInput: { username, email, password, confirmPassword } }, context, info) {
            //TODO : validate user data
            // TODO : Make sure user doesn't already exist
            //TODO : hass password and create an auth token
            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            });

            console.log('newUser : ', newUser);


            const res = await newUser.save();

            const token = generateToken(res);

            console.log('secret key : ', process.env.SECRET_KEY);
            return {
                ...res._doc,
                id: res._id,
                token
            }
        },

    }   //Mutation
}
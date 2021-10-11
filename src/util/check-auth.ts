import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-errors';


export const checkAuth = (context) => {
    // context = { ...headers }
    const authHeader = context.req.headers.authorization;
    if (authHeader) {
        // Bearer .... 
        const token = authHeader.split('Bearer ')[1];
        // valified token
        if (token) {
            try {
                const user = jwt.verify(token, process.env.SECRET_KEY);
                return user;
            } catch (e) {
                throw new AuthenticationError('Invalid/Expired token');
            }
        }
        throw new Error('Authentication token must be \'Bearer [token]');
    }
    throw new Error('Authorization header must be provided');
}
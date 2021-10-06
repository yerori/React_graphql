// mongoose 모듈 가져오기
import mongoose from 'mongoose';

// mongoose 모듈에서 schema 받아오기
const { Schema } = mongoose;

const postSchema = new Schema({
    body: String,
    username: String,
    createdAt: String,
    comments: [
        {
            body: String,
            username: String,
            createdAt: String
        }
    ],
    likes: [
        {
            username: String,
            createdAt: String,
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
});

const Post = mongoose.model('Post', postSchema);
export default Post;
import Post from '../../models/Post';
import { checkAuth } from '../../util/check-auth';
import { AuthenticationError, UserInputError } from 'apollo-server-errors';

export default {
    Query: {
        async getPosts() {
            try {
                // 등록된 최신순으로 정렬 
                const posts = await Post.find().sort({ createdAt: -1 });
                return posts;
            } catch (err) {
                throw new Error(err);
            }
        },
        async getPost(_, { postId }) {
            try {
                const post = await Post.findById(postId);
                //if post exists
                if (post) {
                    return post;
                } else {
                    throw new Error('Post not found');
                }
            } catch (e) {
                throw new Error(e);
            }
        }
    },
    Mutation: {
        // _ : parent 의미
        async createPost(_, { body }, context) {
            const user = checkAuth(context);
            const newPost = new Post({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            });
            const post = await newPost.save();

            context.pubsub.publish('NEW_POST', {
                newPost: post
            })
            return post;
        },
        async deletePost(_, { postId }, context) {
            const user = checkAuth(context);

            try {
                const post = await Post.findById(postId);
                if (user.username === post.username) {
                    await post.delete();
                    return 'Post deleted successfully';
                } else {
                    throw new AuthenticationError('Action not allowed');
                }
            } catch (e) {
                throw new Error(e);
            }
        },
        async likePost(_, { postId }, context) {
            const { username } = checkAuth(context);

            const post = await Post.findById(postId);
            console.log('post : ', post);

            if (post) {
                if (post.likes.find(like => like.username === username)) {
                    //Post already likes, unlike it 
                    post.likes = post.likes.filter(like => like.username !== username);

                } else {
                    // Not liked, like post
                    post.likes.push({
                        username,
                        createdAt: new Date().toISOString()
                    })
                }
                await post.save();
                return post;
            } else throw new UserInputError('Post not found');
        }
    },
    Subscription: {
        newPost: {
            subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST')
        }
    }
}
const { Schema, model } = require('mongoose');

const thoughtSchema = new Schema(
    {
        thoughtText: {
        type: String,
        required: 'You need to provide a thought!',
        minlength: 1,
        maxlength: 280
        },
        createdAt: {
        type: Date,
        default: Date.now
        },
        username: {
        type: String,
        required: 'You need to provide a username!'
        },
        reactions: [
        {
            reactionId: {
            type: Schema.Types.ObjectId
            },
            reactionBody: {
            type: String,
            required: true,
            maxlength: 280
            },
            username: {
            type: String,
            required: 'You need to provide a username!'
            },
            createdAt: {
            type: Date,
            default: Date.now
            }
        }
        ]
    }

);

thoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});


const Thought = model('Thought', thoughtSchema);

module.exports = Thought;
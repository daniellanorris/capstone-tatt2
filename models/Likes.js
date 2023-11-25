import mongoose from 'mongoose';

const likesSchema = new mongoose.Schema({
    number: {
        type: Number,
        required: false
    }, 
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist'
    },
});

// likesSchema.index({ user: 1, artist: 1 }, { unique: true });

module.exports = mongoose.models.Likes || mongoose.model('Likes', likesSchema);
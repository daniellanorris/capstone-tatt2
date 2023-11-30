import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import Likes from './Likes'

const tattooStylesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    }
});

module.exports = mongoose.models.tattooStyles || mongoose.model('tattooStyles', tattooStylesSchema);



const ArtistSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        maxlength: [40, 'Username cannot be more than 40 characters'],
    },
    password: {
        type: String,
        required: [true, 'Password needs to be added'],
        maxlength: [100, 'Password cannot be more than 100 characters'],
    },
    firstname: {
        type: String,
        required: true,
        maxlength: [20],
    },
    lastname: {
        type: String,
        required: true,
        maxlength: [20],
    },
    tattooStyle: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'tattooStyles',
        },
    ],
    image: [
        {
            type: String,
        },
    ],
    profilePicture: {
        type: String,
    },
    location: {
        type: String,
    },
    bio: {
        type: String,
    },
    bookingUrl: {
        type: String,
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Likes',
        }
    ],
});


ArtistSchema.pre('save', async function (next) {
    if (this.isNew)
        this.password = await bcrypt.hash(this.password, 10);
    next();
    
});

ArtistSchema.methods.incrementLikes = async function (userId, artistId) {

        // const existingLike = await Likes.findOne({ user: userId, artist: artistId});
        // console.log('existing like:', existingLike);

        // if (existingLike) {
        //     console.log('User has already liked this artist.');
        //     return;
        // }


    const newLike = new Likes({
        user: userId,
        number: 1,
        artist: artistId,
    });


    try {
        const result = await newLike.save();
    
        this.likes.push(newLike);
    
        await this.save(); 
    
    } catch (error) {
        if (error.code === 11000) {
            console.error('User has already liked this artist.');
            return;
        }
        console.error('Error saving like for artist ID:', this._id, error);
    }
};


module.exports = mongoose.models.Artist || mongoose.model('Artist', ArtistSchema);

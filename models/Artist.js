import mongoose from 'mongoose';
import {Image} from './Image'

const tattooStylesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    }
});

export const TattooStyle = mongoose.models.tattooStyles || mongoose.model('tattooStyles', tattooStylesSchema);



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
        unique: false,
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
            type: String,
            ref: 'tattooStyles'
        },
    ],
    image: [
        {
            type: String,
        },
    ], 
    profilePicture: 
    {
        type: String,
    }, 
    location: {
        type: String
    }, 
    bio: {
        type: String
    }, 
    bookingUrl: 
    {
        type: String
    }
});

export default mongoose.models.Artist || mongoose.model('Artist', ArtistSchema);
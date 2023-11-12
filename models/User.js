import mongoose from 'mongoose'
import bcrypt from 'bcrypt'


const savedArtistsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist',
    }
});

module.exports = mongoose.models.SavedArtists || mongoose.model('SavedArtists', savedArtistsSchema);

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        maxlength: [40, 'Username cannot be more than 40 characters']
    },
    password: {
        type: String,
        required: [true, 'Password needs to be added'],
        maxlength: [100, 'Password cannot be more than 100 characters']
    },
    firstname: {
        type: String,
        required: true,
        maxlength: [20]
    },
    lastname: {
        type: String,
        required: true,
        maxlength: [20]
    },
    savedArtists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist', 
        required: false
    }], 
    profileUrl: {
        type: String
    },
    location: [
        {
            latitude: {
                type: Number, 
                required: true,

            }, 
            longitude: {
                type: Number, 
                required: true
            }
        }
    ]
});



userSchema.pre('save', async function(next) {
    if (this.isNew)
      this.password = await bcrypt.hash(this.password, 10)
    next()
  })

module.exports = mongoose.models.User || mongoose.model('User', userSchema);

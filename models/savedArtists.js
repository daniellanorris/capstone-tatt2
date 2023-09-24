import mongoose from 'mongoose';

const saved = new mongoose.Schema({
artist: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Artist',
}

  })

const savedArtists = mongoose.model('saved', saved);

export default savedArtists;



const mongoose = require('mongoose');

import { Schema } from 'mongoose'

import artistSchema from './artistSchema'

const savedArtists = new Schema({
    _id: artistSchema._id,
    firstname, 
    about

  })

export default mongoose.models.savedArtists || mongoose.model('Saved Artists', savedArtists);



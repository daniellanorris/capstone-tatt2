import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
    imageURL: {
        type: String,
        required: true
    }
});

const Image = mongoose.models.Image || mongoose.model('Image', imageSchema);

export default Image;


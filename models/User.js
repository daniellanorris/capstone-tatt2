import savedArtists from './savedArtists';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required:  [true, 'Please add a name'], 
        unique: true,
        maxlength: [40, 'Username cannot be more than 40 characters']

},
password: {
    type: String, 
    required: [true, 'Password needs to be added'], 
    unique: false,
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
}
}

)

export default mongoose.models.userSchema || mongoose.model('User', userSchema);
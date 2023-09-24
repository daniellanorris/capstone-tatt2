const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: {
        type: String, 
        unique: true
    },
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
     name: {
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

module.exports = mongoose.models.userSchema || mongoose.model('User', userSchema);
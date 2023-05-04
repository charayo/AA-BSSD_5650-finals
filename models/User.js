const mongoose = require('mongoose')
const bcrypt = require('bcrypt');


const saltRounds = 10;
const userSchema = mongoose.Schema({
    local: {
        email: String,
        password: String,
    }
});

//generating hash
userSchema.methods.generateHash =  function(password){
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt, null)
}
//checking if password is correct
userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.local.password);

}

//create the model
module.exports = mongoose.model('User', userSchema);
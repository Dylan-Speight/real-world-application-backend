const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const UserModel = mongoose.model('Users',UserSchema);

UserSchema.methods.isCorrectPassword = function(password, callback){

    bcrypt.compare(password, this.password, function(err, same) {
        if (err) {
            callback(err);
        } else {
            callback(err, same);
        }
    });
}

UserSchema.pre('save', function(next) {
    if (this.isNew || this.isModified('password')) {
      const document = this;
      bcrypt.hash(document.password, saltRounds,
        function(err, hashedPassword) {
        if (err) {
            res.status(500).send('User already exists');
          next(err);
        }
        else {
          document.password = hashedPassword;
          next();
        }
      });
    } else {
      next();
    }
});

module.exports = mongoose.model('User', UserSchema);
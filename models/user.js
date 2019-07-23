const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// const UserModel = mongoose.model('Users',UserSchema);

UserSchema.methods.isCorrectPassword = function(password, callback){
  console.log("ITS THIS ONE")

    bcrypt.compare(password, this.password, function(err, same) {
        if (err) {
            callback(err);
        } else {
            callback(err, same);
        }
    });
}

UserSchema.pre('save', function(next) {
  console.log("ITS THIS ONE TOO")
    // console.log(UserModel.find({"email": user.email}))
    // console.log(user)
    // UserModel.find({"email": user.email}), function (err, docs) {
    //     if (docs.length){
    //         cb('Name exists already',null);
    //     }else{
    //         user.save(function(err){
    //             cb(err,user);
    //         });
    //     }
    // }
    // Check if document is new or a new password has been set
    if (this.isNew || this.isModified('password')) {
      // Saving reference to this because of changing scopes
      const document = this;
      bcrypt.hash(document.password, saltRounds,
        function(err, hashedPassword) {
        if (err) {
            res.status(500).send('User already exists');
            // console.log(err)
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
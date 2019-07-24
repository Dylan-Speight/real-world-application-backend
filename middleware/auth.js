const jwt = require('jsonwebtoken');
const secret = 'mysecretsshhh';
const withAuth = function(req, res, next) {
  console.log(req)
  const token = req.headers.authorization

  if (!token ) {
    console.log("doesnt see token")
    res.status(401).send('Unauthorized: No Token provided');
    console.log(res)
  } else {
    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        res.status(401).send(`${token}`)
      } else {
        res.status(200).send(`it decoded successfully`)
        req.email = decoded.email;
        next();
      }
    });
  }
}
module.exports = withAuth;
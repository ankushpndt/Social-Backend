const jwt = require('jsonwebtoken')
function verifyToken(req,res,next){
  const token = req.header("auth-token")
  if(!token) res.status(401).send("Access denied")
  
  try{
    const verified = jwt.verify(token,'ankush')
    req.user = verified
    next()
  }catch (error) {
    res.status(400).send("Invalid Token");
  }
}
module.exports = verifyToken
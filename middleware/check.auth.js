const jwt = require('jsonwebtoken')

const checkAuth = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1]; //Bearer  @#3#3####
        const decodedToken = jwt.verify(token, 'secret')
        req.userData = decodedToken;
        next();

    }catch(err){
        return res.status(401).json({
            'message':"Invalid for expired token provided",
            "error":err
        })
    }
}
module.exports = {
    checkAuth:checkAuth
}
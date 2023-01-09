const jwt=require("jsonwebtoken");
const bookModel = require("../model/bookModel");


const authenticator = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        if (!token) {
            return res.status(400).send({
                status: false,
                message: "token is not present",
            });
        }
        let decodedToken = jwt.verify(token, "project-3");
        if (decodedToken) {
            req.userId = decodedToken.userId;
            next();
        } else {
            return res
                .status(401)
                .send({ status: false, message: "Token is not valid" });
        }
    } catch (err) {
   
        return res.status(500).send({ status: false, mess: err.message });
    }
};


const authorization = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]
        if (!token) return res.status(401).send({ msg: "token must be present", status: false })
        let bookId = req.params.bookId
        let decodeToken = jwt.verify(token, "project-3")
        let userLoggedIn = decodeToken.userId.toString()
        if (bookId) {
        let user = await bookModel.findById(bookId).select({ userId: 1, _id: 0 })
        let userToBeModified = user.userId.toString()
        if (userToBeModified != userLoggedIn) return res.status(403).send({ status: false, msg: 'User logged is not allowed to modify the requested users data' })
        next()
        } 
    } catch (err) {
        res.status(500).send({ msg: "ERROR", error: err.message })
    }
}
module.exports= {authenticator,authorization}
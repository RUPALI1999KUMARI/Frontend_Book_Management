const express=require("express")
const router = express.Router();
const userController = require("../controller/userController")
const bookController=require("../controller/bookController")
const middleWare=require("../middleWare/auth")
const reviewController=require("../controller/reviewController")

router.post('/register', userController.createUser)
router.post('/login', userController.userLogin)
router.post('/books',middleWare.authenticator,bookController.createBook)
router.get("/books",middleWare.authenticator,bookController.getBook)
router.get("/books/:bookId",middleWare.authenticator,bookController.getBookById)
router.put("/books/:bookId",middleWare.authenticator,middleWare.authorization,bookController.updateBook)
router.delete("/books/:bookId",middleWare.authenticator,middleWare.authorization,bookController.deleteBooks)
router.post('/books/:bookId/review',reviewController.createReview)
router.put('/books/:bookId/review/:reviewId',reviewController.updateReview)
router.delete("/books/:bookId/review/:reviewId",reviewController.deleteReview)
module.exports = router;

const bookModel = require("../model/bookModel");
const reviewModel=require("../model/reviewModel");
const mongoose=require("mongoose");
const validateBody = require('../validation/validation');
const ObjectId = require('mongoose').Types.ObjectId




const createReview = async function(req, res) {
  try {
      const bookId = req.params.bookId
      if (!validateBody.isValid(bookId)) {
          return res.status(400).send({ status: false, message: "Invalid bookId" })
      }
      const deletedBook = await bookModel.findOne({ _id: bookId ,isDeleted:false})
      if (!deletedBook) {
          return res.status(404).send({ status: false, message: "This book is not present." })
      }
      if (!validateBody.isValidRequestBody(req.body)) {
        return res.status(400).send({ status: false, message: "Please provide body for successful creation" });
    }
    let final = {}
    final.bookId = bookId
    const { reviewers, rating, review } = req.body
      const bookreview = await bookModel.findById(bookId)
      bookreview.reviews++
        bookreview.save()
      if (reviewers) {
          if (!validateBody.alphabetTestOfString(reviewers)) {
              return res.status(400).send({ status: false, message: "Reviewer name not in correct format or not mentioned." })
          }
          final.reviewers = reviewers
      }
      final.reviewedAt = Date.now()
      if (typeof rating !== 'number' || !/^[1-5]{1}$/.test(rating)) {
          return res.status(400).send({ status: false, message: "Invalid rating or rating is not mentioned." })
      }
      final.rating = rating
      if (review) {
          if (!validateBody.isValid(review)) {
              return res.status(400).send({ status: false, message: "Invalid review or review is not mentioned." })
          }
          final.review = review
      }
    const saveData = await reviewModel.create(final)
     return res.status(201).send({ status: true, message: "Review Done", data: saveData})
  } catch (err) {
      return res.status(500).send({ status: false, message: err.message })
  }
}




const updateReview = async (req, res) => {
  try {
      const bookParams = req.params.bookId;
      let checkOBJ2 = ObjectId.isValid(bookParams);
      if (!checkOBJ2) {
          return res.status(400).send({ status: false, message: "Please Provide a valid bookId in path params)" });;
      }
      const bookFound = await bookModel.findOne({ _id: bookParams });
      if (!bookFound) {
          return res.status(404).send({ status: false, msg: "This book id Doesn't exist" });
      }
      const reviewParams = req.params.reviewId;
      let checkOBJ3 = ObjectId.isValid(reviewParams);
      if (!checkOBJ3) {
          return res.status(400).send({ status: false, message: "Please Provide a valid reviewId in path params)" });;
      }
      let updateBody = req.body
      if (!validateBody.isValidRequestBody(updateBody)) {
          return res.status(400).send({ status: false, message: "Please provide data to proceed your update request" });
      }
      const { reviewedBy, rating, review } = updateBody
      if (!validateBody.isString(reviewedBy)){
          return res.status(400).send({ status: false, message: "If you are providing reviewedBy key you also have to provide its value" });
      }
      if (!validateBody.isString(rating)){
          return res.status(400).send({ status: false, message: "If you are providing rating key you also have to provide its value" });
      }
      if (!validateBody.isString(review)){
          return res.status(400).send({ status: false, message: "If you are providing review key you also have to provide its value" });
      }
      if (rating < 1 || rating > 5) {
          return res.status(400).send({ status: false, message: "Please do rating between 1 and 5" });;
      }
      if (bookFound.isDeleted == true) {
          return res.status(404).send({ status: false, msg: "The book on which you want update is no longer exist" });
      }
      const reviewUpdate = await reviewModel.findOne({ _id: reviewParams });
      if (!reviewUpdate) {
          return res.status(404).send({ status: false, msg: "This review id doesn't exist" });
      }
      if (reviewUpdate.isDeleted == true) {
          return res.status(404).send({ status: false, msg: "The review in which you want update is no longer exist" });
      }
      if (reviewedBy) {
          reviewUpdate.reviewedBy = reviewedBy;
      }
      if (rating) {
          reviewUpdate.rating = rating;
      }
      if (review) {
          reviewUpdate.review = review;
      }
      reviewUpdate.save();
      return res.status(200).send({ status: true, message: "Review is updated successfully", data: reviewUpdate });
  }
  catch (err) {
      return res.status(500).send({ status: false, msg: err.message });
  }
}




let deleteReview = async (req, res) => {
  try {
      let bookId = req.params.bookId;
      if (!mongoose.isValidObjectId(bookId)) return res.status(400).send({ status: false, message: 'please enter valid book id' });
      
      let reviewId = req.params.reviewId;
      if (!mongoose.Types.ObjectId.isValid(reviewId)) return res.status(400).send({ status: false, message: 'please enter valid review id' });
      
      let findBook = await bookModel.findOne({ _id: bookId, isDeleted: false })
      if (!findBook) return res.status(404).send({ status: false, message: 'book not found' })
      
      let findReview = await reviewModel.find({_id: reviewId, bookId: bookId, isDeleted: false });
      if (!findReview) return res.status(404).send({ status: false, message: 'review not found' });

      await reviewModel.findOneAndUpdate({ _id: reviewId, bookId: bookId }, { isDeleted: true })
      findBook.reviews = findBook.reviews - 1;
      findBook.save();


      res.status(200).send({ status: true, message: 'successfully deleted' });

  } catch (err) {
      res.status(500).send({ status: false, message: err.message })
  }
}


module.exports={createReview,updateReview,deleteReview}
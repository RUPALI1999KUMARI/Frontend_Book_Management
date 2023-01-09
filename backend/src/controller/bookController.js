const bookModel = require("../model/bookModel");
const reviewModel = require("../model/reviewModel");
const userModel = require("../model/userModel")
const validateBody = require('../validation/validation');
const mongoose = require("mongoose")
const ObjectId = require('mongoose').Types.ObjectId

const createBook = async function (req, res) {
    try {
        const myBody = req.body
        const { title, bookCover, excerpt, userId, ISBN, category, subcategory, reviews } = myBody;
        if (!validateBody.isValidRequestBody(myBody)) {
            return res.status(400).send({ status: false, message: "Please provide body for successful creation" });
        }
        if (!validateBody.isValid(userId)) {
            return res.status(400).send({ status: false, message: "Please provide userId or userId field" });
        }
        let checkOBJ = ObjectId.isValid(userId);
        if (!checkOBJ) {
            return res.status(400).send({ status: false, message: "Please Provide a valid userId in body params" });;
        }
        if (!(userId == req.userId)) {
            return res.status(400).send({ status: false, message: "Your are not authorize to create this book with this userId" });;
        }
        let findUser = await userModel.findOne({ _id: userId })
        if (!findUser) {
            return res.status(400).send({ status: false, message: "userid does not exist" });;
        }
        if (!validateBody.isValid(title)) {
            return res.status(400).send({ status: false, message: "Please provide tittle or title field" });
        }
        if (!validateBody.isValid(excerpt)) {
            return res.status(400).send({ status: false, message: "Please provide excerpt or excerpt field" });
        }
        if (!validateBody.isValid(ISBN)) {
            return res.status(400).send({ status: false, message: "Please provide ISBN id or ISBN field" });;
        }
        if (!validateBody.isValid(category)) {
            return res.status(400).send({ status: false, message: "Please provide category id or category field" });;
        }
        if (!validateBody.isValid(subcategory)) {
            return res.status(400).send({ status: false, message: "Please provide subcategory or subcategory field" });;
        }
        const duplicateTitle = await bookModel.find({ title: title });
        if (duplicateTitle != 0) {
            return res.status(400).send({ status: false, message: "This book title already exists with another book" });
        }
        const duplicateISBN = await bookModel.findOne({ ISBN: ISBN })
        if (duplicateISBN) {
            return res.status(400).send({ status: false, message: "This ISBN number already exists with another book" });
        }
        let idFind = await userModel.findById(userId);
        if (!idFind) {
            return res.status(400).send({ message: "This userId doesn't exist" });
        }
        else {
            let releasedAt = new Date()
            let bookCreated = { title, bookCover, excerpt, userId, ISBN, category, subcategory, releasedAt, reviews }
            let savedData = await bookModel.create(bookCreated)
            return res.status(201).send({ status: true, message: 'Success', data: savedData });
        }
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }


}

//===================================grt book=========================================================================//



let getBook = async (req, res) => {
    try {
        let filterBook = req.query
        if (filterBook.userId) {
            if (!mongoose.Types.ObjectId.isValid(filterBook.userId)) return res.status(400).send({ status: false, message: 'Invalid UserId Format' })
        }
        if (filterBook.subcategory) {
            filterBook.subcategory = { $in: filterBook.subcategory.split(',') };
        }
        let data = await bookModel.find({ $and: [filterBook, { isDeleted: false }] }).sort({ title: 1 })
        if (Object.keys(data).length == 0) return res.status(404).send({ status: false, message: 'Book not found' })
        res.status(200).send({ status: true, message: 'Book list', data: data })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


//=================================================getBookById==================================================//

const getBookById = async function (req, res) {
    try {
        bookId = req.params.bookId

        if (!bookId) {
            return res.status(400).send({ status: false, message: "Please enter bookId" })
        }

        if (!validateBody.isValid(bookId)) {
            return res.status(400).send({ status: false, message: "Invalid bookId" })
        }


        const bookData = await bookModel.findOne({ _id: bookId })
        if (!bookData) {
            return res.status(404).send({ status: false, msg: "this bookId is not found inside the bookModel" })
        }
        if (bookData.isDeleted == true) {
            return res.status(404).send({ status: false, msg: " this Book is Deleted" })
        }

        const reviewsData = await reviewModel.find({ bookId: bookId })

        // const data = {...bookData, reviewsData: reviewsData }
        bookData._doc["reviewsData"] = reviewsData

        return res.status(200).send({ status: "true", message: bookData })

    } catch (error) {

        return res.status(500).send({ msg: "false", error: error.message })
    }
}



const updateBook = async function (req, res) {
    try {
        const bookData = req.body
        if (!validateBody.isValidRequestBody(bookData)) { return res.status(404).send({ status: false, msg: "Please provide Data" }) }
        let BOOK = req.params.bookId
        if (!mongoose.Types.ObjectId.isValid(BOOK)) { return res.status(404).send({ status: false, data: "ID not Found in path param" }) }
        let book = await bookModel.findOneAndUpdate(
            { _id: BOOK },
            {
                $set: { title: bookData.title, excerpt: bookData.excerpt, ISBN: bookData.ISBN, releasedAt: Date.now() },
            },
            { new: true });
        if (book.isDeleted == true) {
            return res.status(404).send({ status: false, msg: " this Book is Deleted" })
        }
        return res.status(200).send({ status: true, data: book });
    }
    catch (error) {
        return res.status(500).send({ status: false, Error: error.message })
    }
}



const deleteBooks = async function (req, res) {

    try {
        let data = req.params
        if (!validateBody.isValidRequestBody(data)) { return res.status(404).send({ status: false, msg: "Please provide Data" }) }
        let BOOK = req.params.bookId
        if (!mongoose.isValidObjectId(BOOK)) { return res.status(404).send({ status: false, data: "ID not Found in path param" }) }
        let deletedBook = await bookModel.findOneAndUpdate({ _id: BOOK }, { isDeleted: true, deletedAt: new Date() }
            , { new: true });

        res.status(200).send({ status: true, msg: deletedBook })
    } catch (error) {
        res.status(500).send({ status: false, Error: error.message })
    }
}





module.exports = { getBookById, createBook, getBook, updateBook, deleteBooks }

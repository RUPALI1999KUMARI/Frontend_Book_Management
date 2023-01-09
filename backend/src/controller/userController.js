const userModel = require("../model/userModel");
const validateBody = require('../validation/validation');
const jwt = require("jsonwebtoken");

const createUser = async  (req,res) => {
  try {
    const myBody = req.body
    const { title, name, phone, email, password, address } = myBody;

    if (!validateBody.isValidRequestBody(myBody)) {
        return res.status(400).send({ status: false, message: "Please provide data for successful registration" });
    }
    if (!validateBody.isValid(title)) {
        return res.status(400).send({ status: false, message: "Please provide tittle or title field" });
    }
    if (!validateBody.isValid(name)) {
        return res.status(400).send({ status: false, message: "Please provide name or name field" });
    }
    if (!validateBody.alphabetTestOfString(name)) {
        return res.status(400).send({ status: false, message: "You can't use special character or number in name" });
    }
    if (!validateBody.isValid(phone)) {
        return res.status(400).send({ status: false, message: "Please provide phone number or phone field" });
    }
    if (!validateBody.isValidMobileNum(phone)) {
        return res.status(400).send({ status: false, message: 'Please provide a valid phone number.' })
    }
    if (!validateBody.isValid(email)) {
        return res.status(400).send({ status: false, message: "Please provide Email id or email field" });;
    }
    if (!validateBody.isValidSyntaxOfEmail(email)) {
        return res.status(404).send({ status: false, message: "Please provide a valid Email Id" });
    }
   if (!validateBody.isValid(password)) {
        return res.status(400).send({ status: false, message: "Please provide password or password field" });;
    }
    let size = Object.keys(password.trim()).length
    if (size < 8 || size > 15) {
        return res.status(400).send({ status: false, message: "Please provide password with minimum 8 and maximum 14 characters" });;
    }
    const DuplicateEmail = await userModel.find({ email: email });
    if ( DuplicateEmail.length!=0) {
        return res.status(400).send({ status: false, message: "This email Id already exists with another user" });
    }
    const duplicatePhone = await userModel.findOne({ phone: phone })
    if (duplicatePhone) {
        return res.status(400).send({ status: false, message: "This phone number already exists with another user" });
    }
   
    let saveData = await userModel.create(myBody);
    res.status(201).send({status : true, data : saveData});

  }
  catch (err) {
      return res.status(500).send({ status: false, message: err.message });
  } 
};


const userLogin = async (req,res) => {
    try{
      const myBody1 = req.body
      const { email, password } = myBody1
      if (!validateBody.isValidRequestBody(myBody1)) {
          return res.status(400).send({ status: false, message: "Please provide data for successful login" });
      }
      if (!validateBody.isValid(email)) {
          return res.status(400).send({ status: false, message: "Please provide Email id or email field" });;
      }
      if (!validateBody.isValidSyntaxOfEmail(email)) {
          return res.status(404).send({ status: false, message: "Please provide a valid Email Id" });
      }
      if (!validateBody.isValid(password)) {
          return res.status(400).send({ status: false, message: "Please provide password or password field" });;
      }
     let checkData = await userModel.findOne({email : email , password : password});
  
     if(!checkData) return res.status(400).send({status : false, msg: "This email and password is not exist"});
 
     let token = jwt.sign({
         userId: checkData._id.toString(),
         group: "group-8",
       },"project-3", { expiresIn: '180m' });
 
       res
         .status(200)
         .send({
           status: true,
           message: "user Login Successful",
           token: { token },
         });
 
    }catch(err)
    {
        return res.status(500).send({ status: false, message: err.message });
    }
 
 }

module.exports.createUser = createUser;
module.exports.userLogin = userLogin;
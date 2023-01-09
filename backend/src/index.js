const express = require('express');
const bodyParser = require('body-parser');
const route = require('./route/route');
const mongoose  = require('mongoose');
const app = express();
const cors = require('cors')

app.use(bodyParser.json());
app.use(cors())


mongoose.connect("mongodb+srv://dataanalysis:i0J91N0419HJ9gVf@cluster0.jgovnho.mongodb.net/ProjectData", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

app.use('/', route);
app.all("/*", function (req, res) {
    res.status(400).send({ status: false, message: "invalid http request" });
  });



app.listen(process.env.PORT || 3001, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3001))
});
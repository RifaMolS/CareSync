var express = require("express")
var session = require("express-session")
var cors = require("cors")
var bodyParser = require('body-parser');
var database = require('./config/config')
const fileUpload = require('express-fileupload')
var app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('asset'))
app.use(cors())
app.use(fileUpload())
app.use('/uploads', express.static('uploads'));
var formRouter = require("./routes/form.routes")
var utilRouter = require("./util/util.router")
const { startMedicationReminders } = require('./services/reminder.service');

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))
database()
app.use("/demo", formRouter)
app.use("/util", utilRouter)

startMedicationReminders();

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
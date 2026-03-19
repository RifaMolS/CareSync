var mongoose = require("mongoose")
function dchild() {
    mongoose.connect("mongodb://127.0.0.1:27017/dchild").then(() => {
        console.log("connected successfully")
    }).catch(err => {
        console.log(err)
    })
}
module.exports = dchild
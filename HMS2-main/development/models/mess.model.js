const mongoose = require('mongoose')

const notice=new mongoose.Schema({
    foodid: {type: Number, required: false},
    vegfood: {type: String, required: true},
    nonvegfood: {type: String, required: true}
},
    {collection: 'mess-details'}
)

const model=mongoose.model('mess',notice)

module.exports=model
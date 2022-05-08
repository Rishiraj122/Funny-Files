const mongoose = require('mongoose')

const notice=new mongoose.Schema({
    name: {type: String, required: true},
    phone: {type: Number, rerquired: true},
    fooditem:{type: String, required: true},
    payment:{type: Number, required: true},
    date:{type: String, required: true}
},
    {collection: 'vendor-details'}
)

const model=mongoose.model('Vendor',notice)

module.exports=model
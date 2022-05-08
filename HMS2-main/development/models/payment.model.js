const mongoose = require('mongoose')

const payment=new mongoose.Schema({
    roll: {type: Number, required: true},
    messbill: {type: Number, required: false},
    hostelbill: {type: Number, required: false}
},
    {collection: 'payment-details'}
)

const model=mongoose.model('payment',payment)

module.exports=model
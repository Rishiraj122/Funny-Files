const mongoose = require('mongoose')

const notice=new mongoose.Schema({
    name: {type: String, required: true},
    phone: {type: Number, rerquired: true},
    address: {type: String, required: true},
    room: {type: Number, required: false},
    roll: {type: Number, required: true},
    gender: {type: String, required: true},
    occupancy: {type: Number, required: false},
    registration: {type: Number, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    block:{type: String, required: false},
    rid: {type: String, required: false},
    roomClean:{type:String, required: false},
    sid:{type:String, required: false}
},
    {collection: 'student-details'}
)

const model=mongoose.model('studentDetails',notice)

module.exports=model
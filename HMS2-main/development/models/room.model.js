const mongoose = require('mongoose')

const room=new mongoose.Schema({
    room: {type: Number, required: true},
    occupancy: {type: Number, required: false},
    block: {type: String, required: false},
    rid: {type: String, required:false},
},
    {collection: 'room-details'}
)

const model=mongoose.model('roomDetails',room)

module.exports=model
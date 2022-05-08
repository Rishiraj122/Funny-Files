const mongoose = require('mongoose')

const clean=new mongoose.Schema({
    room: {type: String, required: true},
    clean: {type: String, required: false}
},
    {collection: 'clean-details'}
)

const model=mongoose.model('clean',clean)

module.exports=model

const mongoose = require('mongoose')

const tagTimeSchema = new mongoose.Schema({
    _id: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    "time": mongoose.SchemaTypes.Number,
    "balance": mongoose.SchemaTypes.Number,
    "dailyCD": mongoose.SchemaTypes.Number,
    "mutedCD": mongoose.SchemaTypes.Number,
    "dailymsg": mongoose.SchemaTypes.Number
}, {
    collection: 'tagTimeTest',
    versionKey: false
})

module.exports = mongoose.model('tagTimeTest', tagTimeSchema)
const mongoose = require('mongoose')

const staffAppSchema = new mongoose.Schema({
    _id: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    "code": mongoose.SchemaTypes.String,
    "position": mongoose.SchemaTypes.String,
    "upvotes": mongoose.SchemaTypes.Mixed,
    "downvotes": mongoose.SchemaTypes.Mixed
}, {
    collection: 'staffApplications',
    versionKey: false
})

module.exports = mongoose.model('staffApplications', staffAppSchema)
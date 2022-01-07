const mongoose = require('mongoose')

const invitesSchema = new mongoose.Schema({
    _id: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    invites: mongoose.SchemaTypes.Mixed
}, {
    collection: 'invites',
    versionKey: false
})

module.exports = mongoose.model('invites', invitesSchema)
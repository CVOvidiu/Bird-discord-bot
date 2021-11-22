const mongoose = require('mongoose')

const ServersConfigSchema = new mongoose.Schema({
    _id: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    channels: {
        joinleave: mongoose.SchemaTypes.String
    },
    joinroles: mongoose.SchemaTypes.Mixed
}, {
    collection: 'serversConfig',
    versionKey: false
})

module.exports = mongoose.model('serversConfig', ServersConfigSchema)
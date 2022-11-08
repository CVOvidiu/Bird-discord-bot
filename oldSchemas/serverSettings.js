const mongoose = require('mongoose')

const serverSettingsSchema = new mongoose.Schema({
    _id: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    staffapplications: {
        "helper": mongoose.SchemaTypes.Boolean,
        "helpertrial": mongoose.SchemaTypes.Boolean,
        "admin": mongoose.SchemaTypes.Boolean
    },
    restricted: mongoose.SchemaTypes.Mixed
}, {
    collection: 'serverSettings',
    versionKey: false
})

module.exports = mongoose.model('serverSettings', serverSettingsSchema)
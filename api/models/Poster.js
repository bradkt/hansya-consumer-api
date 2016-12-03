var uuid = require('uuid/v4');
module.exports = {

    attributes: {
        id: {
            type: 'string',
            primaryKey: true,
            unique: true,
            defaultsTo: function () {
                return uuid()
            }
        },
        name: {
            type: 'string'
        },
        screen_name: {
            type: 'string',
            required: 'true'
        },
        location: {
            type: 'string'
        },
        ip: {
            type: 'string'
        },
        profile_image: {
            type: 'string'
        }
    }
};

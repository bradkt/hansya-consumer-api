module.exports = {

    attributes: {
        id: {
            type: 'string',
            primaryKey: true,
            unique: true
        },

        campaign: {
            model: 'campaign',
            required: true
        },
        messages: {
            collection: 'message',
            // type: 'json',
            // required: true
        }
    }
}
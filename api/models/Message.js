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
        message: {
            type: 'json',
            required: true
        },
        metrics: {
            type: 'json',
            // required: true
        },
        poster: {
            model: 'poster',
            // required: true
        }
    }
};


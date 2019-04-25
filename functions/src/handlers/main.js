const utils = require('../utils');

exports.push = {
    type: 'post', exec: (async (req, res) =>
        req.body.name && req.body.email && req.body.message ?
            await utils.sendEmail(req.body.name, req.body.email, req.body.message)
                .then(() => res.status(200).send('OK'))
                .catch(error => res.status(500).send(`Error occurred: ${error}`))
                : res.status(400).send('Missing param').end()
    )
};

exports.form = {
    type: 'get', exec: ((req,res)=>res.status(200).send(req.csrfToken()))
};

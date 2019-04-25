require(`./src/server`)
    .then((server) =>
        process.env.NODE_ENV === 'development' ?
            server.listen(process.env.PORT || 3000) :
            exports[require('./package').name] = require('firebase-functions')
                .runWith({timeoutSeconds: 300, memory: '2GB'})
                .https.onRequest(server))
    .catch((error) => console.error(error));


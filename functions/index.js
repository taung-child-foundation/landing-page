const utils = require('./src/utils');
const server = require(`${utils.baseDir}/src/server`);

if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 3000;
    server.listen(port);
    console.log(`Server is running on port ${port}`);
} else {
    /**
     *  Creates a function instance and with a specific specs.
     *  Serve to FireBase Express server obj.
     */
    const functions = require('firebase-functions')
        .runWith({timeoutSeconds: 300, memory: '2GB'});
    exports[require('./package').name] = functions.https.onRequest(server);
}

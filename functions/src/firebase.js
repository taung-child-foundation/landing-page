const admin = require('firebase-admin/lib/index');

const utils = require('./utils');

exports.admin = (() => {
    const config = utils.config;
    return admin.initializeApp(
        (() => utils.isDev ?
                {
                    credential: admin.credential.cert(config.FirebaseAdminSDK),
                    databaseURL: config.FirebaseConf.databaseURL
                } : require('firebase-functions/lib/index').config().firebase
        )())
})();

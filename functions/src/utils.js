const fs = require('fs');

const sgMail = require('@sendgrid/mail');

const constant = require('./constant');
const baseDir = require('path').join(__dirname, '..');
exports.baseDir = baseDir;

const isDev = process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'development';
exports.isDev = isDev;

const config = (() => {
    /**
     * Get GCP\FB config base on NODE_ENV
     * @type {string} path to the service account.
     * @return {JSON} service account json.
     */

    const confDir = `${baseDir}/config`;
    const configFiles = fs.readdirSync(confDir);
    const isNodeEnvConf = Boolean(configFiles.find(
        (currentFile) => process.env.NODE_ENV ?
            currentFile === `${process.env.NODE_ENV.toLowerCase()}.json`
            : false));

    return require(`${confDir}/${isNodeEnvConf ? process.env.NODE_ENV : 'production'}.json`);
})();
exports.config = config;

exports.db = async (path, write = false) => {
    const fb = require('./firebase');
    const db = await fb.admin.database();
    if (write) {
        return await db.ref(`/reroute/${path}`)
            .set(write)
            .then((snapshot) => snapshot)
            .catch(error => console.error(error))
    }
    return await db.ref(`/reroute${path === 'all' ? '' : '/' + path}`)
        .once('value')
        .then((snapshot) => snapshot.exists() ? snapshot.val() : false)
        .catch(error => console.error(error))
};

exports.sendEmail = async (name, email, message) => {
    if (name && email && message) {
        const fb = require('./firebase');
        const configurations = fb.admin.firestore().collection('configurations');

        return configurations.doc('sendgrid')
            .get()
            .then(snapshot => {
                sgMail.setApiKey(snapshot.data()['token']);
                return sgMail.send({
                    to: constant.sendGrid.recipient,
                    from: email, subject: constant.sendGrid.subject.replace('{name}', name), text: message
                })
                    .then((response) => response[0].complete)
                    .catch(() => false)

            }).catch(() => false)
    }
    return false
};
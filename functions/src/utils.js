const fs = require('fs');

const sgMail = require('@sendgrid/mail');

const constant = require('./constant');
const baseDir = require('path').join(__dirname, '..');
exports.baseDir = baseDir;

exports.isDev = process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'development';

exports.config = (() =>
        /**
         * Get GCP\FB config base on NODE_ENV
         * @type {string} path to the service account.
         * @return {JSON} service account json.
         */
        require(`${baseDir}/config/env/${process.env.NODE_ENV ?
            (fs.readdirSync(`${baseDir}/config/env`)
                .find((currentFile) => currentFile === `${process.env.NODE_ENV.toLowerCase()}.json`) ?
                `${process.env.NODE_ENV.toLowerCase()}` : 'production')
            : 'production'}.json`)
)();

exports.sendEmail = async (name, email, message) => {
    if (name && email && message) {
        sgMail.setApiKey(require(`${baseDir}/config/sendgrid.json`)['token']);
        return sgMail.send({
            to: constant.sendGrid.recipient,
            from: email, subject: constant.sendGrid.subject.replace('{name}', name), text: message
        })
            .then((response) => response[0].complete)
            .catch(() => false)
    }
    return false
};


const fs = require('fs');
const token = process.env['token'];
const projectName = (JSON.parse(fs.readFileSync(`${__dirname}/.firebaserc`, 'utf8'))).projects[process.env.NODE_ENV ? process.env.NODE_ENV : 'default'];
/**
 * FireBase Deployment script
 * FOR CI USE ONLY!
 */

console.log('Deploying to Firebase... please wait.');
token ? require('firebase-tools')
        .deploy((() => ({project: projectName, token: token, cwd: __dirname}))())
        .then(() => console.log(`Your project ${projectName} has been deployed`))
        .catch((err) => console.warn(`error has occurred! - ${err}`))
    : console.error('waitt...where is your firebase token?');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const bunyan = require('bunyan');
const cors = require('cors');

const utils = require('./utils');

module.exports = init = (() => {
    const logger = bunyan.createLogger({name: 'TCF', level: 'debug'});
    const server = express({
        name: 'TCF landing page',
        log: logger,
    });
    const router = express.Router();

    let urls = (() => {
        /**
         * Map all available handlers to express route.
         * @type {{handler}|*}
         */
        let RouteList = {};
        let baseHandlersFolder = `${utils.baseDir}/src/handlers`;
        fs.readdirSync(baseHandlersFolder).forEach((fileName) => {
            if (fileName.includes('.js')) {
                let HandlerImport = require(`${baseHandlersFolder}/${fileName}`);
                Object.keys(HandlerImport).forEach((handler)=> {
                    if (HandlerImport[handler].type && Array.isArray(HandlerImport[handler].type)){
                        RouteList[handler] = HandlerImport[handler].type.map((method)=>{
                            return { ...HandlerImport[handler], type:method}
                        })
                    } else {
                        return RouteList[handler] = HandlerImport[handler]
                    }
                });
            }
        });
        return RouteList;
    })();
    Object.keys(urls).forEach((path)=>{
        /**
         *  Map all the available urls; function as a route mapper.
         */
        try {
            const handlers = Array.isArray(urls[path]) ? urls[path] : [urls[path]];
            path = path==='all' ? '*' : '/' + path;
            handlers.forEach((handler)=>
                router[handler.type ? handler.type: 'get'](`${path}${handler.url? handler.url : ''}`, handler.exec ? handler.exec : handler));
            logger.info(path);
        } catch (e) {
            console.log(e);
            logger.error(`Failed to register the following handler: ${path}`);
        }
    });

    server
        .use(bodyParser.json())
        .use(bodyParser.urlencoded({extended: true}))
        .use(cors({origin: ((origin)=>!(origin && !utils.settings.allowedOrigins.includes(origin)))()}))
        .use(router);
    return server;
})();

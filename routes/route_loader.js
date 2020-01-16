let route_loader ={};
const config = require('../config');
const jwt = require('jsonwebtoken')
const token_config = require('../database_config/token_config')

route_loader.init = (app, router) => {
    console.log(`route_loader.init 호출함.`);

    return initRoutes(app, router)
}

const initRoutes =(app, router) => {
    app.get('/ourhour/count', function (req, res) {
        if (req.session.count) {
            req.session.count++;
        } else {
            req.session.count = 1;
        }
        res.send('count : ' + req.session.count);
    });


    function verifyToken(req, res, next) {
        console.log(`verifyToken 실행됨.`)
        let Header = req.headers.authorization
        let token
        if (Header) {
            token = Header.split(' ')[1]
        }
        if (token) {
            jwt.verify(token, token_config.secret, function (err, decoded) {
                console.log('jwt verify 실행됨')
                if (err) {
                    console.log(err)
                    req.authenticated = false
                    req.decoded = null
                } else {
                    console.log('jwt verify success')
                    req.decoded = decoded
                    req.authenticated = true
                }
            })
        } else {
            req.decoded = null
            req.authenticated = false
        }
        next()
    }


    config.route_info.forEach(item => {
        const curModule = require(item.file);
        console.log(`Read module infos from file : ${item.file}`);

        switch (item.type) {
            case 'get':
                router.route(item.path).get(verifyToken, curModule[item.method]);
                break
            case 'post':
                router.route(item.path).post(verifyToken, curModule[item.method])
                break
            case 'put':
                router.route(item.path).put(verifyToken, curModule[item.method])
                break
            case 'delete':
                router.route(item.path).delete(verifyToken, curModule[item.method])
                break
            default:
                console.log(`item type이 잘못됨.`)
                break
        }
        console.log(`complete to set up on a routing module : ${item.method}`)
    })
    app.use('/', router)
}

module.exports = route_loader;
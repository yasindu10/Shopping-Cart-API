
const CustomError = require('../errors/custom-errors')
const jwt = require('jsonwebtoken')

const authorization = async (req, res, next) => {
    const authorization = req.headers.authorization

    if (!authorization || !authorization.startsWith('Barear ')) {
        throw new CustomError('no access token found', 401)
    }

    const accessToken = authorization.split(' ')[1]

    try {
        const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY)

        req.user = payload
        next()
    } catch (err) {
        throw new CustomError('Forbitten', 401)
    }
}

module.exports = authorization
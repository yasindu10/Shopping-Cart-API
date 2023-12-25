
const CustomError = require('../errors/custom-errors')

const errorHandeller = (err, req, res, next) => {

    if (err instanceof CustomError) {
        console.log(`custom error ${err.message}`);
        return res.status(err.stateCode).json({ success: false, data: err.message })
    }

    console.log(`system error ${err.message}`);
    res.status(500).json({ success: false, data: err.message })
}

module.exports = errorHandeller
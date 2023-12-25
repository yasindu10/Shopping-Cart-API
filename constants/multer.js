
const multer = require('multer')

const memoryMulter = multer({ storage: multer.memoryStorage({}) })

module.exports = {
    memoryMulter
}
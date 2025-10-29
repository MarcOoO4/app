const Router = require('express')
const router = new Router()
const orderRouter = require('./orderRouter.js')
const userRouter = require('./userRouter.js')
const managerRouter = require('./managerRouter.js')
const productRouter = require('./productRouter.js')
const serviceRouter = require('./serviceRouter.js')

router.use('/user', userRouter)
router.use('/order', orderRouter)
router.use('/manager', managerRouter)
router.use('/product', productRouter)
router.use('/service', serviceRouter)


module.exports = router
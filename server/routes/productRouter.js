const Router = require('express')
const router = new Router()
const productController = require('../controllers/productController')

router.post('/', productController.create)
router.get('/', productController.getAll)
router.get('/:id', productController.getOne)
router.put('/productupdate/:id', productController.updateProduct)
router.delete('/productdelete/:id', productController.deleteProduct)

module.exports = router
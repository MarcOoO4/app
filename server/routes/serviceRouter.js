const Router = require('express')
const router = new Router()
const serviceController = require('../controllers/serviceController')

router.post('/', serviceController.create)
router.get('/', serviceController.getAll)
router.get('/:id', serviceController.getOne)
router.put('/serviceupdate/:id', serviceController.updateService)
router.delete('/servicedelete/:id', serviceController.deleteService)

module.exports = router
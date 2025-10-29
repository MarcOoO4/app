const Router = require('express')
const router = new Router()
const managerController = require('../controllers/managerController')
const authMiddleware = require('../middleware/authMiddleware')
const {check} = require('express-validator');

router.post('/registration', [
    check('email', "Email не может быть пустым").notEmpty(),
    check('password', "Пароль должен быть больше 4 и меньше 10 смиволов").isLength({min:4, max:10})
], managerController.registration)
router.post('/login', managerController.login)
router.get('/auth', authMiddleware, managerController.check)
router.get('/', managerController.getAll)
router.get('/:id', managerController.getOne)
router.put('/managerupdate', managerController.updateManager)
router.delete('/managerdelete/:id', managerController.deleteManager)

module.exports = router
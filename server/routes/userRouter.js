const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const {check} = require('express-validator');

router.post('/registration', [
    check('email', "Email не может быть пустым").notEmpty(),
    check('password', "Пароль должен быть больше 4 и меньше 10 смиволов").isLength({min:4, max:10})
], userController.registration)
router.post('/login', userController.login)
router.get('/auth', authMiddleware, userController.check)
router.get('/', userController.getAll)
router.get('/:id', userController.getOne)
router.put('/userupdate', userController.updateUser)
router.delete('/userdelete/:id', userController.deleteUser)

module.exports = router
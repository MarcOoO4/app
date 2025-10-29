const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {Managers} = require('../models/models');
const {validationResult} = require('express-validator');

const generateJwt = (id, email, FIO) => {
    return jwt.sign(
        {id, email, FIO},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class ManagerController {
    async registration(req, res, next) {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(400).json({message: "Ошибка при регистрации", errors})
        }
        const {email, password, FIO} = req.body
        if (!email || !password) {
            return next(ApiError.badRequest('Некорректный email или пароль'))
        }
        const candidate = await Managers.findOne({where: {email}})
        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует'))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const manager = await Managers.create({email, FIO, password: hashPassword})
        const token = generateJwt(manager.id, manager.email, manager.FIO)
        return res.json({token})

    }
    async login(req, res, next) {
        const {email, password} = req.body
        const manager = await Managers.findOne({where: {email}})
        if (!manager) {
            return next(ApiError.internal('Пользователь не найден'))
        }
        let comparePassword = bcrypt.compareSync(password, manager.password)
        if (!comparePassword) {
            return next(ApiError.internal('Пароль неверный'))
        }
        const token = generateJwt(manager.id, manager.email, manager.FIO)
        return res.json({token})
    }
    async check(req, res) {
        const token = generateJwt(req.manager.id, req.manager.email)
        return res.json({token})
    }
    async getAll(req, res) {
        let {id} = req.body
        let managers;
        if (!id) {
            managers = await Managers.findAndCountAll()
        }
        return res.json(managers)
    }
    async getOne(req, res) {
        const {id} = req.params
        const manager = await Managers.findOne(
            {
                where: {id}
            },
        )
        return res.json(manager)
    }
    async updateManager(req, res) {
        const { id, FIO} = req.body;

        try {
            // Находим пользователя по id
            const managerup = await Managers.findByPk(id);

            if (!managerup) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }

            // Обновляем информацию о пользователе
            await managerup.update({
                FIO, // Обновляем поле FIO
            });

            // Возвращаем обновленного пользователя
            res.status(200).json(managerup);
        } catch (error) {
            console.error('Ошибка при обновлении пользователя:', error.message);
            res.status(500).json({ message: 'Ошибка сервера при обновлении пользователя' });
        }
    }
    async deleteManager(req, res) {
        const { id } = req.params; // Получаем id пользователя из параметров запроса

        try {
            // Пытаемся найти пользователя по id
            const managerdel = await Managers.findByPk(id);

            if (!managerdel) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }

            // Удаляем пользователя
            await managerdel.destroy();

            // Возвращаем сообщение об успешном удалении
            res.status(200).json({ message: 'Пользователь успешно удален' });
        } catch (error) {
            console.error('Ошибка при удалении пользователя:', error.message);
            res.status(500).json({ message: 'Ошибка сервера при удалении пользователя' });
        }
    }
}

module.exports = new ManagerController()
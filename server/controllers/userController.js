const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {Users} = require('../models/models');
const {validationResult} = require('express-validator');

const generateJwt = (id, email, FIO, phone, INN, OGRN) => {
    return jwt.sign(
        {id, email, FIO, phone, INN, OGRN},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class UserController {
    async registration(req, res, next) {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(400).json({message: "Ошибка при регистрации", errors})
        }
        const {email, password, FIO, phone, name_ur, INN, KPP, OGRN, OKPO, ur_address, payment_account} = req.body
        if (!email || !password) {
            return next(ApiError.badRequest('Некорректный email или пароль'))
        }
        const candidate = await Users.findOne({where: {email}})
        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует'))
        }
        const candidate_ur = await Users.findOne({where: {INN, OGRN, OKPO, payment_account, phone}})
        if (candidate_ur) {
            return next(ApiError.badRequest('Проверьте свои данные ИНН, ОГРН, ОКПО, РС, номер телефона'))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await Users.create({email, FIO, phone, name_ur, INN, KPP, OGRN, OKPO, ur_address, payment_account, password: hashPassword})
        const token = generateJwt(user.id, user.email, user.FIO, user.phone, user.INN, user.OGRN)
        return res.json({token})

    }
    async login(req, res, next) {
        const {email, password} = req.body
        const user = await Users.findOne({where: {email}})
        if (!user) {
            return next(ApiError.internal('Пользователь не найден'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.internal('Пароль неверный'))
        }
        const token = generateJwt(user.id, user.email, user.FIO, user.phone, user.INN, user.OGRN)
        return res.json({token})
    }
    async check(req, res) {
        const token = generateJwt(req.user.id, req.user.email)
        return res.json({token})
    }
    async getAll(req, res) {
        let {id} = req.body
        let users;
        if (!id) {
            users = await Users.findAndCountAll()
        }
        return res.json(users)
    }
    async getOne(req, res) {
        const {id} = req.params
        const user = await Users.findOne(
            {
                where: {id}
            },
        )
        return res.json(user)
    }
    async updateUser(req, res) {
        const { id, FIO, phone, name_ur, INN, KPP, OGRN, OKPO, ur_address, payment_account } = req.body;

        try {
            // Находим пользователя по id
            const userup = await Users.findByPk(id);

            if (!userup) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }

            // Обновляем информацию о пользователе
            await userup.update({
                FIO, // Обновляем поле FIO
                phone, // Обновляем поле phone
                name_ur,
                INN,
                KPP,
                OGRN,
                OKPO,
                ur_address,
                payment_account
            });

            // Возвращаем обновленного пользователя
            res.status(200).json(userup);
        } catch (error) {
            console.error('Ошибка при обновлении пользователя:', error.message);
            res.status(500).json({ message: 'Ошибка сервера при обновлении пользователя' });
        }
    }
    async deleteUser(req, res) {
        const { id } = req.params; // Получаем id пользователя из параметров запроса

        try {
            // Пытаемся найти пользователя по id
            const userdel = await Users.findByPk(id);

            if (!userdel) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }

            // Удаляем пользователя
            await userdel.destroy();

            // Возвращаем сообщение об успешном удалении
            res.status(200).json({ message: 'Пользователь успешно удален' });
        } catch (error) {
            console.error('Ошибка при удалении пользователя:', error.message);
            res.status(500).json({ message: 'Ошибка сервера при удалении пользователя' });
        }
    }
}

module.exports = new UserController()
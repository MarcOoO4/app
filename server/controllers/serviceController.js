const {Services} = require('../models/models')
const ApiError = require('../error/ApiError');

class ServiceController {
    async create(req, res) {
        const {service, servicePackage, shipment, marketplace, productId, userId} = req.body
        const services = await Services.create({service, servicePackage, shipment, marketplace, productId, userId})
        return res.json(services)
    }

    async getAll(req, res) {
        let {productId} = req.body
        let services;
        if (!productId) {
            services = await Services.findAndCountAll()
        }
        return res.json(services)
    }

    async getOne(req, res) {
        const {id} = req.params
        const services = await Services.findOne(
            {
                where: {id}
            },
        )
        return res.json(services)
    }
    async updateService(req, res) {
        const { id, service, servicePackage, shipment, marketplace, productId, userId} = req.body; // Получаем обновленные данные о заказе из тела запроса

        try {
            // Пытаемся найти заказ по id
            const serviceup = await Services.findByPk(id);

            if (!serviceup) {
                return res.status(404).json({ message: 'Услуги не найдены' });
            }

            // Обновляем данные об услугах
            await serviceup.update({
                service,
                servicePackage,
                shipment,
                marketplace,
                productId,
                userId
            });

            // Возвращаем обновленные услуги
            res.status(200).json(serviceup);
        } catch (e) {
            console.error('Ошибка при обновлении услуг:', e.message);
            res.status(500).json({ message: 'Ошибка сервера при обновлении услуг' });
        }
    }
    async deleteService(req, res) {
        const { id } = req.params; // Получаем id услуг из параметров запроса

        try {
            // Пытаемся найти услуги по id
            const servicedel = await Services.findByPk(id);

            if (!servicedel) {
                return res.status(404).json({ message: 'Товар не найден' });
            }

            // Удаляем услуги
            await servicedel.destroy();

            // Возвращаем сообщение об успешном удалении
            res.status(200).json({ message: 'Услуги успешно удалены' });
        } catch (e) {
            console.error('Ошибка при удалении услуг:', e.message);
            res.status(500).json({ message: 'Ошибка сервера при удалении услуг' });
        }
    }
}

module.exports = new ServiceController()
const {Orders} = require ('../models/models')
const ApiError = require ('../error/ApiError')

class OrderController {
    async create(req, res, next) {
        try {
            const {product_name, order_status, date, product_location, volume, weight, price, quantity_product, marketplace, userId, managerId} = req.body
            const order = await Orders.create({product_name, order_status, date, product_location, volume, weight, price, quantity_product, marketplace, userId, managerId})
            return res.json(order)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }

    }
    async getAll(req, res) {
        let {userId, managerId} = req.body
        let orders;
        if (!userId && !managerId) {
            orders = await Orders.findAndCountAll()
        }
        if (userId && !managerId) {
            orders = await Orders.findAndCountAll({where:{userId}})
        }
        if (!userId && managerId) {
            orders = await Orders.findAndCountAll({where:{managerId}})
        }
        return res.json(orders)
    }
    async getOne(req, res) {
        const {id} = req.params
        const order = await Orders.findOne(
            {
                where: {id}
            },
        )
        return res.json(order)
    }
    async updateOrder(req, res) {
        const { id, date, order_status, product_location, volume, weight, price, quantity_product, product_name, marketplace, userId, managerId} = req.body; // Получаем обновленные данные о заказе из тела запроса

        try {
            // Пытаемся найти заказ по id
            const orderup = await Orders.findByPk(id);

            if (!orderup) {
                return res.status(404).json({ message: 'Заказ не найден' });
            }

            // Обновляем данные о заказе
            await orderup.update({
                date,
                order_status,
                product_location,
                volume,
                weight,
                price,
                quantity_product,
                product_name,
                marketplace,
                userId,
                managerId
            });

            // Возвращаем обновленный заказ
            res.status(200).json(orderup);
        } catch (e) {
            console.error('Ошибка при обновлении заказа:', e.message);
            res.status(500).json({ message: 'Ошибка сервера при обновлении заказа' });
        }
    }
    async deleteOrder(req, res) {
        const { id } = req.params; // Получаем id заказа из параметров запроса

        try {
            // Пытаемся найти заказ по id
            const orderdel = await Orders.findByPk(id);

            if (!orderdel) {
                return res.status(404).json({ message: 'Заказ не найден' });
            }

            // Удаляем заказ
            await orderdel.destroy();

            // Возвращаем сообщение об успешном удалении
            res.status(200).json({ message: 'Заказ успешно удален' });
        } catch (e) {
            console.error('Ошибка при удалении заказа:', e.message);
            res.status(500).json({ message: 'Ошибка сервера при удалении заказа' });
        }
    }
}

module.exports = new OrderController()
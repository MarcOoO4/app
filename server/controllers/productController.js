const {Products} = require('../models/models')
const ApiError = require('../error/ApiError');

class ProductController {
    async create(req, res) {
        const {volume, sides, price, quantity_product, product_name, userId, managerId, orderId} = req.body
        const product = await Products.create({volume, sides, price, quantity_product, product_name, userId, managerId, orderId})
        return res.json(product)
    }

    async getAll(req, res) {
        let {userId, managerId} = req.body
        let products;
        if (!userId && !managerId) {
            products = await Products.findAndCountAll()
        }
        if (userId && !managerId) {
            products = await Products.findAndCountAll({where:{userId}})
        }
        if (!userId && managerId) {
            products = await Products.findAndCountAll({where:{managerId}})
        }
        return res.json(products)
    }

    async getOne(req, res) {
        const {id} = req.params
        const product = await Products.findOne(
            {
                where: {id}
            },
        )
        return res.json(product)
    }
    async updateProduct(req, res) {
        const { id, volume, sides, price, quantity_product, product_name, userId, managerId, orderId} = req.body; // Получаем обновленные данные о заказе из тела запроса

        try {
            // Пытаемся найти заказ по id
            const productup = await Products.findByPk(id);

            if (!productup) {
                return res.status(404).json({ message: 'Товар не найден' });
            }

            // Обновляем данные о заказе
            await productup.update({
                volume,
                sides,
                price,
                quantity_product,
                product_name,
                userId,
                managerId,
                orderId
            });

            // Возвращаем обновленный заказ
            res.status(200).json(productup);
        } catch (e) {
            console.error('Ошибка при обновлении товара:', e.message);
            res.status(500).json({ message: 'Ошибка сервера при обновлении товара' });
        }
    }
    async deleteProduct(req, res) {
        const { id } = req.params; // Получаем id товара из параметров запроса

        try {
            // Пытаемся найти товар по id
            const productdel = await Products.findByPk(id);

            if (!productdel) {
                return res.status(404).json({ message: 'Товар не найден' });
            }

            // Удаляем заказ
            await productdel.destroy();

            // Возвращаем сообщение об успешном удалении
            res.status(200).json({ message: 'Товар успешно удален' });
        } catch (e) {
            console.error('Ошибка при удалении товара:', e.message);
            res.status(500).json({ message: 'Ошибка сервера при удалении товара' });
        }
    }
}

module.exports = new ProductController()
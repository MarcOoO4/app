import React, {useContext, useEffect} from 'react';
import {Container, Button} from "react-bootstrap";
import { Context } from "../index";
import './order.css';
import {fetchProducts} from "../http/productAPI";

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // добавляем 1, так как месяцы в JS начинаются с 0
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

const OrderItem = ({order, onEdit}) => {
    const { manager } = useContext(Context);
    const { product } = useContext(Context);
    const isAdmin = manager.isAdmin; // Проверяем, является ли пользователь администратором

    useEffect(() => {
        fetchProducts().then(data => {product.setProducts(data.rows);
        });
    }, [product]);

    const filteredProducts = product.products.filter(product => product.orderId === order.id)

    return (
        <Container className="containerOrder">
            <table className="fixed-width-table my-3">
                <thead>
                <tr>
                    <th>ID заказа</th>
                    <th>Дата заказа</th>
                    <th>Статус заказа</th>
                    <th>Объем товара (м³)</th>
                    <th>Вес товара (кг)</th>
                    <th>Цена заказа</th>
                    <th>Местоположение товара</th>
                    {isAdmin && <th>ID Клиента</th>}
                    <th>ID Товаров</th>
                    {isAdmin && <th>Действия</th>}
                    <th>Дата последнего изменения</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{order.id}</td>
                    <td>{formatDate(order.date)}</td>
                    <td>{order.order_status}</td>
                    <td>{order.volume}</td>
                    <td>{order.weight}</td>
                    <td>{order.price}</td>
                    <td>{order.product_location}</td>
                    {isAdmin && <td>{order.userId}</td>}
                    <td>
                        {filteredProducts.map(product => (
                            <span key={product.id}>{product.id}, </span>
                        ))}
                    </td>
                    {isAdmin && (
                        <td>
                            <Button variant="info" onClick={() => onEdit(order)}>Редактировать</Button>
                        </td>
                    )}
                    <td>{formatDate(order.updatedAt)}</td>
                </tr>
                </tbody>
            </table>
        </Container>
    )
}

export default OrderItem;
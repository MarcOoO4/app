import React, {useContext, useEffect} from 'react';
import {Container, Button} from "react-bootstrap";
import { Context } from "../index";
import './order.css';
import {fetchServices} from "../http/serviceAPI";

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // добавляем 1, так как месяцы в JS начинаются с 0
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}
const ProductItem = ({product, onEdit}) => {
    const { manager } = useContext(Context);
    const {service} = useContext(Context);
    const isAdmin = manager.isAdmin; // Проверяем, является ли пользователь администратором

    useEffect(() => {
        fetchServices().then(data => {service.setServices(data.rows);
        });
    }, [service]);

    const filteredServices = service.services.filter(service => service.productId === product.id)

    return (
        <Container className="containerProduct">
            <table className="fixed-width-table my-3">
                <thead>
                <tr>
                    <th>ID товара</th>
                    <th>Название товара</th>
                    <th>Количество товара</th>
                    <th>Сумма сторон</th>
                    <th>Объем товара (м³)</th>
                    <th>Цена заказа</th>
                    <th>ID заказа</th>
                    <th>ID набора услуг</th>
                    {isAdmin && <th>ID Клиента</th>}
                    {isAdmin && <th>Действия</th>}
                    <th>Дата последнего изменения</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{product.id}</td>
                    <td>{product.product_name}</td>
                    <td>{product.quantity_product}</td>
                    <td>{product.sides}</td>
                    <td>{product.volume}</td>
                    <td>{product.price}</td>
                    <td>{product.orderId}</td>
                    <td>
                        {filteredServices.map(service => (
                            <span key={service.id}>{service.id}, </span>
                        ))}
                    </td>
                    {isAdmin && <td>{product.userId}</td>}
                    {isAdmin && (
                        <td>
                            <Button variant="info" onClick={() => onEdit(product)}>Редактировать</Button>
                        </td>
                    )}
                    <td>{formatDate(product.updatedAt)}</td>
                </tr>
                </tbody>
            </table>
        </Container>
    )
}

export default ProductItem;
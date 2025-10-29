import React, {useContext, useEffect} from 'react';
import {Container} from "react-bootstrap";
import { Context } from "../index";
import './user.css';
import {fetchOrders} from "../http/orderAPI";
import {fetchProducts} from "../http/productAPI";
import {fetchServices} from "../http/serviceAPI";


const UserItem = ({user}) => {
    const {order} = useContext(Context)
    const {product} = useContext(Context)
    const {service} = useContext(Context)
    const filteredOrders = order.orders.filter(order => order.userId === user.id);
    const filteredProducts = product.products.filter(product => product.userId === user.id);
    const filteredServices = service.services.filter(service => service.userId === user.id);

    useEffect( () => {
        fetchOrders().then(data => order.setOrders(data.rows))
    }, [order])

    useEffect( () => {
        fetchProducts().then(data => product.setProducts(data.rows))
    }, [product])

    useEffect( () => {
        fetchServices().then(data => service.setServices(data.rows))
    }, [service])

    return (
        <Container className="containerOrder">
            <table className="fixed-width-table2 my-3">
                <thead>
                <tr>
                    <th>ID пользователя</th>
                    <th>ФИО</th>
                    <th>Номер телефона</th>
                    <th>Email</th>
                    <th>ИНН</th>
                    <th>ОГРН</th>
                    <th>ID заказов</th>
                    <th>ID товаров</th>
                    <th>ID услуг</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{user.id}</td>
                    <td>{user.FIO}</td>
                    <td>{user.phone}</td>
                    <td>{user.email}</td>
                    <td>{user.INN}</td>
                    <td>{user.OGRN}</td>
                    <td>
                        {filteredOrders.map(order => (
                            <span key={order.id}>{order.id}, </span>
                        ))}
                    </td>
                    <td>
                        {filteredProducts.map(product => (
                            <span key={product.id}>{product.id}, </span>
                        ))}
                    </td>
                    <td>
                        {filteredServices.map(service => (
                            <span key={service.id}>{service.id}, </span>
                        ))}
                    </td>
                </tr>
                </tbody>
            </table>
        </Container>
    )
}

export default UserItem;
import React, {useContext} from 'react';
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { Row } from "react-bootstrap";
import OrderItem from "./OrderItem";
import ProductItem from "./ProductItem";
import ServiceItem from "./ServiceItem";

const UserList = observer(({showOrders, showProducts, showServices}) => {
    const {order} = useContext(Context);
    const {product} = useContext(Context);
    const {service} = useContext(Context);
    const id = localStorage.getItem('id');
    const userOrders = order.orders.filter(order => order.userId === parseInt(id));
    const userProducts = product.products.filter(product => product.userId === parseInt(id));
    const userServices = service.services.filter(service => service.userId === parseInt(id));
    const sortedOrders = userOrders.slice().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    const sortedProducts = userProducts.slice().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    const sortedServices = userServices.slice().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));


    return (
        <Row>
            {showOrders && (
                <Row>
                    {sortedOrders.map(order => (
                        <OrderItem key={order.id} order={order} />
                    ))}
                </Row>
            )}
            {showProducts && (
                <Row>
                    {sortedProducts.map(product => (
                        <ProductItem key={product.id} product={product} />
                    ))}
                </Row>
            )}
            {showServices && (
                <Row>
                    {sortedServices.map(service => (
                        <ServiceItem key={service.id} service={service} />
                    ))}
                </Row>
            )}
        </Row>
    );
});

export default UserList;
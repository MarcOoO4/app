import React, {useContext, useEffect, useState} from 'react';
import {Container} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import CreateOrder from "../components/modals/CreateOrder";
import CreateProduct from "../components/modals/CreateProduct";
import CreateService from "../components/modals/CreateService";
import OrderList from "../components/OrderList";
import ProductList from "../components/ProductList";
import ServiceList from "../components/ServiceList";
import EditOrder from "../components/modals/EditOrder";
import EditProduct from "../components/modals/EditProduct";
import EditService from "../components/modals/EditService";
import Users from "../components/Users";
import {fetchOrders} from "../http/orderAPI";
import {fetchProducts} from "../http/productAPI";
import {fetchUsers} from "../http/userAPI";
import {fetchServices} from "../http/serviceAPI";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {checkDatabaseStatus, checkServerConnection} from "../http/statusAPI"
import './admin.css'

const Admin = observer (() => {
    const {order} = useContext(Context)
    const {user} = useContext(Context)
    const {product} = useContext(Context)
    const {service} = useContext(Context)
    const [dbStatus, setDbStatus] = useState('Проверка...');
    const [serverStatus, setServerStatus] = useState('Проверка...');

    const checkDatabase = async () => {
        try {
            const data = await checkDatabaseStatus();
            setDbStatus(data.message);
        } catch (error) {
            setDbStatus('не установлено');
        }
    };

    const checkServer = async () => {
        try {
            const data = await checkServerConnection();
            setServerStatus(data.message);
        } catch (error) {
            setServerStatus('не установлено');
        }
    };

    useEffect(() => {
        // Проверка статуса базы данных и сервера при загрузке страницы
        checkDatabase();
        checkServer();

        // Установка интервала для регулярной проверки статуса базы данных и сервера
        const dbInterval = setInterval(checkDatabase, 500);
        const serverInterval = setInterval(checkServer, 500);

        // Очистка интервалов при размонтировании компонента
        return () => {
            clearInterval(dbInterval);
            clearInterval(serverInterval);
        };
    }, []);


    useEffect( () => {
        fetchOrders().then(data => order.setOrders(data.rows))
    }, [order])

    useEffect( () => {
        fetchUsers().then(data => user.setUsers(data.rows))
    }, [user])

    useEffect( () => {
        fetchProducts().then(data => product.setProducts(data.rows))
    }, [product])

    useEffect( () => {
        fetchServices().then(data => service.setServices(data.rows))
    }, [service])


    const [editOrderVisible, setEditOrderVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [editProductVisible, setEditProductVisible] = useState(false);
    const [editServiceVisible, setEditServiceVisible] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [orderVisible, setOrderVisible] = useState(false);
    const [productVisible, setProductVisible] = useState(false);
    const [serviceVisible, setServiceVisible] = useState(false);
    const [showOrders, setShowOrders] = useState(false);
    const [showProducts, setShowProducts] = useState(false);
    const [showServices, setShowServices] = useState(false);
    const [showUsers, setShowUsers] = useState(false);

    const handleEditOrder = (order) => {
        setSelectedOrder(order);
        setEditOrderVisible(true);
    };

    const handleEditProduct = (product) => {
        setSelectedProduct(product);
        setEditProductVisible(true);
    };

    const handleEditService = (service) => {
        setSelectedService(service);
        setEditServiceVisible(true);
    };

    const handleShowOrders = () => {
        // При клике на кнопку "Заказы", изменяем состояние showOrders, чтобы показать или скрыть список заказов
        setShowOrders(!showOrders);
    };

    const handleShowProducts = () => {
        // При клике на кнопку "Товары", изменяем состояние showProducts, чтобы показать или скрыть список заказов
        setShowProducts(!showProducts);
    };

    const handleShowServices = () => {
        // При клике на кнопку "Услуги", изменяем состояние showServices, чтобы показать или скрыть список заказов
        setShowServices(!showServices);
    };

    const handleShowUsers = () => {
        // При клике на кнопку "Пользователи", изменяем состояние showUsers, чтобы показать или скрыть список заказов
        setShowUsers(!showUsers);
    };

    return (
        <Container className="d-flex flex-column align-items-center">
            <div className="status-box mt-5">
                <h2>Статус подключения</h2>
                <p>Подключение к базе данных: {dbStatus}</p>
                <p>Подключение к серверу: {serverStatus}</p>
            </div>
            <Button
                variant={orderVisible ? "primary" : "outline-dark"}
                className="mt-5 p-2 mb-2 button1"
                onClick={() => setOrderVisible(true)}
            >
                Добавить заказ
            </Button>

            <Button
                variant={productVisible ? "primary" : "outline-dark"}
                className="mt-2 p-2 mb-2 button1"
                onClick={() => setProductVisible(true)}
            >
                Добавить товар
            </Button>

            <Button
                variant={serviceVisible ? "primary" : "outline-dark"}
                className="mt-2 p-2 mb-5 button1"
                onClick={() => setServiceVisible(true)}
            >
                Добавить услуги
            </Button>

            <Button
                variant={showOrders ? "primary" : "outline-dark"}
                className="mt-2 p-2 mb-2 button1"
                onClick={handleShowOrders} // Обработчик клика для кнопки "Заказы"
            >
                Заказы
            </Button>

            <Button
                variant={showProducts ? "primary" : "outline-dark"}
                className="mt-2 p-2 mb-2 button1"
                onClick={handleShowProducts} // Обработчик клика для кнопки "Товары"
            >
                Товары
            </Button>

            <Button
                variant={showServices ? "primary" : "outline-dark"}
                className="mt-2 p-2 mb-2 button1"
                onClick={handleShowServices} // Обработчик клика для кнопки "Товары"
            >
                Услуги
            </Button>

            <Button
                variant={"outline-dark"}
                className="mt-2 p-2 mb-2 button1"
                onClick={handleShowUsers} // Обработчик клика для кнопки "Пользователи"
            >
                Пользователи
            </Button>
            {showOrders && ( // Показываем OrderList только если showOrders равен true
                <OrderList onEdit={handleEditOrder}/>
            )}
            {showProducts && ( // Показываем ProductList только если showProducts равен true
                <ProductList onEdit={handleEditProduct}/>
            )}
            {showServices && ( // Показываем ServiceList только если showProducts равен true
                <ServiceList onEdit={handleEditService}/>
            )}
            {showUsers && ( // Показываем Users только если showUsers равен true
                <Users/>
            )}
            <CreateService show={serviceVisible} onHide={() => setServiceVisible(false)}/>
            <CreateProduct show={productVisible} onHide={() => setProductVisible(false)}/>
            <CreateOrder show={orderVisible} onHide={() => setOrderVisible(false)}/>
            <EditOrder
                show={editOrderVisible}
                onHide={() => setEditOrderVisible(false)}
                order={selectedOrder}
            />
            <EditProduct
                show={editProductVisible}
                onHide={() => setEditProductVisible(false)}
                order={selectedProduct}
            />
            <EditService
                show={editServiceVisible}
                onHide={() => setEditServiceVisible(false)}
                order={selectedService}
            />
        </Container>
    );
});

export default Admin;

import React, {useContext, useEffect, useState} from 'react';
import { Container, Card, Row } from "react-bootstrap";
import { getEmail, getFIO, getPhone, getINN, getOGRN } from "../utils/localStorageKeys";
import UserList from "../components/UserList";
import {fetchOrders} from "../http/orderAPI";
import {fetchProducts} from "../http/productAPI";
import {fetchServices} from "../http/serviceAPI";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import CreateOrder from "../components/modals/CreateOrder";
import CreateProduct from "../components/modals/CreateProduct";
import CreateService from "../components/modals/CreateService";
import Button from "react-bootstrap/Button";

const Profile = observer (() => {
    const {order} = useContext(Context)
    const {product} = useContext(Context)
    const {service} = useContext(Context)
    const [FIO, setFIO] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [INN, setINN] = useState('');
    const [OGRN, setOGRN] = useState('');
    const [orderVisible, setOrderVisible] = useState(false);
    const [productVisible, setProductVisible] = useState(false);
    const [serviceVisible, setServiceVisible] = useState(false);
    const [showOrders, setShowOrders] = useState(false);
    const [showProducts, setShowProducts] = useState(false);
    const [showServices, setShowServices] = useState(false);

    useEffect(() => {
        // Получаем данные пользователя из локального хранилища
        const storedFIO = getFIO();
        const storedPhone = getPhone();
        const storedEmail = getEmail();
        const storedINN = getINN();
        const storedOGRN = getOGRN();

        // Устанавливаем данные пользователя в состояние компонента
        setFIO(storedFIO);
        setPhone(storedPhone);
        setEmail(storedEmail);
        setINN(storedINN);
        setOGRN(storedOGRN);
    }, []);
    useEffect( () => {
        fetchOrders().then(data => order.setOrders(data.rows))
    }, [order])
    useEffect( () => {
        fetchProducts().then(data => product.setProducts(data.rows))
    }, [product])
    useEffect( () => {
        fetchServices().then(data => service.setServices(data.rows))
    }, [service])

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

    return (
        <Container>
            <Row className="justify-content-center align-items-center pb-3">
                <Card style={{ width: 500}} className="p-5 pb-2 pt-2 mt-2">
                    <h2 className="pb-2">Личный кабинет</h2>
                    <div className="justify-content-center align-items-center my-2">
                        <p>ФИО: {FIO}</p>
                        <p>Телефон: {phone}</p>
                        <p>Email: {email}</p>
                        <p>ИНН: {INN}</p>
                        <p>ОГРН: {OGRN}</p>
                    </div>
                </Card>
            </Row>
            <Row className="justify-content-center align-items-center pb-2">
                <Card style={{ width: 500}} className="p-3 pb-2 pt-2 mt-2">
                    <h2 className="pb-2">Как создать заказ?</h2>
                    <div className="justify-content-center align-items-center my-2">
                        <ol>
                            <li>Необходимо нажать кнопку "Добавить заказ" и заполнить данные. Во вкладке "Заказы" отобразится новый заказ со своим ID.</li>
                            <li>Кнопка "Добавить товар" откроет форму для заполнения информации о товаре. В поле "ID заказа" необходимо указать, к какому заказу относится созданный товар. После создания в разделе "Товары" появляется новая запись с ID товара.</li>
                            <li>Добавить услуги к товару можно нажав соответствующую кнопку, указав, к какому ID товара относится выбранный перечень услуг.</li>
                        </ol>
                    </div>
                </Card>
            </Row>
            <Button
                variant={orderVisible ? "primary" : "outline-dark"}
                className="mt-5 p-2 mb-5 button1"
                onClick={() => setOrderVisible(true)}
            >
                Добавить заказ
            </Button>
            <Button
                variant={productVisible ? "primary" : "outline-dark"}
                className="mt-5 p-2 mb-5 button1"
                onClick={() => setProductVisible(true)}
            >
                Добавить товар
            </Button>
            <Button
                variant={serviceVisible ? "primary" : "outline-dark"}
                className="mt-5 p-2 mb-5 button1"
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
            <CreateOrder show={orderVisible} onHide={() => setOrderVisible(false)}/>
            <CreateProduct show={productVisible} onHide={() => setProductVisible(false)}/>
            <CreateService show={serviceVisible} onHide={() => setServiceVisible(false)}/>
            <UserList showOrders={showOrders} showProducts={showProducts} showServices={showServices} />
        </Container>
    );
})

export default Profile;
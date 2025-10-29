import React from 'react';
import {Row, Col, Card, Image} from 'react-bootstrap';
import logo1 from '../Img/logo.jpg';
import logo2 from '../Img/logo2.jpg';
import logoWB from '../Img/WBLogo.png';
import logoOzon from '../Img/OzonLogo.png';
import qr1 from '../Img/telegram.jpg';
import qr2 from '../Img/whatsapp.jpg';
import truck from '../Img/truck.svg';
import box from '../Img/box.svg';
import box2 from '../Img/box2.svg';
import video from '../Img/video.svg';
import keeping from '../Img/keeping.svg';
import bus from '../Img/bus.svg';
import './TableStyles.css';

const Shop = () => {
    const separator = {
        borderRight: '1px solid black',
        height: '100px',
        margin: '0 5px',
    };
    const logoImage = {
        maxWidth: '100%',
        maxHeight: '100%',
    };

    return (
        <div>
            <div id="home">
                <div>
                    <Row className="justify-content-center align-items-center">
                        <Col xs={6} md={4}>
                            <Image src={logo1} roundedCircle fluid/>
                        </Col>
                    </Row>
                </div>
                <div className="my-1">
                    <Row className="justify-content-center align-items-center mb-2">
                        <Col md='3' className="d-flex align-items-stretch">
                            <Card style={{width: '300px', height: '180px', margin: '10px'}}>
                                <Card.Body className="text-center">
                                    <Card.Title style={{color: 'green', margin: '5px'}}>Ваш личный помощник</Card.Title>
                                    <Card.Text style={{margin: '5px'}}>Если ещё не определились с видом упаковки,
                                        складами для отгрузки, мы с радостью готовы поделиться советом.</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md='3' className="d-flex align-items-stretch">
                            <Card style={{width: '300px', height: '180px', margin: '10px'}}>
                                <Card.Body className="text-center">
                                    <Card.Title style={{color: 'green', margin: '10px'}}>FBO/FBS</Card.Title>
                                    <Card.Text style={{margin: '10px'}}>Отгрузим товар по любой удобной для вас
                                        системе.</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md='3' className="d-flex align-items-stretch">
                            <Card style={{width: '300px', height: '180px', margin: '10px'}}>
                                <Card.Body className="text-center">
                                    <Card.Title style={{color: 'green', margin: '10px'}}>Надёжный партнёр</Card.Title>
                                    <Card.Text style={{margin: '10px'}}>Мы имеем в собственности грузовой транспорт и
                                        охраняемый отапливаемый склад.</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </div>
                <div>
                    <div className="justify-content-center align-items-center"
                         style={{textAlign: 'center', marginTop: '20px', display: "flex"}}>
                        <div>
                            <img src={logoWB} alt="Логотип 1" style={logoImage}/>
                        </div>
                        <div style={separator}></div>
                        <div>
                            <img src={logoOzon} alt="Логотип 2" style={logoImage}/>
                        </div>
                    </div>
                </div>
            </div>

            <div id="services" className="my-5" style={{backgroundColor: '#f0f0f0', padding: '30px'}}>
                <h2 className="text-center mb-5">Услуги</h2>
                <Row className="justify-content-center align-items-center mb-2">
                    <Col md='3' className="">
                        <Card style={{width: '280px', height: '320px', marginRight: '30px', marginBottom: '20px'}}>
                            <img className="card-img-top" src={truck} alt="грузовик"
                                 style={{width: '60px', height: '60px', margin: '20px 20px 5px 20px'}}/>
                            <Card.Body>
                                <Card.Title>Приём товара</Card.Title>
                                <Card.Text>Примем груз со любого склада в Санкт-Петербурге. Всё сделаем самостоятельно,
                                    от Вас только информация по грузу.</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md='3' className="">
                        <Card style={{
                            width: '280px',
                            height: '320px',
                            marginRight: '15px',
                            marginLeft: '15px',
                            marginBottom: '20px'
                        }}>
                            <img className="card-img-top" src={box} alt="этап1"
                                 style={{width: '60px', height: '60px', margin: '20px 20px 5px 20px'}}/>
                            <Card.Body>
                                <Card.Title>Проверка на брак</Card.Title>
                                <Card.Text>Наши специалисты произведут визуальную проверку на брак, отсмотрев каждую
                                    единицу товара.</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md='3' className="">
                        <Card style={{width: '280px', height: '320px', marginLeft: '30px', marginBottom: '20px'}}>
                            <img className="card-img-top" src={box2} alt="этап2"
                                 style={{width: '60px', height: '60px', margin: '20px 20px 5px 20px'}}/>
                            <Card.Body>
                                <Card.Title>Упаковка и маркировка</Card.Title>
                                <Card.Text>Согласуем с Вами конечный вид изделия, после чего мы самостоятельно закупим
                                    всё необходимое и упакуем, а также наклеим любые маркировки: штрихкод, честный знак
                                    и т.д.</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row className="justify-content-center align-items-center mb-2">
                    <Col md='3' className="">
                        <Card style={{width: '280px', height: '320px', marginRight: '30px'}}>
                            <img className="card-img-top" src={video} alt="этап3"
                                 style={{width: '60px', height: '60px', margin: '20px 20px 5px 20px'}}/>
                            <Card.Body>
                                <Card.Title>Видеофиксация</Card.Title>
                                <Card.Text>На каждом этапе работы с товаром производим фото-/видеосъёмку.</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md='3' className="">
                        <Card style={{width: '280px', height: '320px', marginRight: '15px', marginLeft: '15px'}}>
                            <img className="card-img-top" src={keeping} alt="этап4"
                                 style={{width: '60px', height: '60px', margin: '20px 20px 5px 20px'}}/>
                            <Card.Body>
                                <Card.Title>Хранение товара</Card.Title>
                                <Card.Text>Обеспечим лучшие условия для хранения Вашего товара на нашем
                                    складе.</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md='3' className="">
                        <Card style={{width: '280px', height: '320px', marginLeft: '30px'}}>
                            <img className="card-img-top" src={bus} alt="этап5"
                                 style={{width: '60px', height: '60px', margin: '20px 20px 5px 20px'}}/>
                            <Card.Body>
                                <Card.Title>Отгрузка на любой склад РФ</Card.Title>
                                <Card.Text>Производим регулярные рейсы с поставкой товаров на маркетплейсы в такие
                                    города, как: Москва, Тула, Екатеринбург, Краснодар, Невинномысск,
                                    Казань.</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>

            <div style={{padding: '30px'}}>
                <h2 className="text-center mb-3">Перечень работы при упаковке</h2>
                <div className="steps-container">
                    <div className="step">
                        <div className="step-number">1</div>
                        <div className="step-content">
                            <div className="step-title">Забираем товар</div>
                            <div className="step-description">Забираем у поставщика, транспортной компании.
                            </div>
                        </div>
                    </div>
                    <div className="step">
                        <div className="step-number">2</div>
                        <div className="step-content">
                            <div className="step-title">Привозим на склад, сортируем</div>
                            <div className="step-description">Привозим товар на наш склад, принимаем его и сортируем.
                            </div>
                        </div>
                    </div>
                    <div className="step">
                        <div className="step-number">3</div>
                        <div className="step-content">
                            <div className="step-title">Проверяем на брак</div>
                            <div className="step-description">Проводим визуальную проверку товара на брак и
                                работоспособность.
                            </div>
                        </div>
                    </div>
                    <div className="step">
                        <div className="step-number">4</div>
                        <div className="step-content">
                            <div className="step-title">Упаковываем и маркируем</div>
                            <div className="step-description">Упаковываем товары в подходящую упаковку и маркируем по
                                всем правилам маркетплейсов
                            </div>
                        </div>
                    </div>
                    <div className="step">
                        <div className="step-number">5</div>
                        <div className="step-content">
                            <div className="step-title">Храним товар</div>
                            <div className="step-description">Бесплатное хранение товара в течение 5 дней после
                                завершения работ
                            </div>
                        </div>
                    </div>
                    <div className="step">
                        <div className="step-number">6</div>
                        <div className="step-content">
                            <div className="step-title">Отправляем на маркетплейс</div>
                            <div className="step-description">Наш автомобиль с вашим товаром уезжает на склады
                                маркетплейсов.
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-calculator">
                    <h2 className="text-center mb-3 mt-5">Заинтересованы? Рассчитайте стоимость своего заказа!</h2>
                    <a href="/calculator" className="button">Калькулятор</a>
                </div>
            </div>

            <div id="contacts" style={{backgroundColor: '#f0f0f0', padding: '30px', marginTop: '30px'}}>
                <div>
                    <div>
                        <Row className="justify-content-center align-items-center my-5">
                            <Col xs={6} md={4}>
                                <Image src={logo2} roundedCircle fluid/>
                            </Col>
                        </Row>
                    </div>
                    <div>
                        <h2 className="text-center mb-5" style={{fontSize: 30, fontWeight: "bold"}}>Фулфилмент в
                            Санкт-Петербурге</h2>
                        <h2 className="text-center" style={{fontSize: 25, fontWeight: "bold", marginBottom: 0}}>Как с
                            нами
                            связаться</h2>
                    </div>
                </div>
                <div className="grid-container">
                    <div className="column1">
                        <h2 style={{fontSize: 20, fontWeight: "bold", margin: 0}}>Наша почта</h2>
                        <p style={{fontSize: 15, margin: 0, marginBottom: 10}}>thedoers.spb@gmail.com</p>
                        <h2 style={{fontSize: 20, fontWeight: "bold", margin: 0}}>Telegram</h2>
                        <p style={{fontSize: 15, margin: 0, marginBottom: 10}}>@thedoers_manager</p>
                        <Image className="ImageQr" src={qr1} thumbnail fluid/>
                    </div>
                    <div className="column2">
                        <h2 style={{fontSize: 20, fontWeight: "bold", margin: 0}}>Номер телефона</h2>
                        <p style={{fontSize: 15, margin: 0, marginBottom: 25}}>+7 (993) 481-46-87</p>
                        <h2 style={{fontSize: 20, fontWeight: "bold", marginBottom: 15}}>WhatsApp</h2>
                        <Image className="ImageQr" src={qr2} thumbnail fluid/>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Shop;
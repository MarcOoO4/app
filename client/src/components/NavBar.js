import React, {useContext} from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {Context} from "../index";
import {NavLink, useLocation} from "react-router-dom";
import {ADMIN_ROUTE, LOGIN_ROUTE, SHOP_ROUTE, ACCOUNT_ROUTE, CALCULATOR_ROUTE} from "../utils/consts";
import {Button} from "react-bootstrap";
import {observer} from "mobx-react-lite";
import {useNavigate} from 'react-router-dom';


const NavBar = observer(() => {
    const {user} = useContext(Context)
    const {manager} = useContext(Context)
    const navigate = useNavigate();
    const location = useLocation();

    const logOut = () => {
        user.setUser({})
        user.setIsAuth(false)
        manager.setManager({})
        manager.setIsAuth(false)
        manager.setIsAdmin(false);
        localStorage.clear();
        // Проверяем, находится ли пользователь на странице личного кабинета или админ-панели
        if (location.pathname === ACCOUNT_ROUTE || location.pathname === ADMIN_ROUTE) {
            navigate(SHOP_ROUTE);
        }
    }

    const linkStyle = {
        color: 'white',
        textDecoration: 'none',
        display: 'block',
        padding: '10px',
    };

    const handleNavigate = (route) => {
        navigate(route);
        window.scrollTo(0, 0);
    };

    const handleAnchorNavigate = (anchor) => {
        navigate(SHOP_ROUTE);
        setTimeout(() => {
            document.querySelector(anchor).scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    return (
        <div style={{ height: '90px' }}>
            <Navbar bg="dark" data-bs-theme="dark" className="fixed-top">
                <Container>
                    <NavLink style={{
                        color: 'white',
                        textDecoration: "none",
                        fontSize: '20px',
                        fontWeight: 'bold',
                        marginRight: '50px'
                    }} to={SHOP_ROUTE}>THE DOERS</NavLink>
                        <Nav style={{color: 'white', marginRight: 'auto'}}>
                            <Nav.Link style={linkStyle} onClick={() => handleNavigate(SHOP_ROUTE)}>Главная</Nav.Link>
                            <Nav.Link style={linkStyle} onClick={() => handleAnchorNavigate('#services')}>Услуги</Nav.Link>
                            <Nav.Link style={linkStyle} onClick={() => handleAnchorNavigate('#contacts')}>Контакты</Nav.Link>
                            <NavLink to={CALCULATOR_ROUTE} style={linkStyle}>Калькулятор</NavLink>
                        </Nav>
                    {user.isAuth || manager.isAuth ? (
                        <Nav className="ml-auto" style={{ color: 'white' }}>
                            {!manager.isAdmin && (
                                <Button variant={'outline-light'} className="mr-2" onClick={() => navigate(ACCOUNT_ROUTE)}>
                                    Личный кабинет
                                </Button>
                            )}
                            {manager.isAdmin && (
                                <Button variant={'outline-light'} className="mr-2" onClick={() => navigate(ADMIN_ROUTE)}>
                                    Админ панель
                                </Button>
                            )}
                            <Button variant={'outline-light'} onClick={() => logOut()} className="ms-2">
                                Выйти
                            </Button>
                        </Nav>
                    ) : (
                        <Nav className="ml-auto" style={{ color: 'white' }}>
                            <Button variant={'outline-light'} onClick={() => navigate(LOGIN_ROUTE)}>
                                Авторизация
                            </Button>
                        </Nav>
                    )}
                </Container>
            </Navbar>
        </div>
    );
});


export default NavBar;
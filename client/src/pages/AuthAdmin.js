import React, {useContext, useState} from 'react';
import {Container, Form} from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import {NavLink, useNavigate} from "react-router-dom";
import {LOGIN_ROUTE, ADMIN_ROUTE} from "../utils/consts";
import { login } from "../http/managerAPI";
import {observer} from "mobx-react-lite";
import {Context} from "../index";


const AuthAdmin = observer(() => {
    const {manager} = useContext(Context)
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const clickManager = async () => {
        try {
            const data = await login(email, password);
            manager.setManager(data)
            manager.setIsAuth(true)
            manager.setIsAdmin(true)

            navigate(ADMIN_ROUTE)
        } catch (e) {
            alert(e.response.data.message);
        }
    };

    return (
        <Container
            className="d-flex justify-content-center align-items-center" style={{ height: '110vh' }}>
            <Card style={{width: 600}} className="p-5">
                <h2 className="m-auto">Авторизация</h2>
                <Form className="d-flex flex-column">
                    <Form.Control
                        className="mt-3"
                        placeholder="Введите email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <Form.Control
                        className="mt-3"
                        placeholder="Введите пароль"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                    />
                    <Row className="d-flex justify-content-between mt-3 pl-3 pr-3">
                        <div>
                            <div><NavLink to={LOGIN_ROUTE}>Авторизация для пользователей</NavLink></div>
                        </div>
                        <Button
                            className={"mt-3"}
                            variant={"outline-success"}
                            onClick={clickManager}
                        >
                            Войти
                        </Button>
                    </Row>

                </Form>
            </Card>
        </Container>
    );
});

export default AuthAdmin;
import React, {useContext, useEffect, useState} from 'react';
import {BrowserRouter} from "react-router-dom";
import AppRouter from './components/AppRouter';
import Navbar from "./components/NavBar";
import {Context} from "./index";
import 'bootstrap/dist/css/bootstrap.min.css';
import {observer} from "mobx-react-lite";
import {check} from "./http/userAPI";
import {checkManager} from "./http/managerAPI";
import {Spinner} from "react-bootstrap";


const App = observer ( () => {
  const {user} = useContext(Context)
  const {manager} = useContext(Context)
  const [loading, setLoading] = useState (true)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Проверяем, аутентифицирован ли пользователь
                const userData = await check();
                user.setUser(userData);
                user.setIsAuth(true);
            } catch (error) {
                // Если пользователь не аутентифицирован, продолжаем проверку аутентификации менеджера
                try {
                    const managerData = await checkManager();
                    manager.setManager(managerData);
                    manager.setIsAuth(true);
                    manager.setIsAdmin(true); // Предполагаем, что все аутентифицированные менеджеры являются администраторами
                } catch (error) {
                    // Если ни пользователь, ни менеджер не аутентифицированы, ничего не делаем
                }
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [user, manager]);

    if (loading) {
        return <Spinner animation="grow" />;
    }

  return (
      <BrowserRouter>
        <Navbar />
        <AppRouter />
      </BrowserRouter>
  );
});

export default App;
import React, {useContext, useEffect, useState} from 'react';
import {Routes, Route, Navigate, useLocation, useNavigate} from 'react-router-dom';
import {authRoutes, publicRoutes, adminRoutes} from "../routes";
import {Context} from "../index";
import {ADMIN_ROUTE, ACCOUNT_ROUTE, SHOP_ROUTE} from "../utils/consts";
import Admin from "../pages/Admin";
import Profile from "../pages/UserProfile";

const AppRouter = () => {
    const {user} = useContext(Context)
    const {manager} = useContext(Context)
    const location = useLocation();
    const navigate = useNavigate();
    const [redirectPath, setRedirectPath] = useState(null);

    useEffect(() => {
        if (manager.isAuth && manager.isAdmin && location.pathname === SHOP_ROUTE) {
            setRedirectPath(ADMIN_ROUTE);
        } else if (user.isAuth && location.pathname === SHOP_ROUTE) {
            setRedirectPath(ACCOUNT_ROUTE);
        } else {
            setRedirectPath(null);
        }
    }, [user.isAuth, manager.isAuth, manager.isAdmin, location.pathname]);

    return (
        <Routes>
            {/* Маршруты для админа */}
            {manager.isAdmin && adminRoutes.map(({ path, Component }) => (
                <Route key={path} path={path} element={<Component />} />
            ))}
            {/* Маршруты для аутентифицированных пользователей */}
            {(user.isAuth) && authRoutes.map(({ path, Component }) => (
                    <Route key={path} path={path} element={<Component />} />
                ))}
            {/* Маршруты для всех пользователей (публичные маршруты) */}
            {publicRoutes.map(({ path, Component }) => (
                <Route key={path} path={path} element={<Component />} />
            ))}
            <Route path="*" element={<Navigate to={SHOP_ROUTE} />} />
        </Routes>
    );
};

export default AppRouter;
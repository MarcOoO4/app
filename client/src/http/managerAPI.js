import {$authHost, $host} from "./index";
import {jwtDecode} from "jwt-decode";

export const login = async (email, password) => {
    const {data} = await $host.post('api/manager/login', {email, password})
    localStorage.setItem('token', data.token)
    localStorage.setItem('isAdmin', true); // Сохраняем isAdmin в localStorage
    return jwtDecode(data.token)
}

export const checkManager = async () => {
    const {data} = await $authHost.get('api/manager/auth')
    localStorage.setItem('token', data.token)
    localStorage.setItem('isAdmin', true); // Сохраняем isAdmin в localStorage
    return jwtDecode(data.token)
}

export const fetchManagers = async () => {
    const {data} = await $authHost.get('api/manager', )
    return data
}

export const fetchManager = async (id) => {
    const {data} = await $authHost.get(`api/manager/${id}` )
    return data
}
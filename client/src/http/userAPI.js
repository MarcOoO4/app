import {$authHost, $host} from "./index";
import {jwtDecode} from "jwt-decode";

export const userRegistration = async (FIO, phone, email, name_ur, INN, KPP, OGRN, OKPO, ur_address, payment_account, password) => {
    const {data} = await $host.post('api/user/registration', {FIO, phone, email, name_ur, INN, KPP, OGRN, OKPO, ur_address, payment_account, password})
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const userLogin = async (email, password) => {
    const {data} = await $host.post('api/user/login', {email, password})
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const check = async () => {
    const {data} = await $authHost.get('api/user/auth')
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const fetchUsers = async () => {
    const {data} = await $authHost.get('api/user', )
    return data
}

export const fetchUser = async (id) => {
    const {data} = await $authHost.get(`api/user/${id}` )
    return data
}
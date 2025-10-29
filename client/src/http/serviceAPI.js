import {$authHost} from "./index";

export const createService = async (service) => {
    const {data} = await $authHost.post('api/service', service)
    return data
}

export const fetchServices = async () => {
    const {data} = await $authHost.get('api/service')
    return data
}

export const updateService = async (id, service) => {
    const {data} = await $authHost.put(`api/service/serviceupdate/${id}`, service)
    return data
}
export const deleteService = async (id) => {
    const {data} = await $authHost.delete(`api/service/servicedelete/${id}`)
    return data
}
// Получить значение email из локального хранилища
export const getEmail = () => {
    return localStorage.getItem('email');
};

// Получить значение ФИО из локального хранилища
export const getFIO = () => {
    return localStorage.getItem('FIO');
};

// Получить значение телефона из локального хранилища
export const getPhone = () => {
    return localStorage.getItem('phone');
};

export const getINN = () => {
    return localStorage.getItem('INN');
};

export const getOGRN = () => {
    return localStorage.getItem('OGRN');
};
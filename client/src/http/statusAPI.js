import { $host } from "./index";

export const checkDatabaseStatus = async () => {
        const { data } = await $host.get('api/database/status');
        return data;
};

export const checkServerConnection = async () => {
        const { data } = await $host.get('api/server/status');
        return data;
};
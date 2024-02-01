import { DataSource } from "typeorm";

export const connection = new DataSource({
    type: 'mysql',
    port: 3306,
    host: 'localhost',
    database: 'bot-exo',
    password: 'bot-exo',
    username: 'bot-exo',
    entities: ['Database/models/*.ts'],
})


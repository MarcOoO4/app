require('dotenv').config()
const express = require('express')
const { sequelize, testDatabaseConnection } = require('./db');
const cors = require('cors')
const router = require('./routes/index.js')
const errorHandler = require('./middleware/ErrorHandlingMiddleware.js')

const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api', router)

// Обработка ошибок, последний Middleware
app.use(errorHandler)

app.get('/api/server/status', (req, res) => {
    res.status(200).json({ message: 'установлено' });
});

app.get('/api/database/status', async (req, res) => {
    try {
        await testDatabaseConnection(); // Проверка подключения к базе данных
        res.status(200).json({ message: 'установлено' });
    } catch (error) {
        res.status(500).json({ message: 'Не удалось подключиться к базе данных', error: error.message });
    }
});

const start = async () => {
    try {
        await testDatabaseConnection(); // Проверка подключения к базе данных
        await sequelize.sync()
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()
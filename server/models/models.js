const {sequelize} = require('../db')
const {DataTypes} = require ('sequelize')

const Users = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    FIO: {type: DataTypes.STRING, allowNull: false},
    phone: {type: DataTypes.STRING, unique: true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    name_ur: {type: DataTypes.STRING, allowNull: false},
    INN: {type: DataTypes.STRING, unique: true, allowNull: false},
    KPP: {type: DataTypes.INTEGER},
    OGRN: {type: DataTypes.BIGINT, unique: true, allowNull: false},
    OKPO: {type: DataTypes.INTEGER, unique: true, allowNull: false},
    ur_address: {type: DataTypes.STRING},
    payment_account: {type: DataTypes.STRING, unique: true, allowNull: false},
})

const Managers = sequelize.define('manager', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    FIO: {type: DataTypes.STRING, allowNull: false},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
})

const Orders = sequelize.define('order', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    date: {type: DataTypes.DATE},
    order_status: {type: DataTypes.STRING, allowNull: false},
    product_location: {type: DataTypes.STRING, allowNull: false},
    volume: {type: DataTypes.FLOAT, allowNull: false},
    weight: {type: DataTypes.FLOAT, allowNull: false},
    price: {type: DataTypes.INTEGER},
})

const Products = sequelize.define('product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    volume: {type: DataTypes.FLOAT, allowNull: false},
    sides: {type: DataTypes.FLOAT, allowNull: false},
    price: {type: DataTypes.INTEGER},
    quantity_product: {type: DataTypes.INTEGER, allowNull: false},
    product_name: {type: DataTypes.STRING, allowNull: false}
})

const Services = sequelize.define('services', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    service: {type: DataTypes.STRING},
    servicePackage: {type: DataTypes.STRING},
    shipment: {type: DataTypes.STRING},
    marketplace: {type: DataTypes.STRING}
})

Users.hasMany(Orders)
Orders.belongsTo(Users)

Users.hasMany(Products)
Products.belongsTo(Users)

Users.hasMany(Services)
Services.belongsTo(Users)

Orders.hasMany(Products)
Products.belongsTo(Orders)

Managers.hasMany(Orders)
Orders.belongsTo(Managers)

Managers.hasMany(Services)
Services.belongsTo(Managers)

Managers.hasMany(Products)
Products.belongsTo(Managers)

Products.hasOne(Services)
Services.belongsTo(Products)

module.exports = {
    Users,
    Orders,
    Managers,
    Products,
    Services
}
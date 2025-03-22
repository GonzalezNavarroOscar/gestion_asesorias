const userModel = require('../models/User');

const getUsers = async () => {
    try {
        return await userModel.getUsers();
    } catch (error) {
        throw new Error('Error al obtener usuarios: ' + error.message);
    }
};

const createUser = async (username, email, password) => {
    try {
        return await userModel.createUser(username, email, password);
    } catch (error) {
        throw new Error('Error al crear usuario: ' + error.message);
    }
};

module.exports = { getUsers, createUser };

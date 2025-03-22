const userService = require('../services/userService');

const createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = await userService.createUser(username, email, password);
        res.status(201).json({ message: 'Usuario creado con éxito', user: newUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await userService.getUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createUser, getUsers };

const connection = require('../config/db');

const getUsers = async () => {
    const [rows] = await connection.promise().query('SELECT * FROM users');
    return rows;
};

const createUser = async (username, email, password) => {
    const result = await connection.promise().query(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, password]
    );
    return result;
};

module.exports = { getUsers, createUser };

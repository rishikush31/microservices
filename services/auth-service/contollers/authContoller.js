const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Password-based signup
exports.signup = async (req, res) => {
    const { email, password } = req.body;
    try {

        const hash = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO auth_users(email, password_hash) VALUES($1, $2) RETURNING id, email',
            [email, hash]
        );

        res.json(result.rows[0]);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Password-based login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {

        const result = await pool.query('SELECT * FROM auth_users WHERE email=$1', [email]);

        if (result.rows.length === 0)
            return res.status(400).json({ error: 'User not found' });

        const user = result.rows[0];

        const match = await bcrypt.compare(password, user.password_hash);

        if (!match)
            return res.status(400).json({ error: 'Invalid password' });

        const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        res.json({ token });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// OAuth callback handler
exports.oauthCallback = (req, res) => {

    const user = req.user;

    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.json({ user, token });
};

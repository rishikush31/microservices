const pool = require('../db');

// GET /users/profile
exports.getProfile = async (req, res) => {
    try {
        const { userId } = req.user; // from JWT middleware
        const result = await pool.query(
            'SELECT id, name, email FROM users WHERE id=$1',
            [userId]
        );

        if (result.rows.length === 0)
            return res.status(404).json({ error: 'User not found' });

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

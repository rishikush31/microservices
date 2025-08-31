const pool = require('../db');

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId; // from JWT middleware
    const result = await pool.query(
      'SELECT * FROM notifications WHERE recipient_id=$1 AND acknowledged=false ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.acknowledgeNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    await pool.query(
      'UPDATE notifications SET acknowledged=true WHERE id=$1',
      [notificationId]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

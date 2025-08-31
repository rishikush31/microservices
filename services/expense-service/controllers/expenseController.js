const pool = require('../db');

exports.createExpense = async (req, res) => {
  try {
    const { title, description, amount, shares } = req.body;
    const payerId = req.user.userId; // from JWT

    // Insert expense
    const expenseResult = await pool.query(
      'INSERT INTO expenses (title, description, amount, payer_id) VALUES ($1, $2, $3, $4) RETURNING id',
      [title, description, amount, payerId]
    );

    const expenseId = expenseResult.rows[0].id;

    // Insert expense shares
    const sharePromises = shares.map(share =>
      pool.query(
        'INSERT INTO expense_share (expense_id, payer_id, payee_id, amount) VALUES ($1, $2, $3, $4)',
        [expenseId, payerId, share.payeeId, share.amount]
      )
    );

    await Promise.all(sharePromises);

    res.status(201).json({ expenseId });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getMyExpenses = async (req, res) => {
  try {
    const payerId = req.user.userId;
    const result = await pool.query(
      'SELECT * FROM expenses WHERE payer_id=$1 ORDER BY created_at DESC',
      [payerId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

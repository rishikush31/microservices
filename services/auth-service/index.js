const session = require('express-session');
const passport = require('./oauth');

app.use(session({ secret: 'keyboardcat', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth route
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// OAuth callback
app.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {

        // Successful login, issue JWT
        const token = jwt.sign({ userId: req.user.id, email: req.user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN, }
        );
        res.json({ token });
    }
);

app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    try {

        const hash = await bcrypt.hash(password, 10); // hash password
        
        const result = await pool.query(
            'INSERT INTO auth_users(email, password_hash) VALUES($1, $2) RETURNING id, email',
            [email, hash]
        );

        res.json(result.rows[0]);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        
        const result = await pool.query('SELECT * FROM auth_users WHERE email=$1', [email]);
        
        if (result.rows.length === 0) 
            return res.status(400).json({ error: 'User not found' }); // User not found

        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) 
            return res.status(400).json({ error: 'Invalid password' }); // password did not match

        const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        res.json({ token });
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


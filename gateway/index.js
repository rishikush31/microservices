const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
require("dotenv").config();

const verifyToken = require("./middleware/verifyToken");

const app = express();
app.use(express.json());

// Public route: Auth service
app.use(
    "/auth",
    createProxyMiddleware({
        target: process.env.AUTH_SERVICE,
        changeOrigin: true,
        pathRewrite: { "^/auth": "" }
    })
);

// Protected routes: User, Expense, Notification
app.use(
    "/user",
    verifyJWT,
    createProxyMiddleware({
        target: process.env.USER_SERVICE,
        changeOrigin: true,
        pathRewrite: { "^/user": "" }
    })
);

app.use(
    "/expense",
    verifyJWT,
    createProxyMiddleware({
        target: process.env.EXPENSE_SERVICE,
        changeOrigin: true,
        pathRewrite: { "^/expense": "" }
    })
);

app.use(
    "/notification",
    verifyJWT,
    createProxyMiddleware({
        target: process.env.NOTIFICATION_SERVICE,
        changeOrigin: true,
        pathRewrite: { "^/notification": "" }
    })
);

app.listen(process.env.PORT, () => {
    console.log(`API Gateway running on port ${process.env.PORT}`);
});

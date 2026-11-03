const express = require('express');
const register = require('./routes/register')
const login = require('./routes/login')

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// APIs
app.use('/register', register);
app.use('/login', login)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
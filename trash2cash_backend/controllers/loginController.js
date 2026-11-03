const pool = require('../config/DBconnect')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')

dotenv.config();

const loginUser = async (req, res) => {
    const { email, password } = req.body
    try {
        if(!email || !password) {
            console.log('Input fields cannot be empty')
            return res.status(400).json({
                message: 'Input fields cannot be empty'
            })
        }

        const [existingAccount] = await pool.query(
            `SELECT user_id, full_name, email, password, role FROM users WHERE email = ?`, [email]
        )
        if(existingAccount.length === 0) {
            console.log("User with this account doesn't exist. Check your username or password or create an account to proceed")
            return res.status(404).json({
                message: "User with this account doesn't exist. Check your username or password or create an account to proceed"
            })
        }

        const isValid = await bcrypt.compare(password, existingAccount[0].password)
        if(!isValid) {
            console.log('Invalid email or password. Try again')
            return res.status(400).json({
                message: 'Invalid email or password. Please try again'
            })
        }

        const token = jwt.sign(
            {
                user_id: existingAccount[0].user_id,
                email: existingAccount[0].email,
                role: existingAccount[0].role
            }, process.env.SECRET_KEY,
            {
                expiresIn: process.env.EXPIRES_IN
            }
        )

        console.log('Login successful. Welcome')
        res.status(200).json({
            token,
            message: 'Login successful. Welcome'
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server error'
        })
    }
}

module.exports = loginUser;
const pool = require('../config/DBconnect')
const  bcrypt = require('bcrypt')

const createUser = async (req, res) => {
    const {full_name, email, phone, password, confirmation} = req.body
    try {
        if(!full_name || !email || !phone || !password || !confirmation) {
            return(
                res.status(400).json({
                    message: 'input fields cannot be empty'
                })
            )
        }
        const [existingUser] = await pool.query(
            'SELECT user_id, full_name, email FROM users WHERE email = ?',
            [email]
        )
        if(existingUser.length > 0) {
            return(
                res.status(409).json({
                    message: 'This account already exists, Log in'
                })
            )
        }

        if(password !== confirmation) {
            return(
                res.status(400).json({
                    message: 'Passwords do not match. Re-enter your passwords and try again'
                })
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const [users] = await pool.query(
            'INSERT INTO users(user_id, full_name, email, phone, password) VALUES (UUID_TO_BIN(UUID()), ?, ?, ?, ?)',
            [full_name, email, phone, hashedPassword]
        )

        res.status(201).json({
            message: 'Your account has been created successfully'
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'internal server error'
        })
    }
}

module.exports = createUser
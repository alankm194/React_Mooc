const User = require('../models/user')



const userInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
} 

module.exports = userInDb
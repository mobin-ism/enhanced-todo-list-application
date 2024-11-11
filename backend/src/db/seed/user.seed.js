const User = require('../../models/user.model')
const roles = require('../../config/roles') // Import your roles configuration

async function seedSuperUser() {
    try {
        // Check if a superuser already exists
        const existingSuperUser = await User.findOne({
            role: roles.Roles.ADMIN
        })
        if (existingSuperUser) {
            console.log('Superuser already exists. Skipping seeding.')
            return
        }

        // Create a new superuser
        const superUser = new User({
            name: 'Super Admin',
            email: 'superadmin@example.com',
            password: 'password123',
            role: roles.Roles.ADMIN,
            isEmailVerified: true
        })

        // Save the superuser to the database
        await superUser.save()
        console.log('Superuser created successfully.')
    } catch (error) {
        console.error('Either superadmin exists or an error occurred')
    }
}

seedSuperUser()

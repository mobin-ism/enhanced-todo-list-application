const allRoles = {
    user: ['getCategories', 'manageTasks', 'getTasks'],
    admin: [
        'getUsers',
        'manageUsers',
        'manageCategories',
        'getCategories',
        'manageTasks',
        'getTasks'
    ]
}

const roles = Object.keys(allRoles)
const roleRights = new Map(Object.entries(allRoles))

module.exports = {
    roles,
    roleRights
}

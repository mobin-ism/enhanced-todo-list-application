// AVAILABLE ROLES
const Roles = {
    USER: 'user',
    ADMIN: 'admin'
}

const roleAccess = {
    user: ['manageCategories', 'getCategories', 'manageTasks', 'getTasks'],
    admin: [
        'getUsers',
        'manageUsers',
        'manageCategories',
        'getCategories',
        'manageTasks',
        'getTasks'
    ]
}

const roles = Object.keys(roleAccess)
const roleRights = new Map(Object.entries(roleAccess))

module.exports = {
    Roles,
    roles,
    roleRights
}

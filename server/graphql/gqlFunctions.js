import log from '../mongoose/new-project/models/log'
import user from '../mongoose/new-project/models/user'
import role from '../mongoose/new-project/models/role'

function dataStamp() {
    var options = { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }
    return (
        new Date().toLocaleTimeString('en-GB', options)
    )
}

const TypeOfOperation = (type, roleInfo) => {
    switch (type.toString()) {
        case 'Query':
            return roleInfo.queries

        case 'Mutation':
            return roleInfo.mutations

        case 'Subscription':
            return roleInfo.subscriptions
        default:
            throw new Error('You must provide queries/mutations/subscriptions')
    }
}

export function logger(parentType, fieldName, args, context, details) {
    const newLog = new log({
        parentType: parentType,
        fieldName: fieldName,
        user: context.email || "guest",
        details: details
    });
    newLog.save()
}


export function checkPermissions(parentType, fieldName, args, context) {
    if (fieldName === "login" && context.token.email === "undefined") return true
    return role.findOne({ _id: context.role })
        .then((roleInfo) => {
            return  TypeOfOperation(parentType, roleInfo).includes(fieldName)
        })

}

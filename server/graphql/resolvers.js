import user from '../mongoose/new-project/models/user'
import role from '../mongoose/new-project/models/role'
import { logger, checkPermissions } from './gqlFunctions'
import { PubSub } from "apollo-server";

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { ObjectID } = require('mongodb')
require('dotenv').config()

const pubsub = new PubSub();

const resolvers = {
    User: {
        role: (parent, args, context) => role.findOne({ _id: parent.role })
    },
    Role: {
        users: (parent, args, context) => user.find({ role: parent._id })
    },
    Query: {
        async me(parent, args, context, info) {
            /*  if (!await checkPermissions(info.parentType, info.fieldName, args, context)) {
                 return new Error('You have not permission for this action')
             } */
            if (!context.id) { throw new Error('You are not authenticated!') }
            return user.findOne({ _id: context.id })
                .then((roleInfo) => {
                    console.log(roleInfo)
                    logger(info.parentType, info.fieldName, args, context)
                    return roleInfo
                })
        },
        async User(parent, args, context, info) {
            /*    if (!await checkPermissions(info.parentType, info.fieldName, args, context)) {
                   return new Error('You have not permission for this action')
               } */
            return user.findOne({ email: args.email })
                .then((roleInfo) => {
                    logger(info.parentType, info.fieldName, args, context)
                    return roleInfo
                })
        },
        async myRole(parent, args, context, info) {
            /*  if (!await checkPermissions(info.parentType, info.fieldName, args, context)) {
                 return new Error('You have not permission for this action')
             } */
            return role.findOne({ _id: context.role })
                .then((roleInfo) => {

                    return roleInfo
                })
        },
        async allRoles(parent, args, context, info) {
            if (!await checkPermissions(info.parentType, info.fieldName, args, context)) {
                return new Error('You have not permission for this action')
            }
            return role.find({})
        }
    },
    Mutation: {
        async signup(_, args, context, info) {
            logger(info.parentType, info.fieldName, args, { email: args.email }, "registration of a new user")
            return user.findOne({ email: args.email }).then((existing) => {
                if (existing) {
                    return new Error('User with this email already exist');
                }

                return bcrypt.hash(args.password, 10).then((hash) => {
                    const newUser = new user({
                        name: args.name,
                        surname: args.surname,
                        email: args.email,
                        password: hash
                    });

                    // return json web token
                    return newUser.save().then((userinfo) => {
                        const token = jwt.sign(
                            { id: userinfo.id, email: userinfo.email, role: userinfo.role },
                            process.env.JWT_SECRET,
                            { expiresIn: '1y' }
                        );
                        return { jwt: token };
                    });
                })
            })
        },

        async login(_, args, context, info) {
            return user.findOne({ email: args.email }).then(userinfo => {
                logger(info.parentType, info.fieldName, args, context)
                if (!userinfo) {
                    return new Error("User with this email is not exist");
                }
                return bcrypt.compare(args.password, userinfo.password).then(valid => {
                    if (!valid) {
                        return new Error("Invalid password");
                    }
                    const token = jwt.sign(
                        { id: userinfo.id, email: userinfo.email, role: userinfo.role },
                        process.env.JWT_SECRET,
                        { expiresIn: "1d" }
                    );
                    return { jwt: token };
                });
            });
        },
        async changeRole(_, args, context, info) {
                if (!await checkPermissions(info.parentType, info.fieldName, args, context)) {
                     return new Error('You have not permission for this action')
                 } 
            return user.updateOne({ _id: args.user }, { role: args.role }).then(el => {
                logger(info.parentType, info.fieldName, args, context, `${args.name} role changed`)
                let updatedUser = user.findOne({ _id: args.user })
                pubsub.publish('Role changed', { UsersRoleChanged: updatedUser })
                return updatedUser
            })
        },
        async deleteUser(_, args, context, info) {
               if (!await checkPermissions(info.parentType, info.fieldName, args, context)) {
                  return new Error('You have not permission for this action')
              } 
            user.deleteOne({ _id: args.id }).then(s =>
                logger(info.parentType, info.fieldName, args, context, `User ${args.name} deleted`)
            )
            return user.find({})
        },
        async addRole(_, args, context, info) {
                   if (!await checkPermissions(info.parentType, info.fieldName, args, context)) {
                      return new Error('You have not permission for this action')
                  } 
            const newRole = new role({
                name: args.name,
                queries: args.queries,
                mutations: args.mutations,
                subscriptions: args.subscriptions,
            })
            return newRole.save().then((roleInfo) => {
                logger(info.parentType, info.fieldName, args, context, `Added role: ${args.name}`)
                pubsub.publish('Role added', { roleAdded: role.find({}) })
                return roleInfo
            })
        },
        async deleteRole(_, args, context, info) {
                if (!await checkPermissions(info.parentType, info.fieldName, args, context)) {
                    return new Error('You have not permission for this action')
                } 
            role.deleteOne({ _id: args.role }).then(s => {
                logger(info.parentType, info.fieldName, args, context, `Role ${args.name} deleted`)
            })
            let listOfRoles = role.find({})
            pubsub.publish('Role deleted', { roleDeleted: listOfRoles })
            return listOfRoles
        },
        async deleteOperation(_, args, context, info) {
            if (!await checkPermissions(info.parentType, info.fieldName, args, context)) {
                return new Error('You have not permission for this action')
            }
            return role.findOneAndUpdate(
                { _id: args.role },
                { $pull: { [args.type]: args.operation } },
                { new: true }
            ).then(updetedRole => {
                logger(info.parentType, info.fieldName, args, context, `${args.operation} in ${args.type} of role:${args.role} deleted`)
                pubsub.publish('Operation deleted', { operationDeleted: updetedRole })
                return updetedRole
            })

        },
        async addOperation(_, args, context, info) {
            if (!await checkPermissions(info.parentType, info.fieldName, args, context)) {
                return new Error('You have not permission for this action')
            }
            return role.findOneAndUpdate(
                { _id: args.role },
                { $push: { [args.type]: args.operation } },
                { new: true }
            ).then(updetedRole => {

                logger(info.parentType, info.fieldName, args, context, `${args.operation} in ${args.type} of role:${args.role} added`)
                pubsub.publish('Operation added', { operationAdded: updetedRole })
                return updetedRole
            })
        }
    },
    Subscription: {
        UsersRoleChanged: {
            subscribe: (parent, args) =>
                pubsub.asyncIterator('Role changed')

        },
        roleAdded: {
            subscribe: (parent, args) =>
                pubsub.asyncIterator('Role added')

        },
        roleDeleted: {
            subscribe: (parent, args) =>
                pubsub.asyncIterator('Role deleted')

        },
        operationDeleted: {
            subscribe: (parent, args) =>
                pubsub.asyncIterator('Operation deleted')

        },
        operationAdded: {
            subscribe: (parent, args) =>
                pubsub.asyncIterator('Operation added')

        }
    }

}

export default resolvers
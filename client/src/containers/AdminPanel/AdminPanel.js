import React from 'react'
// import classes from './AdminPanel.module.css';
import RolesTable from '../../components/RolesTable/RolesTable';
import gql from 'graphql-tag';
import { loader } from 'graphql.macro'
import { useQuery } from '@apollo/react-hooks';

const SCHEMA_QUERY = gql`${loader('../../gql/Queries/schema_QUERY.gql')}`
const ALLROLES_QUERY = gql`${loader('../../gql/Queries/allRoles_QUERY.gql')}`
const ADDOPERATION_SUBSCRIPTION = gql`${loader('../../gql/Subscriptions/addOperation_SUBSCRIPTION.gql')}`
const DELETEOPERATION_SUBSCRIPTION = gql`${loader('../../gql/Subscriptions/deleteOperation_SUBSCRIPTION.gql')}`
const ADDROLE_SUBSCRIPTION = gql`${loader('../../gql/Subscriptions/addRole_SUBSCRIPTION.gql')}`
const DELROLE_SUBSCRIPTION = gql`${loader('../../gql/Subscriptions/deleteRole_SUBSCRIPTION.gql')}`

const AdminPanel = () => {
    let namesOfQueries = []
    let namesOfMutation = []
    let namesOfSubscription = []

    const { loading, data } = useQuery(SCHEMA_QUERY);

    if (!loading) {
        const { mutationType, queryType, subscriptionType } = data.__schema

        namesOfQueries = queryType.fields.map(field => field.name)
        namesOfMutation = mutationType.fields.map(field => field.name)
        namesOfSubscription = subscriptionType.fields.map(field => field.name)
    }

    const subTo = (subName, updQuery) => {
        subscribeToMore({
            document: subName,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;
                return updQuery(prev, subscriptionData)

            }
        })
    }
    // const operationChanged
    const operationADD = (prev, subscriptionData) => {
        const roleUpd = subscriptionData.data.operationAdded;
        const newRolesList = prev.allRoles.map(role => {
            return role.id === roleUpd.id ? roleUpd : role
        })
        return Object.assign({}, prev, {
            allRoles: newRolesList
        })
    }
    const operationDEL = (prev, subscriptionData) => {
        const roleUpd = subscriptionData.data.operationDeleted;
        const newRolesList = prev.allRoles.map(role => {
            return role.id === roleUpd.id ? roleUpd : role
        })
        return Object.assign({}, prev, {
            allRoles: newRolesList
        })
    }
    const roleADD = (prev, subscriptionData) => {
        return Object.assign({}, prev, {
            allRoles: subscriptionData.data.roleAdded
        })
    }
    const roleDEL = (prev, subscriptionData) => {
        return Object.assign({}, prev, {
            allRoles: subscriptionData.data.roleDeleted
        })
    }

    const { subscribeToMore, ...result } = useQuery(ALLROLES_QUERY, operationADD);
    const operations = {
        Queries: namesOfQueries,
        Mutations: namesOfMutation,
        Subscriptions: namesOfSubscription
    }
    return (
        <div>
            <RolesTable
                {...result}
                operations={operations}
                subToAddingOperation={() => subTo(ADDOPERATION_SUBSCRIPTION, operationADD)}
                subToDeletingOperation={() => subTo(DELETEOPERATION_SUBSCRIPTION, operationDEL)}
                subToAddingRole={() => subTo(ADDROLE_SUBSCRIPTION, roleADD)}
                subToDeletingRole={() => subTo(DELROLE_SUBSCRIPTION, roleDEL)}
            >

            </RolesTable>
        </div>
    )
}

export default AdminPanel

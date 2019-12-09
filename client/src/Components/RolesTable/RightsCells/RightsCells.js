import React from 'react'
import { Icon, Table } from 'semantic-ui-react'
import gql from 'graphql-tag';
import { loader } from 'graphql.macro'
import { useMutation } from '@apollo/react-hooks';

const ADDOPERATION = gql`${loader('../../../gql/Mutations/addOperation_MUTATION.gql')}`
const DELOPERATION = gql`${loader('../../../gql/Mutations/deleteOperation_MUTATION.gql')}`
const RightsCells = (props) => {

    const [addOperation] = useMutation(ADDOPERATION, {
        onError: (error) => { props.setMessage(true, error.message) }
    });

    const [deleteOperation] = useMutation(DELOPERATION, {
        onError: (error) => { props.setMessage(true, error.message) }
    });
    const sendData = (role, operation) => {

        return whatType(role).indexOf(operation) === -1
            ?
            addOperation(
                {
                    variables: {
                        role: role.id,
                        type: props.typeName.toLowerCase(),
                        operation: operation
                    }

                })
            :
            deleteOperation(
                {
                    variables: {
                        role: role.id,
                        type: props.typeName.toLowerCase(),
                        operation: operation
                    }

                })
    }


    const whatType = (role) => {
        switch (props.typeName) {
            case 'Queries':
                return role.queries

            case 'Mutations':
                return role.mutations

            case 'Subscriptions':
                return role.subscriptions
            default:
                throw new Error('You must provide queries/mutations/subscriptions')
        }
    }
    return (
        <React.Fragment >
            <Table.Row >
                <Table.Cell
                    rowSpan={props.type.length + 1}
                    textAlign='center'
                >{props.typeName}</Table.Cell>
            </Table.Row>
            {props.type.map((operation, index) => {
                return (
                    <Table.Row key={index}>
                        <Table.Cell>{operation}</Table.Cell>
                        {
                            props.roleRights.map((role, index) => {

                                return <Table.Cell
                                    textAlign='center'
                                    key={index}
                                    onClick={() => sendData(role, operation)}
                                >
                                    <Icon
                                        color={whatType(role).indexOf(operation) !== -1 ? 'green' : 'red'}
                                        name={whatType(role).indexOf(operation) !== -1 ? 'checkmark' : 'close'}
                                        size='large'
                                    />
                                </Table.Cell>
                            })
                        }
                    </Table.Row>
                )
            })}

        </React.Fragment>
    )
}

export default RightsCells

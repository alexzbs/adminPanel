import React, { Component, Fragment } from 'react'
import { Form } from 'semantic-ui-react'
import gql from 'graphql-tag';
import { loader } from 'graphql.macro'
import { useApolloClient, useMutation, useQuery } from '@apollo/react-hooks';
import MessageWindow from '../UI/MessageWindow/MessageWindow'

const LOGIN = gql`${loader('../../gql/Mutations/login_MUTATION.gql')}`
const ISLOGGEDIN = gql`${loader('../../gql/Queries/isLoggedIn_QUERY.gql')}`

const Login = props => {
    const { data: userStatus } = useQuery(ISLOGGEDIN);

    const client = useApolloClient();

    const [login, { loading, error, data }] = useMutation(LOGIN, {
        onCompleted: (data) => {
            localStorage.setItem('jwt', data.login.jwt);
            client.writeData({ data: { isLoggedIn: true } });
            props.setMessage('success')
            props.resetValuesForm()
        },
        onError: (error) => { props.setMessage('error', error.message) },
    });

    const onChange = (event, controlName) => {
        props.handleChange(event, controlName)
    }

    const onSubmit = (e, login) => {
        props.resetMessage()
        e.preventDefault();

        const formControls = props.formControls
        login({
            variables: {
                email: formControls.email.value,
                password: formControls.password.value
            }
        })
    }

    const renderInputs = () => {
        return Object.keys(props.formControls).map((controlName, index) => {
            const control = props.formControls[controlName];
            return (
                <Form.Input
                    fluid
                    type={control.type}
                    key={controlName + index}
                    value={control.value}
                    required={control.required}
                    label={control.label}
                    placeholder={control.placeholder}
                    onChange={event => onChange(event, controlName)}
                // valid={control.valid}
                // touched={control.touched}
                // label={control.label}
                // shouldValidate={!!control.validation}
                // errorMessage={control.errorMessage}
                />
            );
        });
    }

    return (

        <Fragment>
            {
                userStatus.isLoggedIn ?
                    <p>logged IN</p> :
                    <Form
                        success={props.message.success && !!data}
                        error={error && !props.success}
                        onSubmit={(e) => onSubmit(e, login)}
                    >
                        {renderInputs()}
                        <Form.Button>Submit</Form.Button>
                        <MessageWindow
                            error={!props.message.success}
                            success={props.message.success}
                            content={props.message.messageText}
                        />

                    </Form>
            }
        </Fragment>
    );
}

export default Login
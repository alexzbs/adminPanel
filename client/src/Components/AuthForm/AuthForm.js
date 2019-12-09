import React, { Fragment } from 'react'
import { Form } from 'semantic-ui-react'
import gql from 'graphql-tag';
import { loader } from 'graphql.macro'
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import MessageWindow from '../UI/MessageWindow/MessageWindow'

const SIGNUP = gql`${loader('../../gql/Mutations/signUp_MUTATION.gql')}`
const LOGIN = gql`${loader('../../gql/Mutations/login_MUTATION.gql')}`

const AuthForm = props => {
    const client = useApolloClient();

    const [auth, { error, data }] = useMutation(
        props.type === 'login' ? LOGIN : SIGNUP,
        {
            onCompleted: (data) => {
                localStorage.setItem('jwt', data[props.type].jwt);
                props.setMessage('success')
                props.resetValuesForm()
                to(true, '/roles')
                client.writeData({ data: { isLoggedIn: true } });
            },
            onError: (error) => { props.setMessage('error', error.message) },
        });

    function to(status, path) {
        props.redirectHandler(status, path)
    }

    const onChange = (event, controlName) => {
        props.handleChange(event, controlName)
    }

    const onSubmit = (e, auth) => {
        props.resetMessage()
        e.preventDefault();

        const formControls = props.formControls
        auth({
            variables: {
                name: formControls.name.value,
                surname: formControls.surname.value,
                email: formControls.email.value,
                password: formControls.password.value
            }
        })
    }

    const renderInputs = () => {
        return Object.keys(props.formControls).map((controlName, index) => {
            const control = props.formControls[controlName];
            if (props.type === 'login' && !['email', 'password'].includes(controlName)) {
                return null
            }
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
            <Form
                success={props.message.success && !!data}
                error={error && !props.success}
                onSubmit={(e) => onSubmit(e, auth)}
            >
                {renderInputs()}
                <Form.Button>Submit</Form.Button>
                <MessageWindow
                    error={!props.message.success}
                    success={props.message.success}
                    content={props.message.messageText}
                />

            </Form>

        </Fragment>
    );
}

export default AuthForm
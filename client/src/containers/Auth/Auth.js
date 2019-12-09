import React, { Component } from 'react'
import classes from './Auth.module.css'
import AuthForm from '../../components/AuthForm/AuthForm'
import { Header } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
class Auth extends Component {
    constructor(props) {
        super(props)
        this.state = {
            redirect: { status: false, path: '/' },
            formControls: {
                name: {
                    value: "",
                    type: "text",
                    label: "First name",
                    errorMessage: "Введите корректный First name",
                    required: true,
                    /*                 valid: false,
                                    touched: false,
                                    validation: {
                                        required: true,
                                        email: true
                                    } */
                },
                surname: {
                    value: "",
                    type: "text",
                    label: "Last name",
                    errorMessage: "Введите корректный Last name",
                    required: true,
                    /*                 valid: false,
                                    touched: false,
                                    validation: {
                                        required: true,
                                        email: true
                                    } */
                },
                email: {
                    value: "",
                    type: "email",
                    label: "Email",
                    errorMessage: "Введите корректный email",
                    required: true,
                    /*                 valid: false,
                                    touched: false,
                                    validation: {
                                        required: true,
                                        email: true
                                    } */
                },
                password: {
                    value: "",
                    type: "password",
                    label: "Password",
                    errorMessage: "Введите корректный пароль",
                    required: true,
                    /*                 valid: false,
                                    touched: false,
                                    validation: {
                                        required: true,
                                        minLength: 6
                                    } */
                }
            },
            message: {
                success: true,
                messageText: ''
            }
        }
    }

    redirectHandler = (status, path) => {
        this.setState({ redirect: { status, path } })
    }

    handleChange = (event, controlName) => {
        const formControls = { ...this.state.formControls };
        const control = { ...formControls[controlName] };

        control.value = event.target.value;
        // control.touched = true;
        // control.valid = this.validateControl(control.value, control.validation);

        formControls[controlName] = control;

        // let isFormValid = true;
        // Object.keys(formControls).forEach(name => {
        //     isFormValid = formControls[name].valid && isFormValid;
        // });
        this.setState({ formControls });
    };

    setMessage = (result, text) => {
        this.setState({
            message:
            {
                //Нужна регулярка которая при ошибке отрезает "GraphQL Error:"
                success: result === 'success' ? true : false,
                messageText: result === 'success' ? "You have been successfully signed up" : text
            }
        })
    }

    resetValuesForm = () => {
        const formControls = this.state.formControls
        this.setState({
            formControls: {
                name: { ...formControls.name, value: '' },
                surname: { ...formControls.surname, value: '' },
                email: { ...formControls.email, value: '' },
                password: { ...formControls.password, value: '' },
            }
        })
    }

    resetMessage = () => {
        this.setState({
            message: {
                ...this.state.message,
                messageText: ''
            },
        })
    }

    render() {
        const type = typeof this.props.location.state !== 'undefined'
            ? this.props.location.state.type
            : 'login'

        // console.log(this.state.redirect)
        return (
            this.state.redirect.status ?
                <Redirect to={{ pathname: this.state.redirect.path }} />
                :
                <div className={classes.Auth}>
                    <Header as='h1'>{type === 'signup' ? 'Registration ' : 'Login '}{' '}form</Header>
                    <AuthForm
                        {...this.state}
                        type={type}
                        handleChange={this.handleChange}
                        resetValuesForm={this.resetValuesForm}
                        setMessage={this.setMessage}
                        resetMessage={this.resetMessage}
                        redirectHandler={this.redirectHandler}
                    />
                </div>

        )
    }
}

export default Auth

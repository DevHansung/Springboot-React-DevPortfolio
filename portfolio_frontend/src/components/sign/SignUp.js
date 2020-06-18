import React, { Component } from 'react';
import { signup, checkUsernameAvailability, checkEmailAvailability } from '../../controller/APIUserController';
import {
    NAME_MIN_LENGTH, NAME_MAX_LENGTH,
    USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH, EMAIL_MAX_LENGTH,
    PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH
} from '../../constants/Property';
import { MdArrowForward, MdVisibility } from 'react-icons/md';
import { FcOk, FcCancel } from 'react-icons/fc';
import { withRouter } from "react-router-dom"


class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: {
                value: ''
            },
            username: {
                value: ''
            },
            email: {
                value: ''
            },
            password: {
                value: ''
            },
            checkPassword: {
                value: ''
            }
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateUsernameAvailability = this.validateUsernameAvailability.bind(this);
        this.validateEmailAvailability = this.validateEmailAvailability.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
    }

    handleInputChange(event, validationFun) {
        const target = event.target;
        const inputName = target.name;
        const inputValue = target.value;

        this.setState({
            [inputName]: {
                value: inputValue,
                ...validationFun(inputValue)
            }
        });
    }

    handlePasswordCheck(event, validationFun) {
        const target = event.target;
        const inputName = target.name;
        const inputValue = target.value;

        this.setState({
            [inputName]: {
                value: inputValue,
                ...validationFun(this.state.password.value, inputValue)
            }
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        const signupRequest = {
            name: this.state.name.value,
            email: this.state.email.value,
            username: this.state.username.value,
            password: this.state.password.value
        };
        signup(signupRequest)
            .then(response => {
                this.props.signState()
                //this.props.history.push("/");
            }).catch(error => {
            });
    }

    isFormInvalid() {
        return !(this.state.name.validateStatus === 'success' &&
            this.state.username.validateStatus === 'success' &&
            this.state.email.validateStatus === 'success' &&
            this.state.password.validateStatus === 'success' &&
            this.state.checkPassword.validateStatus === 'success'
        );
    }

    render() {
        return (
            <div>
                <div>
                    <div className="Input"
                        label="Full Name"
                        help={this.state.name.errorMsg}>
                        <input
                            size="large"
                            name="name"
                            type="text"
                            autoComplete="off"
                            placeholder="Your full real name"
                            value={this.state.name.value}
                            onChange={(event) => this.handleInputChange(event, this.validateName)} />
                        {this.state.name.value === '' ? null : this.state.name.validateStatus === 'error'
                            ? <FcCancel className='iconVisibility' />
                            : <FcOk className='iconVisibility' />}
                    </div>
                    <div className="signUp-err-msg">{this.state.name.validateStatus === 'error' ? this.state.name.errorMsg : null}</div>
                </div>
                <div>
                    <div className="Input"
                        label="Username"
                        help={this.state.username.errorMsg}>
                        <input
                            size="large"
                            name="username"
                            type="text"
                            autoComplete="off"
                            placeholder="Your unique username"
                            value={this.state.username.value}
                            onBlur={this.validateUsernameAvailability}
                            onChange={(event) => this.handleInputChange(event, this.validateUsername)} />
                        {this.state.username.value === '' ? null : this.state.username.validateStatus === 'error'
                            ? <FcCancel className='iconVisibility' />
                            : <FcOk className='iconVisibility' />}
                    </div>
                    <div className="signUp-err-msg">{this.state.username.validateStatus === 'error' ? this.state.username.errorMsg : null}</div>
                </div>
                <div>
                    <div className="Input"
                        label="Email"
                        help={this.state.email.errorMsg}>
                        <input
                            size="large"
                            name="email"
                            type="email"
                            autoComplete="off"
                            placeholder="Your unique email"
                            value={this.state.email.value}
                            onBlur={this.validateEmailAvailability}
                            onChange={(event) => this.handleInputChange(event, this.validateEmail)} />
                        {this.state.email.value === '' ? null : this.state.email.validateStatus === 'error'
                            ? <FcCancel className='iconVisibility' />
                            : <FcOk className='iconVisibility' />}
                    </div>
                    <div className="signUp-err-msg">{this.state.email.validateStatus === 'error' ? this.state.email.errorMsg : null}</div>
                </div>
                <div>
                    <div className="Input"
                        label="Password"
                        help={this.state.password.errorMsg}>
                        <input
                            size="large"
                            name="password"
                            type="password"
                            autoComplete="off"
                            placeholder="password(문자+특수문자, 8~15글자)"
                            value={this.state.password.value}
                            onChange={(event) => this.handleInputChange(event, this.validatePassword)} />
                        {this.state.password.value === '' ? <MdVisibility className='iconVisibility' />
                            : this.state.password.validateStatus === 'error'
                                ? <FcCancel className='iconVisibility' />
                                : <FcOk className='iconVisibility' />}
                    </div>
                    <div className="signUp-err-msg">{this.state.password.validateStatus === 'error' ? this.state.password.errorMsg : null}</div>
                </div>
                <div>
                    <div className="Input"
                        label="CheckPassword"
                        help={this.state.checkPassword.errorMsg}>
                        <input
                            size="large"
                            name="checkPassword"
                            type="password"
                            autoComplete="off"
                            placeholder="password check"
                            value={this.state.checkPassword.value}
                            onChange={(event) => this.handlePasswordCheck(event, this.validateCheckPassword)} />
                        {this.state.checkPassword.value === '' ? <MdVisibility className='iconVisibility' />
                            : this.state.checkPassword.validateStatus !== 'success'
                                ? <FcCancel className='iconVisibility' />
                                : <FcOk className='iconVisibility' />}
                    </div>
                    <div className="signUp-err-msg">{this.state.checkPassword.validateStatus === 'error' ? this.state.checkPassword.errorMsg : null}</div>
                </div>
                <div>
                    <button className="submitSignUp" onClick={this.handleSubmit} disabled={this.isFormInvalid()}><MdArrowForward /></button>
                </div>
            </div>
        );
    }

    validateName = (name) => {
        if (name.length < NAME_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `너무 짧습니다. 최소 ${NAME_MIN_LENGTH} 글자 이상 입력해주세요.`
            }
        } else if (name.length > NAME_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `너무 깁니다. 최대 ${NAME_MAX_LENGTH} 글자 이하로 입력해주세요.`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
            };
        }
    }

    validateEmail = (email) => {
        if (!email) {
            return {
                validateStatus: 'error',
                errorMsg: 'Email는 비워둘 수 없습니다.'
            }
        }

        const EMAIL_REGEX = RegExp('[^@ ]+@[^@ ]+\\.[^@ ]+');
        if (!EMAIL_REGEX.test(email)) {
            return {
                validateStatus: 'error',
                errorMsg: '유효한 Email이 아닙니다.'
            }
        }

        if (email.length > EMAIL_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `너무 깁니다. 최대 (Maximum ${EMAIL_MAX_LENGTH} 이하로 입력해주세요.`
            }
        }

        return {
            validateStatus: null,
            errorMsg: null
        }
    }

    validateUsername = (username) => {
        if (!username) {
            return {
                validateStatus: 'error',
                errorMsg: 'username은 비워둘 수 없습니다.'
            }
        }
        if (username.length < USERNAME_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `너무 짧습니다. 최소 ${USERNAME_MIN_LENGTH} 글자 이상 입력해주세요.`
            }
        } else if (username.length > USERNAME_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `너무 깁니다. 최대 ${USERNAME_MAX_LENGTH} 글자 이하로 입력해주세요.`
            }
        } else {
            return {
                validateStatus: null,
                errorMsg: null
            }
        }
    }

    validateUsernameAvailability() {
        const usernameValue = this.state.username.value;
        const usernameValidation = this.validateUsername(usernameValue);

        if (usernameValidation.validateStatus === 'error') {
            this.setState({
                username: {
                    value: usernameValue,
                    ...usernameValidation
                }
            });
            return;
        }

        this.setState({
            username: {
                value: usernameValue,
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        checkUsernameAvailability(usernameValue)
            .then(response => {
                if (response.available) {
                    this.setState({
                        username: {
                            value: usernameValue,
                            validateStatus: 'success',
                            errorMsg: null
                        }
                    });
                } else {
                    this.setState({
                        username: {
                            value: usernameValue,
                            validateStatus: 'error',
                            errorMsg: '이미 존재하는 Username 입니다.'
                        }
                    });
                }
            }).catch(error => {
                this.setState({
                    username: {
                        value: usernameValue,
                        validateStatus: 'success',
                        errorMsg: null
                    }
                });
            });
    }

    validateEmailAvailability() {
        const emailValue = this.state.email.value;
        const emailValidation = this.validateEmail(emailValue);

        if (emailValidation.validateStatus === 'error') {
            this.setState({
                email: {
                    value: emailValue,
                    ...emailValidation
                }
            });
            return;
        }

        this.setState({
            email: {
                value: emailValue,
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        checkEmailAvailability(emailValue)
            .then(response => {
                if (response.available) {
                    this.setState({
                        email: {
                            value: emailValue,
                            validateStatus: 'success',
                            errorMsg: null
                        }
                    });
                } else {
                    this.setState({
                        email: {
                            value: emailValue,
                            validateStatus: 'error',
                            errorMsg: '이미 존재하는 Email 입니다. '
                        }
                    });
                }
            }).catch(error => {
                this.setState({
                    email: {
                        value: emailValue,
                        validateStatus: 'success',
                        errorMsg: null
                    }
                });
            });
    }

    validatePassword = (password) => {
        if (!password) {
            return {
                validateStatus: 'error',
                errorMsg: 'Password는 비워둘 수 없습니다.'
            }
        }
        const PASSWORD_REGEX = RegExp('^.*(?=^.{8,15}$)(?=.*)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$');
        if (!PASSWORD_REGEX.test(password)) {
            return {
                validateStatus: 'error',
                errorMsg: '문자와 특수문자가 포함되어야 합니다.'
            }
        }
        if (password.length < PASSWORD_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `너무 짧습니다. 최소 ${PASSWORD_MIN_LENGTH} 글자 이상 입력해주세요.`
            }
        } else if (password.length > PASSWORD_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `너무 깁니다. 최대 ${PASSWORD_MAX_LENGTH} 글자 이하로 입력해주세요.`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
            };
        }
    }

    validateCheckPassword = (password, checkPassword) => {
        if (!checkPassword) {
            return {
                validateStatus: 'error',
                errorMsg: 'PasswordCheck는 비워둘 수 없습니다.'
            }
        }
        if (password.length > PASSWORD_MIN_LENGTH
            && password.length < PASSWORD_MAX_LENGTH
            && password === checkPassword) {
            return {
                validateStatus: 'success',
                errorMsg: null
            }
        } else if (password !== checkPassword) {
            return {
                validateStatus: 'error',
                errorMsg: `비밀번호가 일치하지 않습니다.`
            }
        }
    }
}

export default withRouter(Signup);
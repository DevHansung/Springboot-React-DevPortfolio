import React, { Component } from 'react';
import { MdArrowForward } from 'react-icons/md';
import { login } from '../../controller/APIUserController';
import {
    ACCESS_TOKEN, REFRESH_TOKEN,
    USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH,
    PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH
} from '../../constants/Property';
import { MdVisibility } from 'react-icons/md';
import { withRouter } from "react-router-dom";
import { message } from 'antd';

class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: {
                value: ''
            },
            password: {
                value: ''
            },
            isLoginError: false
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const inputName = target.name;
        const inputValue = target.value;

        this.setState({
            [inputName]: {
                value: inputValue
            }
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        const signinRequest = {
            username: this.state.username.value,
            password: this.state.password.value
        };
        login(signinRequest)
            .then(response => {
                sessionStorage.setItem(ACCESS_TOKEN, response.accessToken);
                sessionStorage.setItem(REFRESH_TOKEN, response.refreshToken);
                this.props.onLogin()
                this.props.history.push("/");
            }).catch(error => {
                if (error.status === 401) {
                    message.error("아이디 혹은 비밀번호가 일치하지 않습니다. 다시 시도해주세요.");
                    this.setState({
                        isLoginError: true
                    })
                } else {
                    message.error("아이디 혹은 비밀번호가 일치하지 않습니다. 다시 시도해주세요.");
                }
            });
    }

    render() {
        return (
            <div >
                <div className="Input">
                    <input
                        size="large"
                        name="username"
                        type="text"
                        autoComplete="off"
                        placeholder="username"
                        value={this.state.username.value}
                        onChange={(event) => this.handleInputChange(event)} />
                </div>

                <div className="Input">
                    <input
                        size="large"
                        name="password"
                        type="password"
                        autoComplete="off"
                        placeholder="password"
                        value={this.state.password.value}
                        onChange={(event) => this.handleInputChange(event)} />
                    <MdVisibility className='iconVisibility' />
                </div>
                <p className="signIn-err-msg"> {this.state.isLoginError === true ? 'username 혹은 password가 일치하지 않습니다.' : null} </p>
                <div>
                    <button onClick={this.handleSubmit} className="submitSignIn"><MdArrowForward /></button>
                </div>
            </div>
        );
    }


    validateUsername = (username) => {
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
    validatePassword = (password) => {
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
}
export default withRouter(SignIn);
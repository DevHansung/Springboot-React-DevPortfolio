import React, { Component } from 'react';
import { Form, Button, Input, message } from 'antd';
import { loadInformationById, editInformation } from '../../controller/APIController';
import { withRouter } from "react-router-dom";
import { TEXT_MIN_LENGTH, TEXT_MAX_LENGTH } from '../../constants/Property';

const { TextArea } = Input;
class InformationUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: {
                value: ''
            },
            summary: {
                value: ''
            },
            text: {
                value: ''
            },
            name: {
                value: ''
            },
            email: {
                value: ''
            },
            github: {
                value: ''
            }
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.onEditInformation = this.onEditInformation.bind(this);
    }

    handleInputChange(event, validateInput) {
        const target = event.target;
        const inputName = target.name;
        const inputValue = target.value;

        this.setState({
            [inputName]: {
                value: inputValue,
                ...validateInput(inputValue)
            }
        });
    }

    componentDidMount() {
        this.loadInformationById();
    }

    loadInformationById() {
        loadInformationById(this.props.infoId)
            .then((res) => {
                this.setState({
                    title: {
                        value: res.title
                    },
                    summary: {
                        value: res.summary
                    },
                    text: {
                        value: res.text
                    },
                    name: {
                        value: res.name
                    },
                    email: {
                        value: res.email
                    },
                    github: {
                        value: res.github
                    }
                })
            }).catch((error) => {
                console.log(error.message)
            })
    }

    onEditInformation() {
        try {
            editInformation(this.props.infoId, this.state.title.value, this.state.summary.value, this.state.text.value, 
                this.state.name.value, this.state.email.value, this.state.github.value)
                .then((res) => {
                    message.success('업로드가 완료 되었습니다.');
                    this.props.onHandleOk(this.props.infoId);
                })
        } catch (error) {
            message.error('처리 도중 문제가 발생하였습니다.');
        }
    }
    
    validateInput = (input) => {
        if (input.length < TEXT_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `너무 짧습니다. 최소 ${TEXT_MIN_LENGTH} 글자 이상 입력해주세요.`
            }
        } else if (input.length > TEXT_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `너무 깁니다. 최대 ${TEXT_MAX_LENGTH} 글자 이하로 입력해주세요.`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
            };
        }
    }

    isFormInvalid() {
        return !(this.state.title.validateStatus === 'success' &&
            this.state.name.validateStatus === 'success' &&
            this.state.email.validateStatus === 'success' &&
            this.state.github.validateStatus === 'success' &&
            this.state.text.validateStatus === 'success' &&
            this.state.summary.validateStatus === 'success'
        );
    }

    render() {
        return (
            <div className="upload-container">
                <Form>
                    <Form.Item label="Main Title">
                        <Input type="text" name="title" size="small" placeholder="Title"
                            className="input-form" value={this.state.title.value} autoComplete="off"
                            onChange={(event) => this.handleInputChange(event, this.validateInput)} />
                        <div className="input-err-msg">{this.state.title.validateStatus === 'error'
                            ? this.state.title.errorMsg : null}</div>
                    </Form.Item>
                    <Form.Item label="Name">
                        <Input type="text" name="name" size="small" placeholder="Name"
                            className="input-form" value={this.state.name.value} autoComplete="off"
                            onChange={(event) => this.handleInputChange(event, this.validateInput)} />
                        <div className="input-err-msg"> {this.state.name.validateStatus === 'error'
                            ? this.state.name.errorMsg : null}</div>
                    </Form.Item>
                    <Form.Item label="email">
                        <Input type="text" name="email" size="small" placeholder="Email"
                            className="input-form" value={this.state.email.value} autoComplete="off"
                            onChange={(event) => this.handleInputChange(event, this.validateInput)} />
                        <div className="input-err-msg"> {this.state.email.validateStatus === 'error'
                            ? this.state.email.errorMsg : null}</div>
                    </Form.Item>
                    <Form.Item label="github">
                        <Input type="text" name="github" size="small" placeholder="GitHub"
                            className="input-form" value={this.state.github.value} autoComplete="off"
                            onChange={(event) => this.handleInputChange(event, this.validateInput)} />
                        <div className="input-err-msg"> {this.state.github.validateStatus === 'error'
                            ? this.state.github.errorMsg : null}</div>
                    </Form.Item>
                    <Form.Item label="Text">
                        <TextArea type="text" name="text" size="small" placeholder="Text"
                            value={this.state.text.value}
                            onChange={(event) => this.handleInputChange(event, this.validateInput)} />
                        <div className="input-err-msg"> {this.state.text.validateStatus === 'error'
                            ? this.state.text.errorMsg : null}</div>
                    </Form.Item>
                    <Form.Item label="Tag">
                        <TextArea type="text" name="summary" size="small" placeholder="tag"
                            value={this.state.summary.value}
                            onChange={(event) => this.handleInputChange(event, this.validateInput)} />
                        <div className="input-err-msg"> {this.state.summary.validateStatus === 'error'
                            ? this.state.summary.errorMsg : null}</div>
                    </Form.Item>

                    <Form.Item>
                        <Button onClick={this.onEditInformation} disabled={this.isFormInvalid()} type="primary" className="uploadAddButton" size="large" htmlType="submit">Save</Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

export default withRouter(InformationUpload);
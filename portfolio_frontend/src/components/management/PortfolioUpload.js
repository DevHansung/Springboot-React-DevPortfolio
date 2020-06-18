import React, { Component } from 'react';
import { Form, Button, Input, Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { uploadPortfolio } from '../../controller/APIController';
import { withRouter } from "react-router-dom";
import { TEXT_MIN_LENGTH, TEXT_MAX_LENGTH } from '../../constants/Property';

const { Dragger } = Upload;
const { TextArea } = Input;
class PortfolioUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: {
                value: ''
            },
            summary: {
                value: ''
            },
            period: {
                value: ''
            },
            technology: {
                value: ''
            },
            github: {
                value: ''
            },
            fileList: []
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.onUploadPortfolio = this.onUploadPortfolio.bind(this);
        this.onChange = this.onChange.bind(this);
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

    onChange = ({ fileList }) => {
        fileList = fileList.slice(-1);
        this.setState({ fileList })
    }

    onUploadPortfolio() {
        try {
            uploadPortfolio(this.props.username, this.state.title.value, this.state.summary.value,
                this.state.period.value, this.state.technology.value, this.state.github.value, this.state.fileList[0].originFileObj)
                .then(() => {
                    this.setState({
                        title: {
                            value: ''
                        },
                        summary: {
                            value: ''
                        },
                        period: {
                            value: ''
                        },
                        technology: {
                            value: ''
                        },
                        github: {
                            value: ''
                        },
                        fileList: []
                    });
                    message.success('업로드가 완료 되었습니다.');
                    this.props.onSubmit("portfolio");
                }).catch((error) => {
                    message.error(error.message);
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
            this.state.period.validateStatus === 'success' &&
            this.state.summary.validateStatus === 'success' &&
            this.state.technology.validateStatus === 'success'
        );
    }

    render() {
        return (
            <div className="upload-container">
                <Form>
                    <Form.Item label="프로젝트 제목">
                        <Input type="text" name="title" size="large" placeholder="Title" className="input-form"
                            value={this.state.title.value} autoComplete="off"
                            onChange={(event) => this.handleInputChange(event, this.validateInput)} />
                        <div className="input-err-msg">{this.state.title.validateStatus === 'error'
                            ? this.state.title.errorMsg : null}</div>
                    </Form.Item>
                    <Form.Item label="일자">
                        <Input type="text" name="period" size="large" placeholder="Period" className="input-form"
                            value={this.state.period.value} autoComplete="off"
                            onChange={(event) => this.handleInputChange(event, this.validateInput)} />
                        <div className="input-err-msg">{this.state.period.validateStatus === 'error'
                            ? this.state.period.errorMsg : null}</div>
                    </Form.Item>
                    <Form.Item label="설명">
                        <TextArea type="text" name="summary" size="large" placeholder="Summary"
                            value={this.state.summary.value}
                            onChange={(event) => this.handleInputChange(event, this.validateInput)} />
                        <div className="input-err-msg">{this.state.summary.validateStatus === 'error'
                            ? this.state.summary.errorMsg : null}</div>
                    </Form.Item>
                    <Form.Item label="사용기술">
                        <TextArea type="text" name="technology" size="large" placeholder="Technology"
                            value={this.state.technology.value}
                            onChange={(event) => this.handleInputChange(event, this.validateInput)} />
                        <div className="input-err-msg">{this.state.technology.validateStatus === 'error'
                            ? this.state.technology.errorMsg : null}</div>
                    </Form.Item>
                    <Form.Item label="GitHubLink">
                        <Input type="text" name="github" size="large" placeholder="ex) https://xxx.com/" className="input-form"
                            value={this.state.github.value} autoComplete="off"
                            onChange={(event) => this.handleInputChange(event, this.validateInput)} />
                        <div className="input-err-msg">{this.state.github.validateStatus === 'error'
                            ? this.state.github.errorMsg : null}</div>
                    </Form.Item>

                    <Form.Item label="이미지">
                        <Dragger fileList={this.state.fileList} onChange={this.onChange} beforeUpload={() => false} multiple={true}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click or Drag Image File</p>
                            <p className="ant-upload-hint">
                                Image fils only
                                </p>
                        </Dragger>
                    </Form.Item>
                    <Form.Item>
                        <Button onClick={this.onUploadPortfolio} disabled={this.isFormInvalid()} type="primary" className="uploadAddButton" size="large" htmlType="submit">Save</Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

export default withRouter(PortfolioUpload);
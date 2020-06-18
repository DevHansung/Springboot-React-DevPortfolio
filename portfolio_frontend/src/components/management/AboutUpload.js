import React, { Component } from 'react';
import { Form, Button, Input, Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { uploadAbout } from '../../controller/APIController';
import { withRouter } from "react-router-dom";
import { TEXT_MIN_LENGTH, TEXT_MAX_LENGTH } from '../../constants/Property';

const { Dragger } = Upload;
const { TextArea } = Input;
class AboutUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: {
                value: ''
            },
            favorite: {
                value: ''
            },
            fileList: []
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.onUploadAbout = this.onUploadAbout.bind(this);
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

    onUploadAbout() {
        try {
            uploadAbout(this.props.username, this.state.text.value, this.state.favorite.value, this.state.fileList[0].originFileObj)
                .then(() => {
                    this.setState({
                        text: {
                            value: ''
                        },
                        favorite: {
                            value: ''
                        },
                        fileList: []
                    });
                    message.success('업로드가 완료 되었습니다.');
                    this.props.onSubmit("about");
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
        return !(this.state.text.validateStatus === 'success' &&
            this.state.favorite.validateStatus === 'success' 
        );
    }

    render() {
        return (
            <div className="upload-container">
                <Form>
                    <Form.Item label="소개">
                        <TextArea type="text" name="text" size="large" placeholder="Text"
                            value={this.state.text.value}
                            onChange={(event) => this.handleInputChange(event, this.validateInput)} />
                        <div className="input-err-msg">{this.state.text.validateStatus === 'error'
                            ? this.state.text.errorMsg : null}</div>
                    </Form.Item>
                    <Form.Item label="관심분야">
                        <TextArea type="text" name="favorite" size="large" placeholder="Favorite"
                            value={this.state.favorite.value}
                            onChange={(event) => this.handleInputChange(event, this.validateInput)} />
                        <div className="input-err-msg">{this.state.favorite.validateStatus === 'error'
                            ? this.state.favorite.errorMsg : null}</div>
                    </Form.Item>

                    <Form.Item label="이미지">
                        <Dragger fileList={this.state.fileList} onChange={this.onChange} beforeUpload={() => false} multiple={false}>
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
                        <Button onClick={this.onUploadAbout} disabled={this.isFormInvalid()} type="primary" className="uploadAddButton" size="large" htmlType="submit">Save</Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

export default withRouter(AboutUpload);
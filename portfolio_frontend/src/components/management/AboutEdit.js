import React, { Component } from 'react';
import { Form, Button, Input, Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { loadAboutById, editAbout, editAboutImage } from '../../controller/APIController';
import { TEXT_MIN_LENGTH, TEXT_MAX_LENGTH } from '../../constants/Property';

const { Dragger } = Upload;
const { TextArea } = Input;
class PortfolioEdit extends Component {
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
        this.onEditAbout = this.onEditAbout.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        this.loadAboutById();
    }

    loadAboutById() {
        loadAboutById(this.props.aboutId)
            .then((res) => {
                this.setState({
                    text: {
                        value: res.text
                    },
                    favorite: {
                        value: res.favorite
                    }
                })
            }).catch((error) => {
                message.error('처리 도중 문제가 발생하였습니다.');
                console.log(error.message)
            })
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

    onEditAbout() {
        try {
            if (this.state.fileList.length === 0) {
                editAbout(this.props.aboutId, this.state.text.value, this.state.favorite.value)
                    .then((res) => {
                        message.success('요청하신 작업이 완료 되었습니다.');
                        this.props.onHandleOk(this.props.aboutId);
                    })
            }
            else if (this.state.fileList.length !== 0) {
                editAboutImage(this.props.aboutId, this.state.text.value,
                    this.state.favorite.value, this.state.fileList[0].originFileObj)
                    .then((res) => {
                        message.success('요청하신 작업이 완료 되었습니다.');
                        this.props.onHandleOk(this.props.aboutId);
                    })
            }
        } catch (error) {
            message.error('요청 처리중 문제가 발생하였습니다. 다시 시도해주세요.');
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
                        <Button onClick={this.onEditAbout} disabled={this.isFormInvalid()} type="primary" className="uploadAddButton" size="large" htmlType="submit">Save</Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}
export default PortfolioEdit;
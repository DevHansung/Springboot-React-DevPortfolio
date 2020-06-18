import React, { Component } from 'react';
import { Form, Button, Input, Upload, Radio, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { uploadSkill } from '../../controller/APIController';
import { withRouter } from "react-router-dom";
import { TEXT_MIN_LENGTH, TEXT_MAX_LENGTH } from '../../constants/Property';

const { Dragger } = Upload;
class PortfolioUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: {
                value: ''
            },
            categoty: {
                value: 'Language'
            },
            level: {
                value: 'Lv.1'
            },
            fileList: []
        };
        this.onUploadSkill = this.onUploadSkill.bind(this);
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


    handleCategotyChange = (e) => {
        const inputValue = e.target.value;
        this.setState({
            categoty: {
                value: inputValue
            }
        })
    }

    handleLevelChange = (e) => {
        const inputValue = e.target.value;
        this.setState({
            level: {
                value: inputValue
            },
        })
    }

    onChange = ({ fileList }) => {
        fileList = fileList.slice(-1);
        this.setState({ fileList })
    }

    onUploadSkill() {
        try {
            uploadSkill(this.props.username, this.state.title.value, this.state.level.value,
                this.state.categoty.value, this.state.fileList[0].originFileObj)
                .then(() => {
                    this.setState({
                        title: {
                            value: ''
                        },
                        categoty: {
                            value: 'Language'
                        },
                        level: {
                            value: 'Lv.1'
                        },
                        fileList: []
                    });
                    message.success('업로드가 완료 되었습니다.');
                    this.props.onSubmit("skill");
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
        return !(this.state.title.validateStatus === 'success'
        );
    }

    render() {
        return (
            <div className="upload-container">
                <Form>
                    <Form.Item label="Skill name">
                        <Input type="text" name="title" size="large" placeholder="Title" className="input-form"
                            value={this.state.title.value} autoComplete="off"
                            onChange={(event) => this.handleInputChange(event, this.validateInput)} />
                        <div className="input-err-msg">{this.state.title.validateStatus === 'error'
                            ? this.state.title.errorMsg : null}</div>
                    </Form.Item>
                    <Form.Item label="categoty">
                        <Radio.Group onChange={this.handleCategotyChange} name="Categoty" value={this.state.categoty.value}>
                            <Radio value={'Language'}>Language</Radio>
                            <Radio value={'Framework'}>Framework</Radio>
                            <Radio value={'Database'}>Database</Radio>
                            <Radio value={'System'}>System</Radio>
                            <Radio value={'Managing'}>Managing</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="level">
                        <Radio.Group onChange={this.handleLevelChange} name="Level" value={this.state.level.value}>
                            <Radio value={'Lv.1'}>Lv.1</Radio>
                            <Radio value={'Lv.2'}>Lv.2</Radio>
                            <Radio value={'Lv.3'}>Lv.3</Radio>
                        </Radio.Group>
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
                        <Button onClick={this.onUploadSkill} disabled={this.isFormInvalid()} type="primary" className="uploadAddButton" size="large" htmlType="submit">Save</Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

export default withRouter(PortfolioUpload);
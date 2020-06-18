import React, { Component } from 'react';
import { Form, Button, Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { uploadPortfolioPdf } from '../../controller/APIController';
import { withRouter } from "react-router-dom";

const { Dragger } = Upload;
class PortfolioPdfUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList: []
        };
        this.onUploadPortfolioPdf = this.onUploadPortfolioPdf.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onChange = ({ fileList }) => {
        fileList = fileList.slice(-1);
        this.setState({ fileList })
    }

    onUploadPortfolioPdf() {
        try {
            uploadPortfolioPdf(this.props.username, this.state.fileList[0].originFileObj)
            .then(() => {
                this.setState({
                    fileList: null
                });
                message.success('업로드가 완료 되었습니다.');
                this.props.onSubmit(1);
              }).catch((error)=>{
                message.error(error.message);
            })
        } catch (error) {
            message.error('처리 도중 문제가 발생하였습니다.');
        }
    }
    render() {
        return (
            <div className="upload-container">
                <Form>
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
                        <Button onClick={this.onUploadPortfolioPdf} type="primary" className="uploadAddButton" size="large" htmlType="submit">Save</Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

export default withRouter(PortfolioPdfUpload);
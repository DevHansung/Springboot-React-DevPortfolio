import React, { Component } from 'react';
import { Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { withRouter } from "react-router-dom";
import SearchForm from "./SearchForm"

class SearchFormBtn extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = e => {
        this.setState({
            visible: false,
        });
    };

    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };

    render() {
        return (
            <div style={{ zIndex: '2' }}>
                <div>
                    <SearchOutlined className="search-button" onClick={this.showModal} />
                </div >
                <Modal
                    closable={false}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    okButtonProps={{ disabled: true }}
                    cancelButtonProps={{ disabled: true }}
                >
                    <SearchForm onHandleCancel={this.handleCancel}/>
                </Modal>
            </div>
        );
    }
}

export default withRouter(SearchFormBtn);
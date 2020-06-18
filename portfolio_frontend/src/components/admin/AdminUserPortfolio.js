import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Table, message } from 'antd';
import { getAllPortfolio, deletePortfolioByUsername } from '../../controller/APIController';
import {
    CheckOutlined,
    CloseOutlined, DeleteFilled
} from '@ant-design/icons';

class AdminUserPortfolio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userPortfolioList: []
        };
        this.onDelete = this.onDelete.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        this.getAllPortfolio();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getAllPortfolio() {
        getAllPortfolio()
            .then((res) => {
                if (this._isMounted) {
                    this.setState({
                        userPortfolioList: res
                    })
                }
            });
    }

    onDelete = (username) => {
        deletePortfolioByUsername(username)
            .then(res => {
                const { userPortfolioList } = this.state;
                const index = userPortfolioList.findIndex(portfolio => portfolio.username === username);
                const nextUserPortfolioList = [...userPortfolioList];
                nextUserPortfolioList[index] = {
                    username: username, informationId: 0,
                    aboutId: 0, portfolioId: 0, skillId: 0, portfolioPdfId: 0
                }
                this.setState({
                    userPortfolioList: nextUserPortfolioList
                });
                message.success("해당 유저의 포트폴리오가 삭제 되었습니다.")
            }).catch(error => {
                message.error("작업중 문제가 발생하였습니다. 다시 시도해주세요.")
            });
    }
    render() {
        const list = this.state.userPortfolioList
        const columns = [
            {
                title: 'User',
                dataIndex: 'username',
                key: 'User',
                render: (text, record) => <Link to={'/portfolio/' + record.username}>{text}</Link>,
            },
            {
                title: 'Header',
                dataIndex: 'informationId',
                key: 'Header',
                render: (text, record) => (
                    record.informationId >= 1 ? <CheckOutlined /> : <CloseOutlined />
                )
            },
            {
                title: 'About',
                dataIndex: 'aboutId',
                key: 'About',
                render: (text, record) => (
                    record.aboutId >= 1 ? <CheckOutlined /> : <CloseOutlined />
                )
            },
            {
                title: 'Portfolio',
                dataIndex: 'portfolioId',
                key: 'Portfolio',
                render: (text, record) => (
                    record.portfolioId >= 1 ? <CheckOutlined /> : <CloseOutlined />
                )
            },
            {
                title: 'Skill',
                dataIndex: 'skillId',
                key: 'Skill',
                render: (text, record) => (
                    record.skillId >= 1 ? <CheckOutlined /> : <CloseOutlined />
                )
            },
            {
                title: 'PDF',
                dataIndex: 'portfolioPdfId',
                key: 'PDF',
                render: (text, record) => (
                    record.portfolioPdfId >= 1 ? <CheckOutlined /> : <CloseOutlined />
                )
            },
            {
                title: 'Delete',
                key: 'action',
                className: 'action',
                render: (text, record) => (
                    this.props.role === "ROLE_ADMIN" || this.props.role === "ROLE_TOPADMIN" ?
                        record.informationId === 0 && record.aboutId === 0 && record.portfolioId === 0 &&
                            record.skillId === 0 && record.portfolioPdfId === 0 ? null :
                            <span>
                                <DeleteFilled onClick={() => this.onDelete(record.username)} />
                            </span>
                        : null
                )
            }
        ];
        return (
            <div className="editList-container">
                <h2 style={{ textAlign: 'center' }}> <strong>회원 포트폴리오 정보</strong> </h2>
                <Table rowKey={record => record.username} dataSource={list} columns={columns} pagination={{ pageSize: 10 }} />
            </div>
        );
    }
}

export default AdminUserPortfolio;
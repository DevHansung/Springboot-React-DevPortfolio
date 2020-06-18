import React, { Component } from 'react';
import { Table, Button, Form, Input, message } from 'antd';
import { getAvatarColor } from '../../constants/Colors';
import { getUserProfile, deleteUser } from '../../controller/APIUserController';
import { loadLikesByUsername, deleteLikeByLikeId } from '../../controller/APIController';

import { Link, withRouter } from "react-router-dom";
import {
    LoadingOutlined, UserDeleteOutlined
} from '@ant-design/icons';
import NotFound from './NotFound';
class MyProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            likes: [],
            isLoading: false,
            showInput: false,
            passwordInput: ""
        }
        this.loadUserProfile = this.loadUserProfile.bind(this);
        this.onUserDeleteInput = this.onUserDeleteInput.bind(this);
        this.onDeleteUser = this.onDeleteUser.bind(this);
    }

    componentDidMount() {
        this.loadUserProfile(this.props.currentUsername);
        this.loadLike(this.props.currentUsername);
    }

    componentDidUpdate(nextProps) {
        if (this.props.currentUsername !== nextProps.currentUsername) {
            this.loadUserProfile(nextProps.currentUsername);
            this.loadLike(nextProps.currentUsername);
        }
    }

    loadUserProfile(username) {
        this.setState({
            isLoading: true
        });
        getUserProfile(username)
            .then(response => {
                this.setState({
                    user: response,
                    isLoading: false
                });
            }).catch(error => {
                if (error.status === 404) {
                    this.setState({
                        notFound: true,
                        isLoading: false
                    });
                } else {
                    this.setState({
                        notFound: true,
                        isLoading: false
                    });
                }
            });
    }

    loadLike(username) {
        loadLikesByUsername(username)
            .then(res => {
                this.setState({
                    likes: res
                });
            })
            .catch(error => {
                console.log(error.message);
            });
    }

    onPortfolioDeleteLike = (portfolioLikeId) => {
        deleteLikeByLikeId(portfolioLikeId)
            .then((res) => {
                this.setState({ likes: this.state.likes.filter(likes => likes.portfolioLikeId !== portfolioLikeId) })
                message.success("해당 포트폴리오의 추천을 취소하였습니다.")
            }).catch((error) => {
                message.error("작업중 문제가 발생하였습니다.")
            })
    };

    onUserDeleteInput() {
        if (this.state.showInput === false) {
            this.setState({
                showInput: true,
            })
        } else if (this.state.showInput === true) {
            this.setState({
                showInput: false,
            })
        }
    }

    onDeleteUser() {
        deleteUser(this.props.currentUsername, this.state.passwordInput)
            .then((res) => {
                this.props.onDeleteUserLogout();
                this.props.history.push('/');
                message.success("회원 탈퇴 되었습니다.")
            }).catch(error => {
                message.error("비밀번호가 일치하지 않습니다.")
            })
    }

    onPasswordInput = (e) => {
        this.setState({ passwordInput: e.target.value });
    }

    render() {

        if (this.state.isLoading) {
            return <LoadingOutlined />;
        }

        if (this.state.notFound) {
            return <NotFound />;
        }

        const likeColumns = [
            {
                title: 'Username',
                dataIndex: 'targetUsername',
                key: 'targetUsername',
                render: (text, record) => <Link to={'/portfolio/' + record.targetUsername}>{text}</Link>
            },
            {
                title: 'Action',
                key: 'action',
                className: 'action',
                render: (text, record) => (
                    <span>
                        <Button onClick={() => this.onPortfolioDeleteLike(record.portfolioLikeId)}>
                            추천 취소
                    </Button>
                    </span>
                ),
            }
        ]
        return (
            <div className="profile">
                {
                    this.state.user ? (
                        <div className="profile_container">
                            <div className="user-profile">
                                <div className="user-details">
                                    <div className="user-avatar">
                                        <div className="user-avatar-circle" style={{ backgroundColor: getAvatarColor(this.state.user.name) }}>
                                            <div className="user-avatar-circle-font">
                                                {this.state.user.name[0].toUpperCase()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="user-summary">
                                        <div className="full-name">{this.state.user.name}</div>
                                        <div className="username">@{this.state.user.username}</div>
                                        <div>
                                            <br />
                                            <button className="user-btn" onClick={() => this.onUserDeleteInput()} ><UserDeleteOutlined />회원 탈퇴</button>
                                            {this.state.showInput ?
                                                <div className="editForm-container">
                                                    <Form>
                                                        <Form.Item>
                                                            비밀번호 입력
                                                            <Input className="user-input"
                                                                size="large"
                                                                name="checkPassword"
                                                                type="password"
                                                                autoComplete="off"
                                                                placeholder="비밀번호 입력"
                                                                onChange={this.onPasswordInput} />
                                                            <Button type="primary" className="commentButton" onClick={() => this.onDeleteUser()}>
                                                                탈퇴
                                                            </Button>
                                                        </Form.Item>
                                                    </Form>
                                                </div> : null}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="favTable_container">
                                <div className="favTitle_container">
                                    <span className="favTitle">포트폴리오 추천 목록</span>
                                </div>
                                <div><Table dataSource={this.state.likes} columns={likeColumns} pagination={{ pageSize: 8 }} /></div>
                            </div>

                        </div>
                    ) : null
                }
            </div>
        );
    }
}

export default withRouter(MyProfile);
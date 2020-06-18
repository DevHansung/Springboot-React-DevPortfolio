import React, { Component } from 'react';
import 'antd/dist/antd.css';
import { Layout, Menu } from 'antd';
import { withRouter, Link } from "react-router-dom"
import NotFound from './NotFound';
import { HomeOutlined, PieChartOutlined, FilePptOutlined, LogoutOutlined, LoginOutlined } from '@ant-design/icons';
import MyProfile from './MyProfile';

const { Content, Footer, Sider } = Layout;
class MyPage extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    goBack = () => {
        this.props.history.goBack()
    }

    render() {
        return (
            <div className="admin_page">
                <Layout >
                    <Sider
                        style={{
                            overflow: 'auto',
                            height: '100vh',
                            position: 'fixed',
                            left: 0
                        }}>
                        <div className="logo"> <button><Link to="/"><HomeOutlined style={{ fontSize: '25px' }} /></Link></button> </div>
                        {this.props.currentUser !== null ?
                            <Menu theme="dark" mode="inline">
                                <Menu.Item key="2" icon={<FilePptOutlined />}>
                                    <Link className="nav-btn" to={"/portfolio/" + this.props.currentUsername}>MyPortfolio</Link>
                                </Menu.Item>
                                <Menu.Item key="3" icon={<PieChartOutlined />}>
                                    <button className="link-btn" onClick={this.goBack}>GoBack</button>
                                </Menu.Item>
                                <Menu.Item key="4" icon={<LogoutOutlined />}>
                                    <button className="link-btn" onClick={() => this.props.onLogout()}>logout</button>
                                </Menu.Item>
                            </Menu>
                            : <Menu theme="dark" mode="inline">
                                <Menu.Item key="5" icon={<LoginOutlined />} >
                                    <Link to="/sign">Sign</Link>
                                </Menu.Item>
                            </Menu>
                        }

                    </Sider>
                    <Layout className="admin_site-layout" style={{ marginLeft: 200 }}>
                        <h2 className="admin_site-layout-header" style={{ padding: 0 }} >My Page</h2>
                        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
                            {this.props.currentUsername !== null ?
                                <MyProfile currentUsername={this.props.currentUsername} onLogout={this.props.onLogout} onDeleteUserLogout={this.props.onDeleteUserLogout}/>
                                : <NotFound />}
                        </Content>
                        <Footer style={{ textAlign: 'center' }}>
                            A portfolio site made by SpringBoot and ReactJS <br />
                            Dev Portfolio ©2020 Created by Lee-Hansung
                        </Footer>
                    </Layout>
                </Layout>
            </div>
        );
    }
}
export default withRouter(MyPage);
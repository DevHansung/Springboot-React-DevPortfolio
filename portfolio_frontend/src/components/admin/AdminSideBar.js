import React, { Component } from 'react';
import 'antd/dist/antd.css';
import { Layout, Menu } from 'antd';
import { HomeOutlined, LayoutOutlined, TeamOutlined, FilePptOutlined, LogoutOutlined, LoginOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom"

const { Sider } = Layout;

class AdminSideBar extends Component {

    render() {
        return (
            <Sider
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0
                }}>
                <div className="logo"> <button><Link to="/"><HomeOutlined style={{ fontSize: '25px' }} /></Link></button> </div>
                {this.props.role === "ROLE_ADMIN" || this.props.role === "ROLE_TOPADMIN" ?
                    <Menu theme="dark" mode="inline">
                        <Menu.Item key="1" icon={<LayoutOutlined />}>
                            <Link to="/admin">Admin Home</Link>
                        </Menu.Item>
                        <Menu.Item key="2" icon={<FilePptOutlined />}>
                            <Link to="/admin/portfolio">Portfolio</Link>
                        </Menu.Item>
                        <Menu.Item key="3" icon={<TeamOutlined />}>
                            <Link to="/admin/user">User Management</Link>
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
        );
    }
}
export default AdminSideBar;
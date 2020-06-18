import React, { Component } from 'react';
import 'antd/dist/antd.css';
import { Layout } from 'antd';
import { Switch, Route, withRouter } from "react-router-dom"
import NotFound from '../publicComponent/NotFound';
import AdminSideBar from './AdminSideBar';
import AdminUserPortfolio from './AdminUserPortfolio';
import AdminUserManagement from './AdminUserManagement';
import AdminPanel from './AdminPanel';

const { Content, Footer } = Layout;

class AdminMain extends Component {

    render() {
        return (
            <div className="admin_page">
                <Layout >
                    <AdminSideBar role={this.props.role} onLogout={this.props.onLogout}/>
                    <Layout className="admin_site-layout" style={{ marginLeft: 200 }}>
                        <h2 className="admin_site-layout-header" style={{ padding: 0 }} >Admin page</h2>
                        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
                            {this.props.role === "ROLE_ADMIN" || this.props.role === "ROLE_TOPADMIN" ? 
                            <div className="App">
                                <Switch>
                                    <Route exact={true} path="/admin" component={AdminPanel}></Route>
                                    <Route path="/admin/portfolio" render={(props) => <AdminUserPortfolio role={this.props.role} {...props} />}></Route>
                                    <Route path="/admin/user" render={(props) => <AdminUserManagement currentUsername={this.props.currentUsername} role={this.props.role} {...props} />}></Route>
                                </Switch>
                            </div>
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
export default withRouter(AdminMain);
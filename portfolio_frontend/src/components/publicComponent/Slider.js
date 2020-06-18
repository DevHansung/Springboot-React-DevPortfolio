import React, { Component } from 'react';
import 'antd/dist/antd.css';
import { Layout, Menu, Drawer, Button, Modal, message } from 'antd';
import {
  IdcardOutlined, FilePptOutlined, RollbackOutlined, LoginOutlined, LogoutOutlined, DeleteOutlined,
  UserOutlined, LeftCircleFilled, HomeOutlined, UploadOutlined, LayoutOutlined
} from '@ant-design/icons';
import { Link, withRouter } from "react-router-dom"
import AboutUpload from '../management/AboutUpload';
import PortfolioUpload from '../management/PortfolioUpload';
import SkillUpload from '../management/SkillUpload';
import PortfolioPdfUpload from '../management/PortfolioPdfUpload';
import InformationUpload from '../management/InformationUpload';
import { deletePortfolioByUsername } from '../../controller/APIController';


const { Sider } = Layout;
const { SubMenu } = Menu;

class Slider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      childrenDrawer: false,
      summit: null,
      modalVisible: false
    };
  }

  showModal = () => {
    this.setState({
      modalVisible: true,
    });
  };

  modalHandleOk = e => {
    deletePortfolioByUsername(this.props.currentUsername)
      .then(() => {
        this.setState({
          modalVisible: false,
        });
        this.props.onStateChange("deleteAll");
      }).catch((error) => {
        message.error(error.message);
      })
  };

  modalHandleCancel = e => {
    this.setState({
      modalVisible: false,
    });
  };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  showChildrenDrawer = () => {
    this.setState({
      childrenDrawer: true,
    });
  };

  onChildrenDrawerClose = () => {
    this.setState({
      childrenDrawer: false,
    });
  };

  onSubmit = (changeMessage) => {
    if (changeMessage !== null) {
      this.props.onStateChange(changeMessage)
      this.setState({
        childrenDrawer: false,
      });
    } else
      this.setState({
        childrenDrawer: true,
      });
  }

  goBack = () => {
    this.props.history.goBack()
  }

  render() {
    const { visible } = this.state;
    return (
      <div style={{ zIndex: '2' }}>
        <div>
          <LeftCircleFilled className="slider-button" onClick={this.showDrawer} />
        </div >
        <div>
          <Drawer
            placement="right"
            closable={false}
            onClose={this.onClose}
            visible={visible}
            bodyStyle={{ background: '#001529' }}>
            <Layout style={{ background: '#001529', minHeight: '100%' }}>
              {this.props.currentUsername !== null
                ? <div>
                  <Sider >
                    <div className="logo"> <button><Link to="/"><HomeOutlined style={{ fontSize: '25px' }} /></Link></button> </div>
                    <Menu theme="dark" mode="inline">

                      {this.props.role === "ROLE_ADMIN" || this.props.role === "ROLE_TOPADMIN" ?
                        <Menu.Item key="adminPage" icon={<LayoutOutlined />} >
                          <Link to="/admin">ADMIN PAGE</Link>
                        </Menu.Item>
                        : null}

                      <Menu.Item key="mypage" icon={<IdcardOutlined />}>
                        <Link to={"/mypage/" + this.props.currentUsername}>MY PAGE</Link>
                      </Menu.Item>

                      <Menu.Item key="1" icon={<FilePptOutlined />}>
                        <Link to={"/portfolio/" + this.props.currentUsername}>MyPortfolio</Link>
                      </Menu.Item>

                      {this.props.match.path === "/portfoliopdf/:username" ?
                        <Menu.Item key="2" icon={<RollbackOutlined />}>
                          <button className="link-btn" onClick={this.goBack}>GoBack</button>
                        </Menu.Item>
                        : null}

                      {this.props.match.path === "/portfolio/:username" ?
                        this.props.match.params.username === this.props.currentUsername ?
                          this.props.infoId === null ?
                            <SubMenu key="InformationUpload" icon={<UserOutlined />} title="Information">
                              <Menu.Item key="InformationUpload" icon={<UploadOutlined />}>
                                <Button type="link" onClick={this.showChildrenDrawer}>Upload</Button>
                                <Drawer
                                  title="Information upload"
                                  width={520}
                                  closable={false}
                                  onClose={this.onChildrenDrawerClose}
                                  visible={this.state.childrenDrawer}>
                                  <InformationUpload onSubmit={this.onSubmit} username={this.props.currentUsername} />
                                </Drawer>
                              </Menu.Item>
                            </SubMenu>
                            : null
                          : null
                        : null}
                      {this.props.match.path === "/portfolio/:username" ?
                        this.props.match.params.username === this.props.currentUsername ?
                          this.props.infoId !== null ?
                            <SubMenu key="About" icon={<UserOutlined />} title="About">
                              <Menu.Item key="AboutUpload" icon={<UploadOutlined />}>
                                <Button type="link" onClick={this.showChildrenDrawer}>Upload</Button>
                                <Drawer
                                  title="About upload"
                                  width={520}
                                  closable={false}
                                  onClose={this.onChildrenDrawerClose}
                                  visible={this.state.childrenDrawer}>
                                  <AboutUpload onSubmit={this.onSubmit} username={this.props.currentUsername} />
                                </Drawer>
                              </Menu.Item>
                            </SubMenu>
                            : null
                          : null
                        : null}
                      {this.props.match.path === "/portfolio/:username" ?
                        this.props.match.params.username === this.props.currentUsername ?
                          this.props.infoId !== null ?
                            <SubMenu key="Portfolio" icon={<UserOutlined />} title="Portfolio">
                              <Menu.Item key="PortfolioUpload" icon={<UploadOutlined />}>
                                <Button type="link" onClick={this.showChildrenDrawer}>Upload</Button>
                                <Drawer
                                  title="Portfolio upload"
                                  width={520}
                                  closable={false}
                                  onClose={this.onChildrenDrawerClose}
                                  visible={this.state.childrenDrawer}>
                                  <PortfolioUpload onSubmit={this.onSubmit} username={this.props.currentUsername} />
                                </Drawer>
                              </Menu.Item>
                            </SubMenu>
                            : null
                          : null
                        : null}
                      {this.props.match.path === "/portfolio/:username" ?
                        this.props.match.params.username === this.props.currentUsername ?
                          this.props.infoId !== null ?
                            <SubMenu key="Skill" icon={<UserOutlined />} title="Skill">
                              <Menu.Item key="SkillUpload" icon={<UploadOutlined />}>
                                <Button type="link" onClick={this.showChildrenDrawer}>Upload</Button>
                                <Drawer
                                  title="Skill upload"
                                  width={520}
                                  closable={false}
                                  onClose={this.onChildrenDrawerClose}
                                  visible={this.state.childrenDrawer}>
                                  <SkillUpload onSubmit={this.onSubmit} username={this.props.currentUsername} />
                                </Drawer>
                              </Menu.Item>
                            </SubMenu>
                            : null
                          : null
                        : null}
                      {this.props.match.path === "/portfolio/:username" ?
                        this.props.match.params.username === this.props.currentUsername ?
                          this.props.infoId !== null ?
                            <SubMenu key="PortfolioPDF" icon={<UserOutlined />} title="PortfolioPDF">
                              <Menu.Item key="PortfolioPdfUpload" icon={<UploadOutlined />}>
                                <Button type="link" onClick={this.showChildrenDrawer}>Upload</Button>
                                <Drawer
                                  title="PortfolioPDF upload"
                                  width={520}
                                  closable={false}
                                  onClose={this.onChildrenDrawerClose}
                                  visible={this.state.childrenDrawer}>
                                  <PortfolioPdfUpload onSubmit={this.onSubmit} username={this.props.currentUsername} />
                                </Drawer>
                              </Menu.Item>
                            </SubMenu>
                            : null
                          : null
                        : null}

                      {this.props.match.path === "/portfolio/:username" ?
                        this.props.match.params.username === this.props.currentUsername ?
                          this.props.infoId !== null ?
                            <SubMenu key="DeletePortfolio" icon={<UserOutlined />} title="DeletePortfolio">
                              <Menu.Item key="DeletePortfolio" icon={<DeleteOutlined />}>
                                <button className="link-btn" onClick={this.showModal}>DeleteAll</button>
                                <Modal
                                  title="Delete All Portfolio"
                                  visible={this.state.modalVisible}
                                  closable={false}
                                  onOk={this.modalHandleOk}
                                  onCancel={this.modalHandleCancel}>
                                  <p>정말 삭제하시겠습니까?</p>
                                </Modal>
                              </Menu.Item>
                            </SubMenu>
                            : null
                          : null
                        : null}

                      <Menu.Item key="11" icon={<LogoutOutlined />}>
                        <button className="link-btn" onClick={() => this.props.onLogout()}>logout</button>
                      </Menu.Item>
                    </Menu>
                  </Sider>
                </div>
                : <Sider >
                  <div className="logo"> <button><Link to="/"><HomeOutlined style={{ fontSize: '25px' }} /></Link></button> </div>
                  <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                    <Menu.Item key="10" icon={<LoginOutlined />} >
                      <Link to="/sign">Sign</Link>
                    </Menu.Item>
                  </Menu>
                </Sider>
              }
            </Layout>
          </Drawer>
        </div>
      </div>
    );
  }
}

export default withRouter(Slider);
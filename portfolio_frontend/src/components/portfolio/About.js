import React, { Component } from 'react';
import { message, Modal, Divider } from 'antd';
import { loadAbout, deleteAbout, loadAboutById } from '../../controller/APIController';
import AboutEdit from '../management/AboutEdit';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
class About extends Component {
    constructor(props) {
        super(props);
        this.state = {
            aboutList: []
        };
        this.onDelete = this.onDelete.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        this.loadAbout();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidUpdate(prevProps) {
        if (this.props.aboutInput !== prevProps.aboutInput) {
            this.loadAbout();
        } else if (this.props.targetUsername !== prevProps.targetUsername) {
            this.loadAbout();
        }
    }

    loadAbout() {
        loadAbout(this.props.targetUsername)
            .then((res) => {
                if (this._isMounted) {
                    if (res.success === false) {
                        this.setState({
                            aboutList: []
                        })
                    } else
                        this.setState({
                            aboutList: res
                        })
                        this.props.onGetAboutId(res.aboutId)
                }
                this.props.onStateChange()
            }).catch((error) => {
                this.setState({
                    infomationList: []
                })
            })
    }

    onDelete = (aboutId) => {
        deleteAbout(aboutId,)
            .then(res => {
                this.setState({
                    aboutList: []
                })
                this.props.onGetAboutId(null)
            }).catch(error => {
                message.error('요청 처리중 문제가 발생하였습니다. 다시 시도해주세요.');
            });

    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    onHandleOk = (aboutId) => {
        loadAboutById(aboutId)
            .then((res) => {
                this.setState({
                    aboutList: res,
                    visible: false
                })
                this.props.onStateChange()
            }).catch((error) => {
                console.log(error.message)
            })
    }

    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };

    render() {
        if (this.state.aboutList && this.state.aboutList.length === 0) {
            return null
        } else if (this.state.aboutList === undefined) {
            return null
        }
        const list = [this.state.aboutList];
        return (
            <div>
                {list && list.map((item) => {
                    return (
                        <section key='about' id="about">
                            <div className="row">
                                <div className="three columns">
                                    <img className="profile-pic" src={item.aboutImage.fileUri} alt="" />
                                </div>
                                <div className="nine columns main-col">
                                    <h2><span>About Me</span></h2>
                                    <p>{item.text}</p>
                                    <h3>{item.favorite}</h3>
                                    {this.props.currentUsername === item.username ?
                                        <div className="btn-group">
                                            <div>
                                                <DeleteFilled onClick={() => this.onDelete(item.aboutId)} />
                                                <Divider type="vertical" />
                                                <EditFilled onClick={this.showModal} />
                                                <Modal
                                                    title="About edit"
                                                    visible={this.state.visible}
                                                    closable={false}
                                                    onCancel={this.handleCancel}
                                                    okButtonProps={{ disabled: true }}
                                                    cancelButtonProps={{ disabled: true }}>
                                                    <AboutEdit aboutId={item.aboutId} onHandleOk={this.onHandleOk} />
                                                </Modal>
                                            </div>
                                        </div>
                                        : null}
                                </div>
                            </div>
                        </section>
                    )
                })}
            </div>
        );
    }
}
export default About;
import React, { Component } from 'react';
import { loadInformation, loadInformationById, countLikeByInfo } from '../../controller/APIController';
import InformationEdit from '../management/InformationEdit';
import { Modal } from 'antd';
import { SyncOutlined, EditFilled, DownCircleFilled, LikeOutlined } from '@ant-design/icons';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      infomationList: [],
      countLike: null
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.loadInformation();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidUpdate(prevProps) {
    if (this.props.infofmationInput !== prevProps.infofmationInput) {
      this.loadInformation();
    } else if (this.props.targetUsername !== prevProps.targetUsername) {
      this.loadInformation();
    } else if (this.props.countLikeChange !== prevProps.countLikeChange) {
      this.countLikeChange();
    }
  }

  countLikeChange() {
    if (this.props.countLikeChange === true) {
      this.setState({
        countLike: this.state.countLike + 1
      })
      this.props.onCountLikeChange(null)
    } else if (this.props.countLikeChange === false) {
      this.setState({
        countLike: this.state.countLike - 1
      })
      this.props.onCountLikeChange(null)
    }

  }

  loadInformation() {
    loadInformation(this.props.targetUsername)
      .then((res) => {
        if (this._isMounted) {
          if (res.success === false) {
            this.setState({
              infomationList: []
            })
          } else
            this.setState({
              infomationList: res
            })
          if (res.infoId) {
            this.countLikeByInfo(res.infoId)
            this.props.onGetInfoId(res.infoId)
          }
          this.props.onStateChange()
        }
      }).catch((error) => {
        console.log(error.message)
      })
  }

  countLikeByInfo(infoId) {
    countLikeByInfo(infoId)
      .then((res) => {
        if (this._isMounted) {
          this.setState({
            countLike: res
          })
        }
      })
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  onHandleOk = (infoId) => {
    this.setState({
      infomationList: []
    })
    loadInformationById(infoId)
      .then((res) => {
        this.setState({
          infomationList: res,
          visible: false
        })
        this.props.onStateChange("infofmation")
      }).catch((error) => {
        console.log(error.message)
      })
  }

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  scrollToAbout = e => {
    document.getElementById("about").scrollIntoView({ behavior: 'smooth' });
  };

  render() {
    return (
      <React.Fragment>
        <header className="header" id="home">
          <div className="row banner">
            <div className="banner-text">
              {this.state.infomationList && this.state.infomationList.length !== 0 ?
                <div>
                  <h1 className="responsive-headline">
                    {this.state.infomationList.title}
                  </h1>
                  <h3 style={{ color: '#fff', fontFamily: 'sans-serif ' }}>Name: {this.state.infomationList.name}
                    <br></br>Email: {this.state.infomationList.email}
                  </h3>
                  <br></br>
                  <span>{this.state.infomationList.text}</span> <br />
                  <span>{this.state.infomationList.summary}</span>
                  <hr />
                  <ul className="social">
                    <li key={this.state.infomationList.github}>
                      <a href={this.state.infomationList.github} target="_blank" rel="noopener noreferrer"><i className="fa fa-github"></i></a>
                    </li>
                  </ul>
                  <h2 style={{ color: '#fff', fontSize: '2.3rem', fontFamily: 'sans-serif ' }}>
                    <LikeOutlined />: {this.state.countLike}
                  </h2>
                  {this.props.currentUsername === this.state.infomationList.username ?
                    <div className="btn-group">
                      <div>
                        <EditFilled onClick={this.showModal} />
                        <Modal
                          title="Info edit"
                          visible={this.state.visible}
                          closable={false}
                          onCancel={this.handleCancel}
                          okButtonProps={{ disabled: true }}
                          cancelButtonProps={{ disabled: true }}>
                          <InformationEdit infoId={this.state.infomationList.infoId} onHandleOk={this.onHandleOk} />
                        </Modal>
                      </div>
                    </div>
                    : null}
                </div>
                : <h1 className="responsive-headline"> <SyncOutlined spin /> </h1>}
            </div>
          </div>

          {this.state.infomationList && this.state.infomationList.length !== 0 ?
            this.props.aboutId !== null && this.props.aboutId !== undefined ? 
              <div>
                <div className="scrolldown">
                  <div id="go-down"><button className="btn-down" onClick={this.scrollToAbout}><DownCircleFilled /></button></div>
                </div>
              </div>
              : null
            : null}

        </header>
      </React.Fragment>
    );
  }
}
export default Header;
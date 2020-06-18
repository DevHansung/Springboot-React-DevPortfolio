import React, { Component } from 'react';
import { Link } from "react-router-dom"
import { loadInformation } from '../../controller/APIController';
import {
  LogoutOutlined, UpCircleFilled, LoginOutlined
} from '@ant-design/icons';

export default class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      github: null
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
    }
  }

  loadInformation() {
    loadInformation(this.props.targetUsername)
      .then((res) => {
        if (this._isMounted) {
          if (res.success === false) {
            this.setState({
              github: null
            })
          } else
            this.setState({
              github: res.github
            })
        }
        this.props.onStateChange()
      }).catch((error) => {
        console.log(error.message)
      })
  }

  scrollToHome = e => {
    document.getElementById("home").scrollIntoView({ behavior: 'smooth' });
  };

  render() {
    return (
      <footer>
        <div className="row">
          <div className="twelve columns">
            {this.state.github !== null ?
              <ul className="social-links">
                <li key={this.state.github}>
                  <a href={this.state.github} target="_blank" rel="noopener noreferrer">
                    <i className="fa fa-github" />
                  </a>
                </li>
              </ul>
              : null}
            {this.props.currentUsername === null
              ? <Link to="/sign"><button className="sign-btn"><LoginOutlined />Sign</button></Link>
              : <button className="sign-btn" onClick={() => this.props.onLogout()}><LogoutOutlined />Logout</button>}
          </div>
          <div id="go-top"><button className="footer-top" onClick={this.scrollToHome}><UpCircleFilled /></button></div>
          <p className="footer-text">
            A portfolio site made by SpringBoot and ReactJS <br />
            Dev Portfolio ©2020 Created by Lee-Hansung
          </p>
        </div>
      </footer>
    );
  }
}
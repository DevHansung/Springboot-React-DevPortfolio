import React, { Component } from 'react';
import Typist from 'react-typist';
import 'react-typist/dist/Typist.css';
import Slider from './Slider';
import SearchForm from './SearchForm';
import { Link } from "react-router-dom"
import { LoginOutlined, LogoutOutlined, } from '@ant-design/icons';
export default class Header extends Component {

  render() {
    let resumeData = this.props.resumeData
    const currentUsername = this.props.currentUsername
    let image = this.props.currentUsername === null
      ? 'url(' + this.props.resumeData.mainImageGrayUrl + ')'
      : 'url(' + this.props.resumeData.mainImageGreenUrl + ')'
    return (
      <React.Fragment>
        <header style={{ background: image }} className="header">
          <div className="row banner">
            <div className="banner-text">
              <h1 className="responsive-headline"><Typist avgTypingDelay={170} cursor={{ hideWhenDone: true }}>{resumeData.title}</Typist></h1>
              <br></br>
              <Typist avgTypingDelay={120} startDelay={6000}>
                <span>{resumeData.textTwo}</span>
                <Typist.Delay ms={1000} />
                <Typist.Backspace count={resumeData.textTwo.length} delay={150} />
                <span>{resumeData.textOne}</span> <br></br>
                <Typist.Delay ms={1000} />
                <span>{resumeData.textTwo}</span>
              </Typist>
              <hr />
              <SearchForm />
            </div>
            {this.props.currentUsername === null
              ? <Link to="/sign" ><button className="sign-btn main-sign-position"><LoginOutlined />Sign</button></Link>
              : <button className="sign-btn main-sign-position" onClick={() => this.props.onLogout()}><LogoutOutlined />Logout</button>}
          </div>
        </header>
        <Slider onLogout={this.props.onLogout} currentUsername={currentUsername} role={this.props.role} />

      </React.Fragment>
    );
  }
}
import React, { Component } from 'react';
import { Link, withRouter } from "react-router-dom"
import { message } from 'antd';

class NavigationBar extends Component {
  scrollToHome = e => {
    try {
      document.getElementById("home").scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      message.info('조회된 Abuot데이터가 없습니다.');
    }
  };
  scrollToAbout = e => {
    try {
      document.getElementById("about").scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      message.info('조회된 Abuot데이터가 없습니다.');
    }
  };
  scrollToPortfolio = e => {
    try {
      document.getElementById("portfolio").scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      message.info('조회된 Portfolio데이터가 없습니다.');
    }
  };
  scrollToSkills = e => {
    try {
      document.getElementById("skills").scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      message.info('조회된 Skill데이터가 없습니다.');
    }
  };
  scrollToContact = e => {
    try {
      document.getElementById("contact").scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      message.info('조회된 Contact데이터가 없습니다.');
    }
  };

  handleClick() {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
  }

  render() {
    return (
      <div>
        <nav id="nav-wrap">
          <a className="mobile-btn" href={this.props.match.url + "#nav-wrap"} title="Show navigation">Show navigation</a>
          <a className="mobile-btn" href={this.props.match.url + "#nav"} title="Hide navigation">Hide navigation</a>
          <ul id="nav" className="nav">
            <li><button className="smoothscroll nav-btn" onClick={this.scrollToHome}>Home</button></li>
            <li><button className=" nav-btn" onClick={this.scrollToAbout}>About</button></li>
            <li><button className=" nav-btn" onClick={this.scrollToPortfolio}>Portfolio</button></li>
            <li><button className=" nav-btn" onClick={this.scrollToSkills}>Skills</button></li>
            <li><button className=" nav-btn" onClick={this.scrollToContact}>Contact</button></li>
            <li><Link className="nav-btn" to={"/portfoliopdf/" + this.props.targetUsername}>PDF-View</Link></li>
          </ul>
        </nav>
      </div>
    );
  }
}
export default withRouter(NavigationBar);
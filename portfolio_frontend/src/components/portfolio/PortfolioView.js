import React, { Component } from 'react';
import NavigationBar from './NavigationBar';
import Header from './Header';
import About from './About';
import Portfolio from './Portfolio';
import Skills from './Skills';
import Contact from './Contact';
import Footer from './Footer';
import Slider from '../publicComponent/Slider';
import SearchForm from '../publicComponent/SearchFormBtn';
import { Spin } from 'antd';
import PortfolioLikeBtn from '../management/PortfolioLikeBtn';

export default class UserPortfolio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      infoId: null,
      aboutId: null,
      countLikeChange: null,
      likeInput: false,
      likeBtnEnabled: false,
      infofmationInput: false,
      portfolioInput: false,
      aboutInput: false,
      skillInput: false
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onStateChange = (changeMessage) => {
    if (this._isMounted) {
      if (changeMessage === "information") {
        this.setState({
          infofmationInput: true
        });
      } else if (changeMessage === "portfolio") {
        this.setState({
          portfolioInput: true
        });
      } else if (changeMessage === "about") {
        this.setState({
          aboutInput: true
        });
      } else if (changeMessage === "skill") {
        this.setState({
          skillInput: true
        });
      } else if (changeMessage === "deleteAll") {
        this.setState({
          infoId: null,
          infofmationInput: true,
          portfolioInput: true,
          aboutInput: true,
          skillInput: true
        });
      } else
        this.setState({
          infofmationInput: false,
          portfolioInput: false,
          aboutInput: false,
          skillInput: false
        });
    }
  }

  onGetInfoId = (getInfoId) => {
    this.setState({
      likeBtnEnabled: true,
      infoId: getInfoId,
      likeInput: true
    });
  }

  onGetAboutId = (getAboutId) => {
    this.setState({
      aboutId: getAboutId,
    });
  }

  onCountLikeChange = (message) => {
    if (message === "plus") {
      this.setState({
        countLikeChange: true,
      });
    } else if (message === "minus") {
      this.setState({
        countLikeChange: false,
      });
    } else
      this.setState({
        countLikeChange: null
      });
  }


  render() {
    const resumeData = this.props.resumeData;
    const targetUsername = this.props.match.params.username
    const currentUsername = this.props.currentUsername
    const onLogout = this.props.onLogout
    if (!targetUsername) {
      return <Spin />
    }
    return (
      <div>
        <NavigationBar targetUsername={targetUsername} />
        <Header targetUsername={targetUsername} currentUsername={currentUsername} resumeData={resumeData}
          infofmationInput={this.state.infofmationInput} onStateChange={this.onStateChange}
          onGetInfoId={this.onGetInfoId} countLikeChange={this.state.countLikeChange} onCountLikeChange={this.onCountLikeChange} aboutId={this.state.aboutId} />
        <About targetUsername={targetUsername} currentUsername={currentUsername}
          aboutInput={this.state.aboutInput} onStateChange={this.onStateChange} onGetAboutId={this.onGetAboutId} />
        <Portfolio targetUsername={targetUsername} currentUsername={currentUsername}
          portfolioInput={this.state.portfolioInput} onStateChange={this.onStateChange} />
        <Skills targetUsername={targetUsername} currentUsername={currentUsername}
          skillInput={this.state.skillInput} onStateChange={this.onStateChange} />
        <Contact targetUsername={targetUsername} currentUsername={currentUsername} resumeData={resumeData}
          infofmationInput={this.state.infofmationInput} onStateChange={this.onStateChange} />
        <Footer onLogout={onLogout} targetUsername={targetUsername} currentUsername={currentUsername}
          infofmationInput={this.state.infofmationInput} onStateChange={this.onStateChange} />

        <SearchForm />
        <Slider currentUsername={currentUsername} onLogout={onLogout} currentUser={this.props.currentUser}
          onStateChange={this.onStateChange} role={this.props.role} infoId={this.state.infoId} />
        {currentUsername !== null ?
          <PortfolioLikeBtn currentUsername={currentUsername} infoId={this.state.infoId}
            likeInput={this.state.likeInput} onCountLikeChange={this.onCountLikeChange} />
          : null}
      </div>
    );
  }
}
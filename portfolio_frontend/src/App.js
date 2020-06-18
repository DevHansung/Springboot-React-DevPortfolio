import React, { Component } from 'react';
import { Switch, Route, withRouter, BrowserRouter as Router } from "react-router-dom"
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants/Property';
import { expiry } from './constants/TokenValid';
import { Spin } from 'antd';

import Main from './components/publicComponent/Main';
import NotFound from './components/publicComponent/NotFound';
import SignForm from './components/sign/SignForm';
import PortfolioView from './components/portfolio/PortfolioView';
import PortfolioPdf from './components/portfolio/PortfolioPdf';

import { getCurrentUser, refreshRequest, logout } from './controller/APIUserController';

import resumeData from './constants/ResumeData';
import AdminMain from './components/admin/AdminMain';
import MyPage from './components/publicComponent/MyPage';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      isLoading: false,
      role: null,
      currentUsername: null,
    }
    this.loadCurrentUser = this.loadCurrentUser.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.TokenValidation = this.TokenValidation.bind(this);
  }

  componentDidMount() {
    this.loadCurrentUser();
  }

  componentDidUpdate() {
    if (sessionStorage.getItem(REFRESH_TOKEN) && sessionStorage.getItem(REFRESH_TOKEN) !== 'undefined') {
      const hasAccessToken = expiry(sessionStorage.getItem(ACCESS_TOKEN));
      if (hasAccessToken < 5 * 60) {
        this.TokenValidation(hasAccessToken);
      }
    } else if (!sessionStorage.getItem(REFRESH_TOKEN) ||
      sessionStorage.getItem(REFRESH_TOKEN) === 'undefined' ||
      sessionStorage.getItem(REFRESH_TOKEN) === null) {
      return
    }
  }

  TokenValidation(hasAccessToken) {
    try {
      if (hasAccessToken < 5 * 60 && hasAccessToken > 0) {
        refreshRequest()
          .then(res => {
            sessionStorage.setItem(ACCESS_TOKEN, res.accessToken);
            sessionStorage.setItem(REFRESH_TOKEN, res.refreshToken);
            this.loadCurrentUser();
          }).catch(error => {
            this.handleLogout();
          });
        return
      }
      else if (hasAccessToken < 0) {
        if (sessionStorage.getItem(REFRESH_TOKEN) || sessionStorage.getItem(REFRESH_TOKEN) !== 'undefined') {
          const hasRefreshToken = expiry(sessionStorage.getItem(REFRESH_TOKEN));
          if (hasRefreshToken > 0) {
            refreshRequest()
              .then(res => {
                sessionStorage.setItem(ACCESS_TOKEN, res.accessToken);
                sessionStorage.setItem(REFRESH_TOKEN, res.refreshToken);
                this.loadCurrentUser();
              }).catch(error => {
                this.handleLogout();
              });
          }
          else if (hasRefreshToken <= 0) {
            this.handleLogout()
          }
        }
        else {
          this.handleLogout()
        }
      }
    } catch (error) {
      this.handleLogout()
      return
    }
  }

  handleLogin() {
    this.loadCurrentUser();
    this.props.history.push("/");
  }

  loadCurrentUser() {
    this.setState({
      isLoading: true
    });
    getCurrentUser()
      .then(response => {
        this.setState({
          role: response.authorities[0].authority,
          currentUser: response,
          isAuthenticated: true,
          isLoading: false,
          currentUsername: response.username,
        });
      }).catch(error => {
        this.setState({
          isLoading: false
        });
      });
  }

  handleLogout() {
    logout()
      .then(res => {
        sessionStorage.removeItem(ACCESS_TOKEN);
        sessionStorage.removeItem(REFRESH_TOKEN);
        this.setState({
          currentUser: null,
          isAuthenticated: false,
          role: null,
          currentUsername: null
        });
        this.props.history.push('/');
      }).catch(error => {
        sessionStorage.removeItem(ACCESS_TOKEN);
        sessionStorage.removeItem(REFRESH_TOKEN);
        this.setState({
          currentUser: null,
          isAuthenticated: false,
          role: null,
          currentUsername: null
        });
        this.props.history.push('/');
      });
  }

  onDeleteUserLogout = () => {
    sessionStorage.removeItem(ACCESS_TOKEN);
    sessionStorage.removeItem(REFRESH_TOKEN);
    this.setState({
      currentUser: null,
      isAuthenticated: false,
      role: null,
      currentUsername: null
    });
    this.props.history.push('/');
  }

  render() {
    if (this.state.isLoading) {
      return <Spin />
    }
    return (
      <Router>
        <div className="App">
          <Switch>
            <Route exact={true} path="/" render={() => <Main currentUsername={this.state.currentUsername} resumeData={resumeData} onLogout={this.handleLogout} currentUser={this.state.currentUser} role={this.state.role} />}></Route>
            <Route path="/sign" render={(props) => <SignForm resumeData={resumeData} onLogin={this.handleLogin} {...props} />}></Route>
            <Route path="/portfolio/:username" render={(props) => <PortfolioView currentUsername={this.state.currentUsername} resumeData={resumeData} onLogout={this.handleLogout} role={this.state.role} {...props} />}></Route>
            <Route path="/portfoliopdf/:username" render={(props) => <PortfolioPdf currentUsername={this.state.currentUsername} onLogout={this.handleLogout} role={this.state.role} {...props} />}></Route>
            <Route path="/admin" render={(props) => <AdminMain currentUsername={this.state.currentUsername} onLogout={this.handleLogout} role={this.state.role} {...props} />}></Route>
            <Route path="/mypage/:username" render={(props) => <MyPage currentUsername={this.state.currentUsername} currentUser={this.state.currentUser} onLogout={this.handleLogout} onDeleteUserLogout={this.onDeleteUserLogout} {...props} />}></Route>

            <Route component={NotFound}></Route>
          </Switch>
        </div>
      </Router>
    );
  }
}
export default withRouter(App);
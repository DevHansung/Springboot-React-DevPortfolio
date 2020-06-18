import React, { Component } from 'react';
import { loadInformation } from '../../controller/APIController';

export default class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      email: null
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
    }
  }

  loadInformation() {
    loadInformation(this.props.targetUsername)
      .then((res) => {
        if (this._isMounted) {
          if (res.success === false) {
            this.setState({
              name: null,
              email: null
            })
          } else
            this.setState({
              name: res.name,
              email: res.email
            })
        }
        this.props.onStateChange()
      }).catch((error) => {
        console.log(error.message)
      })
  }

  render() {
    if (this.state.name === null && this.state.email === null) {
      return null
    }
    return (
      <section id="contact">
        <div className="text-container">
          <div className="row">
            <ul>
              <li key={this.state.name}>
                <blockquote>
                  <p>Thank You.</p>
                  <cite>Name: {this.state.name}</cite>
                  <cite>Email: {this.state.email}</cite>
                </blockquote>
              </li>
            </ul>
          </div>
        </div>
      </section>
    );
  }
}
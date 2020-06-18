import React, { Component } from 'react';
import NavigationPanel from './NavigationPanel';
import Modal from './Modal';

class SignForm extends Component {
    handleSubmit = (e) => {
		this.setState({ mounted: false });
		e.preventDefault();
    }
    
    render() {
        return (
            <div className="sign-body">
                <div className="sign">
                    <div className="sign-contents">
                        <NavigationPanel></NavigationPanel>
                        <Modal onLogin={this.props.onLogin} onSubmit={this.handleSubmit} />
                    </div>
                </div>
            </div>
        );
    }
}
export default SignForm;
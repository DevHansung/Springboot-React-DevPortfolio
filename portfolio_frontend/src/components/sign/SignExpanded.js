import React, { Component } from 'react';
import { Motion, spring } from 'react-motion';
import SignIn from './SignIn';
import SignUp from './SignUp';

class SignExpanded extends Component {

	constructor(props) {
		super(props);
		this.state = {
			flexState: false,
			animIsFinished: false
		};
	}

	componentDidMount() {
		this.setState({ flexState: !this.state.flexState });
	}


	isFinished = () => {
		this.setState({ animIsFinished: true });
	}

	render() {
		return (
			<Motion style={{
				flexVal: spring(this.state.flexState ? 8 : 1)
			}} onRest={this.isFinished}>
				{({ flexVal }) =>
					<div className={this.props.type === 'signIn' ? 'signInExpanded' : 'signUpExpanded'} style={{
						flexGrow: `${flexVal}`
					}}>
						<Motion style={{
							opacity: spring(this.state.flexState ? 1 : 0, { stiffness: 300, damping: 17 }),
							y: spring(this.state.flexState ? 0 : 50, { stiffness: 100, damping: 17 })
						}} >
							{({ opacity, y }) =>
								<form className='logForm' style={{
									WebkitTransform: `translate3d(0, ${y}px, 0)`,
									transform: `translate3d(0, ${y}px, 0)`,
									opacity: `${opacity}`
								}}>
									<h2>{this.props.type === 'signIn' ? 'SIGN IN' : 'SIGN UP'}</h2>
									{this.props.type === 'signIn' ? <SignIn onLogin={this.props.onLogin} /> : <SignUp signState={this.props.signState}/>}
								</form>
							}
						</Motion>
					</div>
				}
			</Motion>
		);
	}

}

export default SignExpanded;
import React from 'react';
import PropTypes from 'prop-types';
import {MdAccountCircle, MdAddCircle} from 'react-icons/md';

const Sign = (props) => {

	let icon = null;

	if (props.type === 'signIn') {
		icon = <MdAccountCircle className='icons'/>
	} else {
		icon = <MdAddCircle className='icons'/>
	}

	return (
		<div className={props.type==='signIn' ? 'signIn' : 'signUp'}>
			<div className='center'>
				<div className='center-btn' onClick={props.onChange}>
					{icon}
				</div>
				<p>{props.type === 'signIn' ? 'SIGN IN' : 'SIGN UP'}</p>
			</div>
		</div>
	);
}

Sign.propTypes = {
	type: PropTypes.string,
	onChange: PropTypes.func	
};

export default Sign;
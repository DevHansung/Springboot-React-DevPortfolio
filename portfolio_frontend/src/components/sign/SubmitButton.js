import React from 'react';
import {MdArrowForward} from 'react-icons/md';
import {FaGooglePlus, FaTwitter, FaFacebook} from 'react-icons/fa';

const SubmitButton = (props) => {

	let socialNets = null;

	if (props.type === 'signIn') {
		socialNets = (
			<div className='socialNets'>
				<FaGooglePlus className='socialNetsIcon'/>
				<FaTwitter className='socialNetsIcon'/>
				<FaFacebook className='socialNetsIcon'/>
			</div>
		)
	} else {
		socialNets = (
			<div className='socialNets'>
			</div>
		)
	}
	return (
		<div className={'submitButton'}>
			{socialNets}
			<button className={props.type==='signIn' ? 'submitSignIn' : 'submitSignUp'}><MdArrowForward/></button>
		</div>
	);
} 

export default SubmitButton;
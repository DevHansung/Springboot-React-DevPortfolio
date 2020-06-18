import React from 'react';
import {MdArrowBack} from 'react-icons/md';
import { Link } from "react-router-dom"

const NavigationPanel = (props) => {
	return (
		<div className='NavigationPanel'>
			<div className='back'>
				<Link to="/"><MdArrowBack className="back-btn"/></Link>
			</div>
		</div>
	);
}
export default NavigationPanel;
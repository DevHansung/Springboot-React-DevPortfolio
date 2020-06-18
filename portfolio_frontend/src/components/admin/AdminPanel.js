import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

class AdminPanel extends Component {
    render() {
        return (
            <div className="page-not-found">
                <h1 className="title">
                    ADMIN
                </h1>
                <div className="desc">
                    Press the button below to leave the page.
                </div>
                <Link to="/"><Button className="go-back-btn" type="primary" size="large">Go Home</Button></Link>
            </div>
        );
    }
}
export default AdminPanel;
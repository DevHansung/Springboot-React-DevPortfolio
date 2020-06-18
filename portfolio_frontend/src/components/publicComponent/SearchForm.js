import React, { Component } from 'react';
import { Input } from 'antd';
import { Link } from "react-router-dom"
import { SearchOutlined } from '@ant-design/icons';
import { withRouter } from "react-router-dom";

class SearchForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: {
                value: ''
            }
        };
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const inputName = target.name;
        const inputValue = target.value;
        this.setState({
            [inputName]: {
                value: inputValue
            }
        })
    }

    onHandleEnter = (e) => {
        if (e.key === "Enter") {
            this.props.history.push(`/portfolio/${this.state.search.value}`)
            if (this.props.onHandleCancel) {
                this.props.onHandleCancel()
            }
        }
    }

    onHandleSubmit = (e) => {
        if (this.props.onHandleCancel) {
            this.props.onHandleCancel()
        }
    }

    render() {
        return (
            <div className="search-form">
                <Input className="search-input" autoComplete="off" type="text" name="search" size="small" placeholder="search for username"
                    value={this.state.search.value} onChange={this.handleInputChange} onKeyPress={this.onHandleEnter}></Input>
                <Link className="search-icon" to={`/portfolio/${this.state.search.value}`} onClick={this.onHandleSubmit}><SearchOutlined /></Link>
            </div>
        );
    }
}

export default withRouter(SearchForm);
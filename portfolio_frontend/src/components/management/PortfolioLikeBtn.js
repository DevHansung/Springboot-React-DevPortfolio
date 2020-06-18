import React, { Component } from 'react';
import { LikeOutlined, DislikeOutlined } from '@ant-design/icons';
import { withRouter } from "react-router-dom";
import { loadLikeByUsername, uploadLikeByUsername, deleteLikeByLikeId } from '../../controller/APIController';


class SearchFormBtn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            portfolioLike: false,
            likeId: null
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.likeInput !== prevProps.likeInput) {
            this.loadLikeByUsername();
        } else if(this.props.infoId !== prevProps.infoId){
            this.loadLikeByUsername();
        }
    }

    loadLikeByUsername() {
        loadLikeByUsername(this.props.infoId, this.props.currentUsername)
            .then((res) => {
                if (res) {
                    this.setState({
                        portfolioLike: true,
                        likeId: res
                    });
                } else if(res === null || res === undefined)
                    this.setState({
                        portfolioLike: false
                    });
            }).catch((error) => {
                this.setState({
                    portfolioLike: false
                });
            })
    }

    onPortfolioUploadLike = () => {
        uploadLikeByUsername(this.props.infoId, this.props.currentUsername)
            .then((res) => {
                this.setState({
                    portfolioLike: true,
                    likeId: res
                });
                this.props.onCountLikeChange("plus")
            }).catch((error) => {
                this.setState({
                    portfolioLike: false
                });
            })
    };

    onPortfolioDeleteLike = () => {
        deleteLikeByLikeId(this.state.likeId)
            .then((res) => {
                this.setState({
                    portfolioLike: false,
                    likeId: null
                });
                this.props.onCountLikeChange("minus")
            }).catch((error) => {
                this.setState({
                    portfolioLike: true
                });
            })
    };

    render() {
        return (
            <div>
                {this.props.infoId !== null ?
                    this.state.portfolioLike === false
                        ? <div style={{ zIndex: '2' }}>
                            <div>
                                <LikeOutlined className="like-button" onClick={this.onPortfolioUploadLike} />
                            </div >
                        </div>
                        : <div style={{ zIndex: '2' }}>
                            <div>
                                <DislikeOutlined className="like-button" onClick={this.onPortfolioDeleteLike} />
                            </div >
                        </div>
                    : null
                }
            </div>
        );
    }
}

export default withRouter(SearchFormBtn);
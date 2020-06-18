import React, { Component } from 'react';
import { loadPortfolio, deletePortfolio, loadPortfolioById } from '../../controller/APIController';
import PortfolioEdit from '../management/PortfolioEdit';
import { message, Modal, Divider } from 'antd';
import { DeleteFilled, EditFilled } from '@ant-design/icons';

export default class Resume extends Component {

  constructor(props) {
    super(props);
    this.state = {
      PortfolioList: [],
      isPortfolioId: null 
    };
    this.onDelete = this.onDelete.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this.loadPortfolio();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidUpdate(prevProps) {
    if (this.props.portfolioInput !== prevProps.portfolioInput) {
      this.loadPortfolio();
    } else if (this.props.targetUsername !== prevProps.targetUsername) {
      this.loadPortfolio();
    }
  }

  loadPortfolio() {
    loadPortfolio(this.props.targetUsername)
      .then((res) => {
        if (this._isMounted) {
          if (res.success === false) {
            this.setState({
              infomationList: []
            })
          } else
            this.setState({
              portfolioList: res
            })
        }
        this.props.onStateChange();
      }).catch((error) => {
        console.log(error.message)
      })
  }

  onDelete = (portfolioId) => {
    deletePortfolio(portfolioId)
      .then(res => {
        this.setState({ portfolioList: this.state.portfolioList.filter(portfolio => portfolio.portfolioId !== portfolioId) }, function () {
        })
      }).catch(error => {
        message.error('요청 처리중 문제가 발생하였습니다. 다시 시도해주세요.');
      });
  }

  onShowModal = (portfolioId) => {
    this.setState({
      visible: true,
      isPortfolioId: portfolioId
    });
  };

  onHandleOk = (portfolioId) => {
    try {
      loadPortfolioById(portfolioId)
        .then(res => {
          const { portfolioList } = this.state;
          const index = portfolioList.findIndex(portfolioList => portfolioList.portfolioId === portfolioId);
          const nextPortfolioList = [...portfolioList];
          nextPortfolioList[index] = res
          this.setState({
            portfolioList: nextPortfolioList,
            visible: false
          });
        }).catch(error => {
          console.log(error.message)
        })
    } catch (error) {
      console.log(error.message)
    }
  }

  onHandleCancel = e => {
    this.setState({
      visible: false,
    });
  };
  render() {
    if (this.state.portfolioList && this.state.portfolioList.length === 0) {
      return null
    } else if (this.state.portfolioList === undefined) {
      return null
    }
    return (
      <section id="portfolio">
        <div className="row work">
          <div className="three columns header-col">
            <h1><span>Portfolio</span></h1>
          </div>
          <div className="nine columns main-col">
            {
              this.state.portfolioList && this.state.portfolioList.map((item) => {
                return (
                  <div key={item.portfolioImage.fileUri} className="row item portfolio-box">
                    <div>
                      <a href={item.github} target="_blank" rel="noopener noreferrer">
                      <img className="portfolio-pic" src={item.portfolioImage.fileUri} alt=""/>
                      </a>
                    </div>
                    <div key={item.title} className="twelve columns contents-box">
                      <h3>{item.title}</h3>
                      <p className="info">{item.summary}</p>
                      <p><span>&bull;</span> <em className="date">{item.period}</em></p>
                      <p>{item.technology}</p>
                      {this.props.currentUsername === item.username ?
                        <div className="btn-group">
                          <div>
                            <DeleteFilled onClick={() => this.onDelete(item.portfolioId)} />
                            <Divider type="vertical" />
                            <EditFilled onClick={() => this.onShowModal(item.portfolioId)} />
                            <Modal
                              title="Portfolio edit"
                              visible={this.state.visible}
                              closable={false}
                              onCancel={this.onHandleCancel}
                              okButtonProps={{ disabled: true }}
                              cancelButtonProps={{ disabled: true }}>
                              <PortfolioEdit portfolioId={this.state.isPortfolioId} onHandleOk={this.onHandleOk} />
                            </Modal>
                          </div>
                        </div>
                        : null}
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </section>
    );
  }
}
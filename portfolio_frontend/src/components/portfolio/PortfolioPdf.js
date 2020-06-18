import React, { Component } from 'react';
import Slider from '../publicComponent/Slider';
import { message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { loadPortfolioPdf, deletePortfolioPdf } from '../../controller/APIController';
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = "https://cdn.bootcss.com/pdf.js/2.1.266/pdf.worker.js";

export default class PortfolioPdf extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numPages: null,
      pageNumber: 1,
      PortfolioPdfUrl: null,
      pdfId: null
    };
  }
  componentDidMount() {
    this._isMounted = true;
    this.loadPortfolioPdf();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  loadPortfolioPdf() {
    loadPortfolioPdf(this.props.match.params.username)
      .then((res) => {
        if (this._isMounted) {
          if (res.success === false) {
            this.setState({
              infomationList: []
            })
          } else
            this.setState({
              pdfId: res.pdfId,
              PortfolioPdfUrl: res.fileUri
            })
        }
      }).catch((error) => {
        console.log(error.message)
      })
  }

  onDeletePortfolioPdf = () => {
    deletePortfolioPdf(this.state.pdfId)
      .then(res => {
        this.setState({
          PortfolioPdfUrl: null
        })
      }).catch(error => {
        message.error('요청 처리중 문제가 발생하였습니다. 다시 시도해주세요.');
      });

  }

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  }

  onPageUp = () => {
    if (this.state.pageNumber !== this.state.numPages) {
      const pageUp = this.state.pageNumber + 1
      this.setState({ pageNumber: pageUp });
    }
  }

  onPageDown = () => {
    if (this.state.pageNumber !== 1) {
      const pageDown = this.state.pageNumber - 1
      this.setState({ pageNumber: pageDown });
    }
    else return
  }

  render() {
    const { pageNumber, numPages } = this.state;
    const pdfView = this.state.PortfolioPdfUrl
    return (
      <div className="main-wrap">
        <div>
          <Document className="pdf-box"
            file={pdfView}
            onLoadSuccess={this.onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber} />
            <div className="buttons">
              <button className="color" onClick={this.onPageDown}>‹</button>
              <span>Page {pageNumber} of {numPages}</span>
              <button className="color" type="button" onClick={this.onPageUp}>›</button>
            </div>
            {this.props.currentUsername !== null ?
              <DeleteOutlined className="btn-group" onClick={this.onDeletePortfolioPdf} />
              : null}
          </Document>
        </div>
        <Slider onLogout={this.props.onLogout} currentUsername={this.props.currentUsername} role={this.props.role} />
      </div>
    );
  }
}

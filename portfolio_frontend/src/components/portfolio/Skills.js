import React, { Component } from 'react';
import { loadSkill, deleteSkill } from '../../controller/APIController';
import {
  CloseCircleOutlined
} from '@ant-design/icons';
export default class Skills extends Component {

  constructor(props) {
    super(props);
    this.state = {
      skillList: []
    };
    this.onDelete = this.onDelete.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this.loadSkill();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidUpdate(prevProps) {
    if (this.props.skillInput !== prevProps.skillInput) {
      this.loadSkill();
    } else if (this.props.targetUsername !== prevProps.targetUsername) {
      this.loadSkill();
    }
  }

  loadSkill() {
    loadSkill(this.props.targetUsername)
      .then((res) => {
        if (this._isMounted) {
          if (res.success === false) {
            this.setState({
              infomationList: []
            })
          } else
            this.setState({
              skillList: res
            })
        }
        this.props.onStateChange()
      }).catch((error) => {
        console.log(error.message)
      })

  }

  onDelete = (skillId) => {
    deleteSkill(skillId)
      .then(res => {
        this.setState({ skillList: this.state.skillList.filter(skill => skill.skillId !== skillId) }, function () {
        })
      }).catch(error => {
      });
  }

  render() {
    if (this.state.skillList && this.state.skillList.length === 0) {
      return null
    } else if (this.state.skillList === undefined) {
      return null
    }
    const skillList = this.state.skillList
    const languageData = skillList.filter(item => item.categoty.includes('Language'));
    const frameworkData = skillList.filter(item => item.categoty.includes('Framework'));
    const databaseData = skillList.filter(item => item.categoty.includes('Database'));
    const systemData = skillList.filter(item => item.categoty.includes('System'));
    const managingData = skillList.filter(item => item.categoty.includes('Managing'));
    return (
      <section key="skills" id="skills">
        <div className="row skill">
          <div className="three columns header-col">
            <h1><span>Skills</span></h1>
          </div>
          <div className="six columns">
            <div>
              <br></br><br></br>
              {languageData.length !== 0 ? <h4>Language</h4> : null}
              <div className="skill-box">
                {languageData && languageData.map((item) => {
                  return (
                    <div className="skill-pic" key={item.skillId}>
                      <img src={item.skillImage.fileUri} alt="" />
                      <div className="darkness" ></div>
                      <div className="btn-plus"><p draggable="false">{item.level}</p></div>
                      <div className="target-name"><p> {this.props.currentUsername === item.username ?
                        <CloseCircleOutlined onClick={() => this.onDelete(item.skillId)} /> : item.title} </p>
                      </div>
                    </div>)
                })}
              </div>
            </div>
            <div>
              <br></br><br></br>
              {frameworkData.length !== 0 ? <h4>Framework</h4> : null}
              <div className="skill-box">
                {frameworkData && frameworkData.map((item) => {
                  return (
                    <div key={item.skillId} className="skill-pic">
                      <img src={item.skillImage.fileUri} alt="" />
                      <div className="darkness"></div>
                      <div className="btn-plus"><p draggable="false">{item.level}</p></div>
                      <div className="target-name"><p> {this.props.currentUsername === item.username ?
                        <CloseCircleOutlined onClick={() => this.onDelete(item.skillId)} /> : item.title} </p>
                      </div>
                    </div>)
                })}
              </div>
            </div>
            <div>
              <br></br><br></br>
              {databaseData.length !== 0 ? <h4>Database</h4> : null}
              <div className="skill-box">
                {databaseData && databaseData.map((item) => {
                  return (
                    <div className="skill-pic">
                      <img src={item.skillImage.fileUri} alt="" />
                      <div className="darkness"></div>
                      <div className="btn-plus"><p draggable="false">{item.level}</p></div>
                      <div className="target-name"><p> {this.props.currentUsername === item.username ?
                        <CloseCircleOutlined onClick={() => this.onDelete(item.skillId)} /> : item.title} </p>
                      </div>
                    </div>)
                })}
              </div>
            </div>
            <div>
              <br></br><br></br>
              {systemData.length !== 0 ? <h4>System</h4> : null}
              <div className="skill-box">
                {systemData && systemData.map((item) => {
                  return (
                    <div className="skill-pic">
                      <img src={item.skillImage.fileUri} alt="" />
                      <div className="darkness"></div>
                      <div className="btn-plus"><p draggable="false">{item.level}</p></div>
                      <div className="target-name"><p> {this.props.currentUsername === item.username ?
                        <CloseCircleOutlined onClick={() => this.onDelete(item.skillId)} /> : item.title} </p>
                      </div>
                    </div>)
                })}
              </div>
            </div>
            <div>
              <br></br><br></br>
              {managingData.length !== 0 ? <h4>Managing</h4> : null}
              <div className="skill-box">
                {managingData && managingData.map((item) => {
                  return (
                    <div className="skill-pic">
                      <img src={item.skillImage.fileUri} alt="" />
                      <div className="darkness"></div>
                      <div className="btn-plus"><p draggable="false">{item.level}</p></div>
                      <div className="target-name"><p> {this.props.currentUsername === item.username ?
                        <CloseCircleOutlined onClick={() => this.onDelete(item.skillId)} /> : item.title} </p>
                      </div>
                    </div>)
                })}
              </div>
            </div>
          </div>
          <div className="nine columns main-col">
          </div>
        </div>
      </section>
    );
  }
}
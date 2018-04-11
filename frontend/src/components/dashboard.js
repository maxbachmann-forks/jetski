import React, { Component } from 'react';

import PageHeader from './page_header';
import GuildsTable from './guilds_table';
import {globalState} from '../state';


class DashboardGuildsList extends Component {
  constructor() {
    super();
    this.state = {guilds: null};
  }

  componentWillMount() {
    globalState.getCurrentUser().then((user) => {
      user.getGuilds().then((guilds) => {
        this.setState({guilds});
      });
    });
  }

  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          Guilds
        </div>
        <div className="panel-body">
          <GuildsTable guilds={this.state.guilds}/>
        </div>
      </div>
    );
  }
}

class ControlPanel extends Component {
  constructor() {
    super();

    this.messageTimer = null;

    this.state = {
      guilds: null,
      message: null,
    };
  }

  componentWillMount() {
    globalState.getCurrentUser().then((user) => {
      user.getGuilds().then((guilds) => {
        this.setState({guilds});
      });
    });
  }

  onDeploy() {
    globalState.deploy().then(() => {
      this.renderMessage('success', 'Deploy Started');
    }).catch((err) => {
      this.renderMessage('danger', `Deploy Failed: ${err}`);
    });
  }

  renderMessage(type, contents) {
    this.setState({
      message: {
        type: type,
        contents: contents,
      }
    })

    if (this.messageTimer) clearTimeout(this.messageTimer);

    this.messageTimer = setTimeout(() => {
      this.setState({
        message: null,
      });
      this.messageTimer = null;
    }, 5000);
  }

  render() {
    return (
      <div className="panel panel-default">
        {this.state.message && <div className={"alert alert-" + this.state.message.type}>{this.state.message.contents}</div>}
        <div className="panel-heading">
          <i className="fa fa-cog fa-fw"></i> Control Panel
        </div>
        <div className="panel-body">
        <a href="#" onClick={() => this.onSave()} className="btn btn-success btn-block">Deploy</a>
        </div>
      </div>
    );
  }
}

class StatsPanel extends Component {
  render () {
    const panelClass = `panel panel-${this.props.color}`;
    const iconClass = `fa fa-${this.props.icon} fa-5x`;

    return (
      <div className="col-lg-3 col-md-6">
        <div className={panelClass}>
          <div className="panel-heading">
            <div className="row">
              <div className="col-xs-3">
                <i className={iconClass}></i>
              </div>
              <div className="col-xs-9 text-right">
                <div className="huge">{this.props.data || 'N/A'}</div>
                <div>{this.props.text}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class Stats extends Component {
  constructor() {
    super();
  //   this.getStuff();
  // }

  // async getStuff() {
  //   await globalState.getCurrentUser();
  //   await globalState.getStats();
  }

  getStats() {
    let statsPanels = [];
    if (globalState.user.admin) {
      globalState.getStats((stats) => {
        // statsPanels.push(
        //     <StatsPanel color='primary' icon='comments' data={stats.messages} text='Messages' key='messages' />
        // );
        // statsPanels.push(
        //     <StatsPanel color='green' icon='server' data={stats.guilds} text='Guilds' key='guilds' />
        // );
        // statsPanels.push(
        //     <StatsPanel color='yellow' icon='user' data={stats.users} text='Users' key='users' />
        // );
        // statsPanels.push(
        //     <StatsPanel color='red' icon='hashtag' data={stats.channels} text='Channels' key='channels' />
        // );
        statsPanels.push(stats);
      });
    }
    return statsPanels;
  }

  render() {
    let panels = this.getStats();
    console.log(panels);

    let renderPanels = [];
    for (let panel in panels[0]) {
      renderPanels.push(<StatsPanel color='primary' icon='comments' data={panels[0][panel]} text='Messages' key='messages' />);
    }
    console.log(renderPanels)

    return (
      <div>
        {renderPanels}
      </div>
    );
  }
}

class Dashboard extends Component {
  render() {
    let parts = [];

    parts.push(
      <PageHeader name="Dashboard" />
    );

    parts.push(
      <div className="row">
        <Stats />
      </div>
    );

    parts.push(
      <div className="row">
        <div className="col-lg-8">
          <DashboardGuildsList />
        </div>
        {
          globalState.user && globalState.user.admin &&
          <div className="col-lg-4"> 
            <ControlPanel />
          </div>
        }
      );
    }

		return (
      <div>
        {parts}
      </div>
    );
  }
}

export default Dashboard;

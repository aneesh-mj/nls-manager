import "@babel/polyfill";
import React, { Component } from 'react';
import './App.css';

import { NlsProvider } from "./AppContext";
import Directory from "./Directory";

class App extends Component {

  state = {
    directory: {},
    number: 0,
    inc: () => {
      this.setState({ number: this.state.number + 1 })
    }
  }

  getDirectory = async () => {
    const response = await fetch('/api/files');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message)
    }
    return body;
  };

  componentDidMount() {
    this.getDirectory()
      .then(res => {
        // debugger
        this.setState({ directory: res })
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <NlsProvider value={this.state}>
        <div className="bodyContainer">
          <div className="header"></div>
          <div className="middle">
            <div className="left">
              <Directory />
            </div>
            <div className="right"></div>
          </div>
          <div className="footer">

          </div>
        </div>
      </NlsProvider>
    );
  }
}

export default App;

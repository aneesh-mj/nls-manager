import "@babel/polyfill";
import React, { Component } from 'react';
import './App.css';

import { NlsProvider } from "./AppContext";
import Directory from "./Directory";
import FileViewer from "./FileViewer";

class App extends Component {

  state = {
    directory: {},
    setSelectedFilePath: (file) => {
      this.setState({ selectedFilePath: file })
    },
    setSelectedFileName: (file) => {
      this.setState({ selectedFileName: file })
    },
    selectedFilePath: "",
    selectedFileName: ""
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
            <div className="right">
              <FileViewer />
            </div>
          </div>
          <div className="footer">

          </div>
        </div>
      </NlsProvider>
    );
  }
}

export default App;

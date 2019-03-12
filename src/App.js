import "@babel/polyfill";
import React, { Component } from 'react';
import './App.css';

import { NlsProvider } from "./AppContext";
import Directory from "./Directory";
import FileViewer from "./FileViewer";
import Languages from "./Languages";

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
    selectedFileName: "",
    langs: [],
    keyInfo: {
      key: "",
      item: {}
    },
    setKeyInfo: (keyInfo) => {
      this.setState({ keyInfo })
    },
    keyInfoStatus: false,
    setKeyInfoStatus: (keyInfoStatus) => {
      this.setState({ keyInfoStatus })
    },
  }

  getContextFromAPI = async (url) => {
    const response = await fetch(url);
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message)
    }
    return body;
  };

  setContextFromAPI = (url, prop) => {
    this.getContextFromAPI(url)
      .then(res => {
        this.setState({ [prop]: res })
      })
      .catch(err => console.log(err));

  }


  // getDirectory = async () => {
  //   const response = await fetch('/api/files');
  //   const body = await response.json();

  //   if (response.status !== 200) {
  //     throw Error(body.message)
  //   }
  //   return body;
  // };

  componentDidMount() {
    this.setContextFromAPI('/api/files', 'directory');
    this.setContextFromAPI('/api/langs', 'langs');
  }

  render() {
    return (
      <NlsProvider value={this.state}>
        <div className="bodyContainer">
          <div className="header">
            <div className='ciscoLogo'>
              Cisco DNA Center
            </div>
          </div>
          <div className="middle">
            <div className="left">
              <Languages />
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

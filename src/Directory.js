import React, { Component } from 'react';
import { NlsConsumer } from "./AppContext";

class DirectoryList extends Component {

    _context = {};

    componentWillReceiveProps(n, old) {
        console.log(n, this._context);
        this._context = n;
    }

    onFileClick = (evt) => {
        const { context } = this.props;
        const fileName = evt.target.getAttribute("data-filename");
        if (context.selectedFile !== fileName) {
            context.setSelectedFile(fileName);
        }

        // debugger
        // const {file} = evt.target
    }

    renderFileList(obj, key) {
        const keys = Object.keys(obj);
        if (keys && keys.length) {
            const engFile = keys.filter((key) => {
                return key === "nls";
            });
            console.log("engFileengFile", engFile);
            const fileNames = [...obj[engFile]].map((filename) => {
                return filename.split('/').pop();
            });
            console.log("fileNamesfileNames", fileNames);
            return fileNames.map((file, i) => {
                return <span key={i} className="filename" onClick={this.onFileClick} data-filename={obj['nls'][i]}>{file}</span>
            });
        }
        else {

        }
    }

    renderHeader() {
        const { context } = this.props;
        const keys = Object.keys(context.directory);
        if (keys && keys.length) {
            return keys.map((key) => {
                return <div>
                    <h4 key={key}>{key}</h4>
                    {this.renderFileList(context.directory[key], key)}
                </div>
            });
        }
        else {
            return <span>loading...</span>;
        }
    }

    render() {
        return (
            <div>
                {this.renderHeader()}
            </div>
        );
    }
};

class Directory extends Component {

    render() {
        return (
            <NlsConsumer>
                {
                    context => {
                        return <DirectoryList context={context} />
                    }
                }
            </NlsConsumer>
        );
    }

}

export default Directory;
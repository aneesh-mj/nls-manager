import React, { Component } from 'react';
import { NlsConsumer } from "./AppContext";

class DirectoryList extends Component {

    _selected = document.createElement('span');

    _context = {};

    componentWillReceiveProps(n, old) {
        this._context = n;
    }

    onFileClick = (evt) => {
        const { context } = this.props;
        const filePath = evt.target.getAttribute("data-filepath");
        const fileName = evt.target.getAttribute("data-file");
        if (context.selectedFilePath !== filePath) {
            context.setSelectedFilePath(filePath);
        }
        if (context.selectedFileName !== fileName) {
            context.setSelectedFileName(fileName);
        }
        if (!evt.target.isEqualNode(this._selected)) {
            if (this._selected) {
                this._selected.classList.remove('selected');
            }
            evt.target.classList.add('selected');
            this._selected = evt.target;
        }
    }

    renderFileList(obj, key) {
        const keys = Object.keys(obj);
        if (keys && keys.length) {
            const engFile = keys.filter((key) => {
                return key === "nls";
            });
            const fileNames = [...obj[engFile]].map((filename) => {
                return filename.split('/').pop();
            });
            return fileNames.map((file, i) => {
                return <span key={i} className="filename" onClick={this.onFileClick} data-filepath={obj['nls'][i]} data-file={key}>{file}</span>
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
                return <div key={key}>
                    <h4>{key}</h4>
                    {this.renderFileList(context.directory[key], key)}
                </div>
            });
        }
        else {
            return <span>loading...</span>;
        }
    }

    render() {
        const basePlugin = this.props.context.pluginName;
        console.log("basePlugin", basePlugin);
        return (
            <React.Fragment>
                <div className="pluginName">{basePlugin}</div>
                <div className='directoryList'>
                    {this.renderHeader()}
                </div>
            </React.Fragment>
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
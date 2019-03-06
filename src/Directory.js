import React, { Component } from 'react';

import { NlsConsumer } from "./AppContext";

/*
const DirectortList = (context) => {
    console.log(context);
    const keys = Object.keys(context.directory);
    console.log("keys", keys)
    if (keys && keys.length) {
        return keys.map((key) => {
            return <h4>{key}</h4>
        });
    }
    else {
        return <span>loading...</span>;
    }
}*/

class DirectortList extends Component {

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
                return <span key={i} className="filename">{file}</span>
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
                        return <DirectortList context={context} />
                    }
                }
            </NlsConsumer>
        );
    }

}

export default Directory;
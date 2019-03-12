import React, { Component, Fragment } from 'react';
import { NlsConsumer } from "./AppContext";
import I18nKeyList from "./I18nKeyList";
//import requirejs from  'requirejs';

class FileView extends Component {

    context = {};

    langs = [];

    otherlangs = [];

    state = {
        selectedFileName: "",
        modules: null,
        selectedFilePath: ""
    }

    componentWillReceiveProps(newProps, oldProps) {
        this.renderFile(newProps.context);
    }

    renderFile(context) {
        const { selectedFileName, selectedFilePath, langs } = context;
        console.log("selectedFilePathselectedFilePath", selectedFilePath);
        this.otherlangs = langs;
        if (selectedFilePath !== this.state.selectedFilePath) {

            const selectedFilePaths = langs.map(lang => {
                const regex = new RegExp('/nls/');
                const newPath = selectedFilePath.replace(regex, `/nls/${lang}/`);
                return import(`${newPath}`);
            });

            selectedFilePaths.unshift(import(`${selectedFilePath}`));
            Promise.all(selectedFilePaths)
                .then((modules) => {
                    const _modules = {};
                    let _langs = ["en", ...langs];
                    modules.map((module, i) => {
                        _modules[_langs[i]] = module.default.root || module;
                    });

                    this.setState({
                        selectedFileName,
                        modules: _modules,
                        selectedFilePath
                    });
                });
        }
    }

    render() {
        const { context } = this.props;
        const { modules } = this.state;
        return (
            <React.Fragment>
                {module ?
                    <I18nKeyList modules={modules} langs={this.otherlangs} selectedFilePath={this.state.selectedFilePath} /> : null}
            </React.Fragment>
        );
    }
}

class FileViewer extends Component {

    render() {
        return (

            <NlsConsumer>
                {
                    context => {
                        return <FileView context={context} />
                    }
                }
            </NlsConsumer>
        );
    }
}
export default FileViewer;
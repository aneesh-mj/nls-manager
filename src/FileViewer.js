import React, { Component, Fragment } from 'react';
import { NlsConsumer } from "./AppContext";
import I18nKeyList from "./I18nKeyList";
//import requirejs from  'requirejs';

class FileViewer extends Component {

    langs = [];

    otherlangs = [];

    state = {
        selectedFileName: "",
        module: null
    }

    static getDerivedStateFromProps(newProps, state) {
        // console.log("getDerivedStateFromProps", newProps, state);
        //console.log("requirejs", requirejs);


    }

    componentWillMount() {
        console.log("componentWillMountcomponentWillMountcomponentWillMount");
    }

    renderFile(context) {
        const { selectedFileName, selectedFilePath, langs } = context;
        this.otherlangs = langs;
        if (selectedFileName !== this.state.selectedFileName) {
            console.log(`${selectedFilePath}`, langs);
            const selectedFilePath1 = `./mashup/ui-plugins/inventory/app/inventory/src/nls/i18_inventory.js`;

            const selectedFilePaths = langs.map(lang => {
                const regex = new RegExp('/nls/');
                const newPath = selectedFilePath.replace(regex, `/nls/${lang}/`);
                console.log("newPathnewPath", newPath);
                //return selectedFilePath.replace(regex, `/${lang}/`);
                return import(`${newPath}`);
            });

            console.log(selectedFilePaths);

            selectedFilePaths.unshift(import(`${selectedFilePath}`));

            // Promise.all([
            //     import(`${selectedFilePath}`)
            // ])
            Promise.all(selectedFilePaths)
                .then(([module, module2, module3, module4]) => {
                    console.log("module1111", module, module2, module3, module4);
                    /* window.module = module;
                     if (!this.langs.length) {
                         this.langs = Object.keys(module);
                         this.otherlangs = this.langs.filter(lang => {
                             return lang !== "root" && lang !== "default";
                         });
                     }*/
                    this.setState({
                        selectedFileName,
                        module
                    });
                });
        }
    }

    render() {
        const { module } = this.state;
        return (
            <React.Fragment>
                <NlsConsumer>
                    {
                        context => {
                            return this.renderFile(context)
                        }
                    }
                </NlsConsumer>
                {module ?
                    <I18nKeyList module={module} langs={this.otherlangs} /> : null}

            </React.Fragment>

        );
    }
}
export default FileViewer;
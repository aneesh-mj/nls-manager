import React, { Component, Fragment } from 'react';
import { NlsConsumer } from "./AppContext";
import I18nKeyList from "./I18nKeyList";
//import requirejs from  'requirejs';

class FileViewer extends Component {

    langs = [];

    otherlangs = [];

    state = {
        selectedFileName: "",
        modules: null
    }

    // static getDerivedStateFromProps(newProps, state) {
    //     // console.log("getDerivedStateFromProps", newProps, state);
    //     //console.log("requirejs", requirejs);


    // }

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
                .then((modules) => {
                    console.log("module1111", modules);
                    /* window.module = module;
                     if (!this.langs.length) {
                         this.langs = Object.keys(module);
                         this.otherlangs = this.langs.filter(lang => {
                             return lang !== "root" && lang !== "default";
                         });
                     }*/
                    const _modules = {};
                    let _langs = ["en", ...langs];
                    modules.map((module, i) => {
                        _modules[_langs[i]] = module.default.root || module;
                    });

                    console.log("_modules", _modules);

                    this.setState({
                        selectedFileName,
                        modules: _modules
                    });
                });
        }
    }

    render() {
        const { modules } = this.state;
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
                    <I18nKeyList modules={modules} langs={this.otherlangs} /> : null}

            </React.Fragment>

        );
    }
}
export default FileViewer;
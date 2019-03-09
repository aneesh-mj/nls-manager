import React, { Component, Fragment } from 'react';
import { NlsConsumer } from "./AppContext";
import I18nKey from "./I18nKey";
//import requirejs from  'requirejs';

class FileViewer extends Component {

    state = {
        selectedFileName: "",
        module: null
    }

    static getDerivedStateFromProps(newProps, state) {
        // console.log("getDerivedStateFromProps", newProps, state);
        //console.log("requirejs", requirejs);


    }

    renderFile(context) {
        const { selectedFileName, selectedFilePath } = context;
        debugger
        if (selectedFileName !== this.state.selectedFileName) {
            //console.log(`${selectedFile}`);
            //console.log(`../../mashup/ui-plugins/inventory/app/inventory/src/nls/i18_inventory.js`);
            //let xx = `../../mashup/ui-plugins/inventory/app/inventory/src/nls/i18_inventory.js`;
            //const xx = `/* webpackMode: "eager" */ amdi18n-loader!../${selectedFile}`;
            //const xx = `amdi18n-loader!../../mashup/ui-plugins/nls/i18_design.js`;
            // import(`amdi18n-loader!../../mashup/ui-plugins/inventory/app/inventory/src/nls/i18_inventory.js`)
            //import('amdi18n-loader!../../' + selectedFile)
            // let xx = './nls/i18_design.js';
            // let xx = './test.js';
            // let xx = `./mashup/ui-plugins/design/app/design/src/nls/i18_design.js`;
            //let xx = selectedFile.substr(1);
            console.log(`${selectedFilePath}`);
            //let xx = `../../ui-plugins/design/app/design/src/nls/i18_design.js`;
            //let xx = `../../${selectedFile}`;
            // import(`${selectedFile}`)
            // let xx = 'amdi18n-loader!./mashup/ui-plugins/design/app/design/src/nls/i18_design.js';
            //import(`${xx}`)
            // .then((module) => {
            //     // Do something with the module.
            //     console.log("module", module);

            //     this.setState({
            //         selectedFile,
            //         module
            //     });


            // });

            Promise.all([
                import(`${selectedFilePath}`)
            ])
                .then(([module, module2, module3]) => {
                    console.log("module", module);

                    this.setState({
                        selectedFileName,
                        module
                    });
                });
        }


        // return <div className="fileViewer">
        //     {context.selectedFile}

        // </div>
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
                    <I18nKey keyList={module.default.root} /> : null}

            </React.Fragment>

        );
    }
}
export default FileViewer;
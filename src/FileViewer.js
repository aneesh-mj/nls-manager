import React, { Component } from 'react';
import { NlsConsumer } from "./AppContext";
//import requirejs from  'requirejs';

class FileViewer extends Component {



    static getDerivedStateFromProps(newProps, state) {
        // console.log("getDerivedStateFromProps", newProps, state);
        //console.log("requirejs", requirejs);


    }

    renderFile(context) {
        const { selectedFile } = context;
        if (selectedFile) {
            console.log(`${selectedFile}`);
            //console.log(`../../mashup/ui-plugins/inventory/app/inventory/src/nls/i18_inventory.js`);
            //let xx = `../../mashup/ui-plugins/inventory/app/inventory/src/nls/i18_inventory.js`;
            //const xx = `/* webpackMode: "eager" */ amdi18n-loader!../${selectedFile}`;
            //const xx = `amdi18n-loader!../../mashup/ui-plugins/nls/i18_design.js`;
            // import(`amdi18n-loader!../../mashup/ui-plugins/inventory/app/inventory/src/nls/i18_inventory.js`)
            //import('amdi18n-loader!../../' + selectedFile)
            // let xx = './nls/i18_design.js';
            // let xx = './test.js';
            //let xx = `./mashup/ui-plugins/design/app/design/src/nls/i18_design.js`;
            let xx = selectedFile.substr(1);
            import(`${xx}`)
                .then((module) => {
                    // Do something with the module.
                    console.log("module", module)
                });
        }


        return <div className="fileViewer">
            {context.selectedFile}

        </div>
    }

    render() {

        return (
            <NlsConsumer>
                {
                    context => {
                        return this.renderFile(context)
                    }
                }
            </NlsConsumer>

        );
    }
}
export default FileViewer;
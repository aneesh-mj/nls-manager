import React, { Component } from 'react';
import { NlsConsumer } from "./AppContext";
// import requirejs from  'requirejs';

class FileViewer extends Component {



    static getDerivedStateFromProps(newProps, state) {
       // console.log("getDerivedStateFromProps", newProps, state);
        //console.log("requirejs", requirejs);

        import('amdi18n-loader!./nls/i18_design')
            .then((module) => {
                // Do something with the module.
                console.log("module", module)
            });
    }

    render() {

        return (
            <NlsConsumer>
                {
                    context => {
                        return <div className="fileViewer">
                            {context.selectedFile}
                        </div>
                    }
                }
            </NlsConsumer>

        );
    }
}
export default FileViewer;
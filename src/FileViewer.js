import React, { Component } from 'react';
import { NlsConsumer } from "./AppContext";

class FileViewer extends Component {

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
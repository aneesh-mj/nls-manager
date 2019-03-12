import React, { Component, Fragment } from 'react';
import { NlsConsumer } from "./AppContext";

class InfoItem extends Component {

    render() {
        const { lang, value, nlsKey } = this.props;
        return (
            <div className='key-lang'>
                <span className='lang'>{lang}</span>
                <textarea id={`${nlsKey}_${lang}`} rows={4} value={value}></textarea>
            </div>
        );
    }
}

class Info extends Component {

    render() {
        const { context } = this.props;
        const { keyInfo } = context;
        const { key, item } = keyInfo;
        return (
            <React.Fragment>
                <div className='key'><span>key: </span>{key}</div>
                {
                    Object.keys(item).map(lang => {
                        return <InfoItem key={lang} lang={lang} value={item[lang]} nlsKey={key} />
                    })
                }
            </React.Fragment>
        );
    }
}



class KeysInfo extends Component {

    render() {

        return (
            <NlsConsumer>
                {
                    context => {
                        return <Info context={context} />
                    }
                }
            </NlsConsumer>
        );
    }
}

export default KeysInfo;

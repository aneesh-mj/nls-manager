import React, { Component, Fragment } from 'react';
import KeysInfo from "./KeysInfo";


class I18nKey extends Component {

    componentWillReceiveProps(nProps) {
        // console.log(nProps);
    }

    onClick = () => {
        const { langs } = this.props;

        console.log(langs);
    }

    render() {
        const { item, langs } = this.props;
        return (
            <div className='keyItem' onClick={this.onClick}>
                {item}
            </div>
        );
    }

}

class I18nKeyList extends Component {

    render() {
        const { modules, langs } = this.props;
        const keyList = modules ? modules.en : {};
        return (
            <React.Fragment>
                <div className='keyList'>
                    {Object.keys(keyList).map(keyy => {
                        return <I18nKey item={keyList[keyy]} langs={langs} />
                    })}
                </div>
                <div className="keyDetails">
                    <KeysInfo />
                </div>
            </React.Fragment>
        );
    }

}

export default I18nKeyList;
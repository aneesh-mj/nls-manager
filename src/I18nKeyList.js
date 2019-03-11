import React, { Component, Fragment } from 'react';
import KeysInfo from "./KeysInfo";


class I18nKey extends Component {

    state = {
        key: null,
        item: {}
    }

    componentWillReceiveProps(nProps) {
        // console.log(nProps);
    }

    onClick = () => {
        const { item, modules } = this.props;

        const _item = {};

        Object.keys(modules).map(module => {
            _item[module] = modules[module][item];
        });

        this.setState({
            key: item,
            item: _item
        });

        console.log(this.state);
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
                        return <I18nKey item={keyy} modules={modules} />
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
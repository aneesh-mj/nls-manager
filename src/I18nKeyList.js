import React, { Component, Fragment } from 'react';
import KeysInfo from "./KeysInfo";
import { NlsConsumer } from "./AppContext";


class I18nKey extends Component {

    state = {
        key: null,
        item: {}
    }

    componentWillReceiveProps(nProps) {
        // console.log(nProps);
    }

    onClick = (context) => {
        const { item, modules } = this.props;

        const _item = {};

        Object.keys(modules).map(module => {
            _item[module] = modules[module][item];
        });

        // this.setState({
        //     key: item,
        //     item: _item
        // });

        console.log(this.state);

        context.setKeyInfo({
            key: item,
            item: _item
        });
    }

    render() {
        const { item, modules } = this.props;
        const val = modules.en[item];
        return (
            <NlsConsumer>
                {
                    context => {
                        return <div className='keyItem' onClick={(evt) => {
                            this.onClick(context);
                        }}>{val}</div>
                    }
                }
            </NlsConsumer>
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
import React, { Component, Fragment } from 'react';
import KeysInfo from "./KeysInfo";
import NewKey from "./NewKey";
import { NlsConsumer } from "./AppContext";


class I18nKey extends Component {



    state = {
        key: null,
        item: {}
    }

    componentWillReceiveProps(nProps) {
        // console.log(nProps);
    }

    onClick = (evt, context) => {
        const { item, modules, onKeyClick } = this.props;

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

        if (onKeyClick) {
            onKeyClick(evt, context);
        }
    }

    render() {
        const { item, modules } = this.props;
        const val = modules.en[item];
        return (
            <NlsConsumer>
                {
                    context => {
                        return <div className='keyItem' onClick={(evt) => {
                            this.onClick(evt, context);
                        }}>{val}</div>
                    }
                }
            </NlsConsumer>
        );
    }

}

class I18nKeyList extends Component {

    _selected = document.createElement('span');

    state = {
        add: false
    }

    addNewKey = () => {
        this.setState({
            add: true
        });
    }

    onKeyClick = (evt) => {
        this.setState({
            add: false
        });
        if (!evt.target.isEqualNode(this._selected)) {
            if (this._selected) {
                this._selected.classList.remove('selected');
            }
            evt.target.classList.add('selected');
            this._selected = evt.target;
        }
    }

    render() {
        const { modules, langs } = this.props;
        const keyList = modules ? modules.en : {};
        const type = this.state.add ? "add" : "edit";
        return (
            <React.Fragment>
                <div className='keyList'>
                    <div className='actionHeader'>
                        <span onClick={this.addNewKey} className='addNewKey'>Add new key</span>
                    </div>
                    {Object.keys(keyList).map((keyy, i) => {
                        return <I18nKey key={i} item={keyy} modules={modules} onKeyClick={this.onKeyClick} />
                    })}
                </div>
                <div className="keyDetails">
                    {this.state.add ? <NewKey /> : <KeysInfo />}

                </div>
            </React.Fragment>
        );
    }

}

export default I18nKeyList;
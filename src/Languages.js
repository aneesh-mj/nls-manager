import React, { Component } from 'react';
import { NlsConsumer } from "./AppContext";

class Lang extends Component {

    state = {
        add: false
    }

    addNewLang = () => {
        this.setState({
            add: true
        });
    }

    render() {
        const { context } = this.props;
        const { langs } = context;
        return (
            <div className='langSect'>
                <div className='langHeader'>Languages</div>
                <div className='langs'>
                    {langs.map(lang => {
                        return <div key={lang} className="lang">{lang}</div>
                    })}
                </div>
                <div className='addNewLang'>
                    <div className='addLink' onClick={this.addNewLang}>Add new language</div>
                    {this.state.add ? (
                        <div className='newLang'>ddd</div>
                    ) : null}
                </div>
            </div>
        );
    }
}

class Languages extends Component {



    render() {
        return (
            <NlsConsumer>
                {
                    context => {
                        return <Lang context={context} />
                    }
                }
            </NlsConsumer>
        );
    }
}

export default Languages;
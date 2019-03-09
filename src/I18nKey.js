import React, { Component, Fragment } from 'react';



class I18nKey extends Component {

    render() {
        const { item } = this.props;
        return (
            <div className='keyItem'>
                {item}
            </div>
        );
    }

}

class I18nKeyList extends Component {

    render() {
        const { keyList } = this.props;
        return (
            <React.Fragment>
                <div className='keyList'>
                    {Object.keys(keyList).map(keyy => {
                        return <I18nKey item={keyList[keyy]} />
                    })}
                </div>
                <div className="keyDetails"></div>
            </React.Fragment>
        );
    }

}

export default I18nKeyList;
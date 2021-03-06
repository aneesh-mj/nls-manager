import React, { Component, Fragment } from 'react';
import { NlsConsumer } from "./AppContext";
import $ from "jquery";

class NewKey extends Component {

    state = {
        val: ""
    }

    onChange = (evt) => {
        const val = evt.target.value;
        this.setState({
            val
        });
    }

    onClick = () => {
        // const key = `nls_${new Date().valueOf()}`;
        // const value = this.state.val;
        const { selectedFilePath, modules } = this.props;
        $.ajax({
            url: '/api/createNewKey',
            method: "POST",
            data: JSON.stringify({
                selectedFilePath,
                modules,
                nlskey: `nls_${new Date().valueOf()}`,
                val: this.state.val
            }),
            contentType: "application/json"
        })
            .done(function (data) {
                console.log("createNewKey", data);
            });

    }

    componentWillReceiveProps(newProps) {
        console.log(newProps);
    }

    render() {
        const { val } = this.state;
        return (
            <div className='new-lang'>
                <span className='lang'>en</span>
                <textarea id="new_lang" rows={4} value={val} onChange={this.onChange}></textarea>

                <span className='create-new-btn' onClick={this.onClick}>Create</span>
            </div>
        );
    }
}

export default NewKey;
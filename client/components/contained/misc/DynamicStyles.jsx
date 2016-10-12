import React from "react";

export default class DynamicStyles extends React.Component {
	
    constructor(props) {
        super(props);

        this.state = { styles: "" };
    }

    componentDidMount() {
        if (this.props.beforeApp) {
            this.setState({ styles: this._generateStylesBefore() });
        }
        else {
            this.setState({ styles: this._generateStylesAfter() });
        }
    }

    _generateStylesBefore() {
        return `
            #content {${
                this._isPhoneGap() && this._isIOS()
                ? "padding-top: 20px;" : ""
            }}
            .explorer, .status-bar, .document-head, .document-note, .modal {${
                this._isPhoneGap() && this._isIOS()
                ? "font-size: 135%;" : ""
            }}
        `;
    }

    _generateStylesAfter() {
        return `
            .explorer {
                height: ${
                    document.body.scrollHeight
                    - document.querySelector(".status-bar").scrollHeight
                    - (this._isPhoneGap() && this._isIOS() ? 20 : 0)
                }px;
            }
        `;
    }

    _isPhoneGap() {
        return localStorage.getItem("isPhoneGap") == "true";
    }

    _isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

	render() {
		return <style>{this.state.styles}</style>;
	}

}
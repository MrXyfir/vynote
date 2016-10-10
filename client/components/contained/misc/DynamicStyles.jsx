import React from "react";

export default class DynamicStyles extends React.Component {
	
    constructor(props) {
        super(props);

        this.state = { styles: "" };
    }

    componentDidMount() {
        this.setState({ styles: this._generateStyles() });
    }

    _generateStyles() {
        return `
            #content {${
                this._isPhoneGap() && this._isIOS()
                ? "padding-top: 20px;" : ""
            }}
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
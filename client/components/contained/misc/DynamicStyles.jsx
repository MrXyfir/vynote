import React from "react";

export default class DynamicStyles extends React.Component {
	
    constructor(props) {
        super(props);

        this.state = { styles: "" };
    }

    componentDidMount() {
        if (this.props.beforeApp) {
            document.getElementsByName("viewport")[0].setAttribute(
                "content",
                `‌​user-scalable=no, initial-scale=${
                    (1 / window.devicePixelRatio)
                }, minimum-scale=0.2, maximum-scale=2, width=device-width`
            );

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
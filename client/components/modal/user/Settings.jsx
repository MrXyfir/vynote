import React from "react";

// Components
import Shortcuts from "./settings/Shortcuts";
import Config from "./settings/Config";

export default class Settings extends React.Component {

	constructor(props) {
		super(props);

        this.state = { tab: "config" };
	}
	
	render() {
        return (
			<div className="settings">
                <nav className="navbar">
                    <a
                        onClick={() => this.setState({ tab: "config" })}
                    >Config</a>
                    <a
                        onClick={() => this.setState({ tab: "shortcuts" })}
                    >Shortcuts</a>
                </nav>

                {Date.now() > this.props.data.user.subscription ? (
                    <span>
                        <span className="icon-info" />
                        Only premium members can modify their configuration and create shortcuts.
                    </span>
                ) : (
                    <span />
                )}

                <section>{
                    this.state.tab == "config" ? (
                        <Config {...this.props} />
                    ) : (
                        <Shortcuts {...this.props} />
                    )
                }</section>
			</div>
		);
	}

}
import React from "react";

// Action creators
import {
    setSearchQuery, setFlags, toggleShowFlagFilter
} from "../../../actions/documents/note";

// Constants
import flags from "../../../constants/flags";

export default class FilterControls extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.onToggleShowFlagFilter = this.onToggleShowFlagFilter.bind(this);
        this.onSetFlags = this.onSetFlags.bind(this);
        this.onSearch = this.onSearch.bind(this);
    }
    
    onToggleShowFlagFilter() {
        this.props.dispatch(toggleShowFlagFilter());
    }
    
    onSetFlags() {
        let showFlags = [];
        
        flags.forEach((flag, i) => {
            if (this.refs[`flag-${i}`].checked)
                showFlags.push(i);
        });
        
        this.props.dispatch(setFlags(showFlags));
    }
    
    onSearch(e) {
        if (e.target.value.length > 3 || e.target.value == "") {
            this.props.dispatch(setSearchQuery(
                e.target.value
            ));
        }
    }
    
    render() {
        return (
            <div className="note-filter-controls">
                <input type="text" placeholder="Search" onChange={this.onSearch} />
                <a onClick={this.onToggleShowFlagFilter}>Filter by Flags</a>
                
                {
                    this.props.data.render.showFlagFilter
                    ? (
                        <div className="flag-filters">
                            {flags.map((flag, i) => {
                                return (
                                    <div className="flag">
                                        <input
                                            ref={`flag-${i}`}
                                            type="checkbox" 
                                            defaultChecked={
                                                this.props.data.render.filter.flags.indexOf(i) > -1
                                            }
                                        />
                                        <span>{flag}</span>
                                    </div>
                                );
                            })}
                            
                            <button onClick={this.props.onSetFlags} className="btn-primary btn-sm">
                                Update Flags
                            </button>
                        </div>
                    )
                    : (
                        <div className="hidden" />
                    )
                }
            </div>
        );
    }
    
}
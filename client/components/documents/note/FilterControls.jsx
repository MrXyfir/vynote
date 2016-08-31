import React from "react";

// Action creators
import {
    setSearchQuery, setFlags, toggleShowFlagFilter
} from "actions/documents/note";

// Constants
import flags from "constants/flags";

export default class FilterControls extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.onToggleShowFlagFilter = this.onToggleShowFlagFilter.bind(this);
        this.onSearch = this.onSearch.bind(this);
    }
    
    onToggleShowFlagFilter() {
        // Update flags if user is closing flag filter
        if (this.props.data.render.showFlagFilter) {
            let showFlags = [];
        
            flags.forEach((flag, i) => {
                if (this.refs[`flag-${i}`].checked)
                    showFlags.push(i);
            });
            
            this.props.dispatch(setFlags(showFlags));
        }
        
        this.props.dispatch(toggleShowFlagFilter());
    }
    
    onSearch(e) {
        if (e.target.value.length > 3 || e.target.value == "") {
            this.props.dispatch(setSearchQuery(
                e.target.value.toLowerCase()
            ));
        }
    }
    
    render() {
        return (
            <div className="note-filter-controls">
                <input type="text" placeholder="Search" onChange={this.onSearch} />
                <button onClick={this.onToggleShowFlagFilter} className="btn-sm btn-secondary">
                    Hide by Flags
                </button>
                
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
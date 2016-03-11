import React from "react";

export default class FilterControls extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.onOpenFlagFilter = this.onOpenFlagFilter.bind(this);
        this.onSearch = this.onSearch.bind(this);
    }
    
    onOpenFlagFilter() {
        
    }
    
    onSearch() {
        
    }
    
    render() {
        return (
            <div className="note-filter-controls">
                <input type="text" placeholder="Search" onChange={this.onSearch} />
                <a onClick={this.onOpenFlagFilter}>Filter by Flags</a>
            </div>
        );
    }
    
}
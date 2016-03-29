import React from "react";

// Modules
import scopeParents from "../../../lib/explorer/scope-parents";

export default class DocumentFinder extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.state = { search: "", selected: 0 };
        
        this.onInput = this.onInput.bind(this);
    }
    
    onInput(e) {
        this.setState({ search: e.target.value.toLowerCase() });
    }
    
    onSelectDocument(id) {
        this.setState({ selected: id });
        this.props.onSelect(id);
    }
    
    render() {
        let searchResults = [
            // { id, name, directory }
        ];
        
        Object.keys(this.props.explorer.documents).forEach(id => {
            if (this.props.types.indexOf(this.props.explorer.documents[id].doc_type) == -1) {
                return;
            }
            else if (this.props.explorer.documents[id].name.toLowerCase().indexOf(this.state.search) > -1) {
                let doc = this.props.explorer.documents[id]; 
                
                searchResults.push({
                    id, name: doc.name, directory: scopeParents(
                        this.props.explorer.folders, doc.folder_id
                    ).map(dir => { return dir.name; }).join('/')
                        + '/' + this.props.explorer.folders[doc.folder_id].name
                });
            }
        });
        
        return (
            <div className="document-finder">
                <input type="text" ref="search" onInput={this.onInput} placeholder="Search" />
                
                <div className="search-results">{
                    searchResults.map(res => {
                        return (
                            <div
                                onClick={this.onSelectDocument.bind(this, res.id)}
                                className={"result" + (res.id == this.state.selected ? " selected" : "")}
                            >
                                <span className="name">{res.name}</span>
                                <span className="directory">{res.directory}</span>
                            </div>
                        );
                    })
                }</div>
            </div>
        )
    }
    
}
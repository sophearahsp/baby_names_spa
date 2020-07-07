import React, { Component } from 'react'

export default class Main extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            listID: props.listID,
            // TODO check database to see if there are names
             names: ["somally", "darin", "sophearah"],
            
            nameTextBox: ''
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNameTextBoxChange = this.handleNameTextBoxChange.bind(this);
    }

    handleSubmit = (event) => {
        event.preventDefault();
        let newName = this.state.nameTextBox.trim() // removes whitespace

        if ((newName !== "") && //not blank
            (this.state.names.find(name => {return name === newName;}) !== newName) // not already in the list
        ){
            this.setState(oldState => {
                return {
                    names: oldState.names.concat(newName)
                };
            })
            
            this.setState({nameTextBox: ""})
        }
    }
    
    handleNameTextBoxChange = (event) => {
        this.setState({ nameTextBox: event.target.value});
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input
                        type = "text"
                        value = {this.state.nameTextBox}
                        onChange = {this.handleNameTextBoxChange}
                    />
                    
                    <button type="submit">Submit</button>
                </form>

                {// map names
                this.state.names.map((name) => (
                    <li key={name}>{name}</li>
                ))
                }
                
            </div>
        )
    }
}

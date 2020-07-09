import React, { Component } from 'react'

export default class Main extends Component {
    constructor(props){
        super(props);
        this.state = {
            listID: props.listID,
            //TODO check database to see if there are names
            names: [],
            nameInput: '',
            errorMessage: ''
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handlenameInputChange = this.handlenameInputChange.bind(this);
    }

    handleSubmit = (event) => {
        event.preventDefault();
        let newName = this.state.nameInput.trim() // removes whitespace

        if ((newName !== "") && //not blank
            (this.state.names.find(name => {return name === newName;}) !== newName) // not already in the list
        ){
            this.setState({nameInput: ""})
            this.setState({errorMessage: ""});
            this.setState(oldState => {
                return {
                    names: oldState.names.concat(newName)
                };
            })
        }else{
            this.setState({errorMessage: "theres an error"});
            this.setState({nameInput: ""})
        }
    }
    
    handlenameInputChange = (event) => {
        this.setState({ nameInput: event.target.value});
    }
    
    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input
                        type = "text"
                        value = {this.state.nameInput}
                        onChange = {this.handlenameInputChange}
                    />
                    
                    <button type="submit">Submit</button>
                    <label >{this.state.errorMessage}</label>
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

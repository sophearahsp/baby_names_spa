import React, { Component } from 'react'

// objective: display list

export default class Main extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            babyData:{
                listID: props.listID,
                // TODO check database to see if there are names
                names: ["somally", "darin", "sophearah"]
            },
            nameTextBox: ''
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNameTextBoxChange = this.handleNameTextBoxChange(this);
    }

    handleSubmit = (event) => {
        event.preventDefault();
        console.log("pressed submit button");
    }

    handleNameTextBoxChange = (event) => {
        console.log("name in textbox changed");
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
                this.state.babyData.names.map((name) => (
                    <li key={name}>{name}</li>
                ))
                }
                
            </div>
        )
    }
}

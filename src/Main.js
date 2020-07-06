import React, { Component } from 'react'

// objective: display list
export default class Main extends Component {
    
    constructor(props){
        super(props);
        console.log(props.listID+" is the id from main")
    }

    render() {
        return (
            <div>
                <form>

                </form>
                
            </div>
        )
    }
}

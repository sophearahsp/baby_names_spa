import React, {Component} from 'react';
import Main from "./Main"

export default class App extends Component {
  // generates new ID and changes URL
  generateNewID = () => {
    //TODO: generate ID on API
    let genID = Math.random().toString(36).slice(2);
    this.setState({listID: genID})
    window.history.pushState({},"","/?list_id=" + genID);
    
  }
  constructor(props){
    super(props);

    this.state = {
      listID: ""
    }

    const href = window.location.href;
    const protocol = window.location.protocol;
    const host = window.location.host;
    
    if (href.startsWith(protocol + "//" + host + "/?list_id=")){
      // parse list_id
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const urlListID = urlParams.get("list_id");
      // check if the list_id provided by URL is valid
      // TODO: make sure string is 12 characters
      const exp = /^[a-zA-Z0-9]+$/g;
      if (urlListID.match(exp)){
        this.state.listID = urlListID
      }else{// if invalid generate new id
        this.generateNewID();
      }

    }else{// URL either "/" or incorrect format
      this.generateNewID()
    }
  }

  render(){
    return(
      <div>
        
        <Main listID={this.state.listID}/>
      </div>
    )
  }
}
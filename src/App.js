import React, {Component} from 'react';

export default class App extends Component {
  // generates new ID and changes URL
  generateNewID = () => {
    //TODO: generate ID on API
    let genID = Math.random().toString(36).slice(2);
    window.history.pushState({},"","/?list_id=" + genID);
  }

  constructor(props){
    super(props);
    this.state = {
      list_id:""
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
      const exp = /^([0-9]|[a-z])+([0-9a-z]+)$/i;// TODO: make sure string is 12 characters
      if (urlListID.match(exp)){
        this.setState.list_id = urlListID;
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
        <Main/>
      </div>
    )
  }
}
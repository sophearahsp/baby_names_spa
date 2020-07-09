import React, {Component} from 'react';
import Main from "./Main"

export default class App extends Component {
  generateNewID = () => {
    //TODO: generate ID on API
    let genID = Math.random().toString(36).slice(2);
    this.setState({listID: genID})
    window.history.pushState({},"","/?list_id=" + genID);
  }

  constructor(props){
    super(props);
    this.state = {
      listID: "",
      names: [],
      dbId: 0
    }
    const href = window.location.href;
    const protocol = window.location.protocol;
    const host = window.location.host;

    if ((href.startsWith(protocol + "//" + host + "/?list_id=")) && // if has something as id
      (href.split('=')[1].match(/^[a-zA-Z0-9]{12}$/g)) && // if id is alphanumeric and 12 characters
      (this.VerifyUrlIdentification(href.split('=')[1])) // it is verified to be in the database
    ){
      this.state.listID = href.split('=')[1];
    }else{
      this.generateNewID();
    }
  }

  async VerifyUrlIdentification(toVerify){
    const API = 'http://localhost:3001/api/v1/url_identifications/';
    const response = await fetch(API);
    console.log(response)
    const data = await response.json();
    
    if (data.find(datum => datum.identification === toVerify)){
      return true
    }else{return false}
  }

  render(){
    return(
      <div>
        <Main listID={this.state.listID}/>
      </div>
    )
  }
}
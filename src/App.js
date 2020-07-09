import React, {Component} from 'react';
import Main from "./Main"

export default class App extends Component {
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
      (this.verifyUrlIdentification(href.split('=')[1])) // it is verified to be in the database
    ){
      this.state.listID = href.split('=')[1];
    }else{
      this.newUrlIdentification();
    }

    
  }

  async verifyUrlIdentification(toVerify){
    const API = 'http://localhost:3001/api/v1/url_identifications/';
    const response = await fetch(API);
    const data = await response.json();

    if (data.find(datum => datum.identification === toVerify)){
      return true
    }else{return false}
  }

  async newUrlIdentification(){
    const API = 'http://localhost:3001/api/v1/url_identifications/new';
    const response = await fetch(API);
    const data = await response.json();

    this.state = {listID: data.identification, dbId: data.id}
    window.history.pushState({},"","/?list_id=" + this.state.listID);
  }

  render(){
    return(
      <div>
        <Main listID={this.state.listID}/>
      </div>
    )
  }
}
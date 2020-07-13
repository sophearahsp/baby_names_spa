import React, { Component } from 'react';
import Main from "./Main"

// API constants
const baseAPI = 'http://localhost:3001/api/v1/';
//const baseAPI = 'https://floating-headland-40405.herokuapp.com/api/v1/';

const initGet = {
  method: 'GET',
  accept: 'application/json',
  cache: 'default',
  headers: {}
};

const href = window.location.href;
const protocol = window.location.protocol;
const host = window.location.host;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listID: "",
      dbID: -1
    }

    // check if user came in with link
    if ((href.startsWith(protocol + "//" + host + "/?list_id=")) && // if has something as id
      (href.split('=')[1].match(/^[a-zA-Z0-9]{12}$/g)) && // if id is alphanumeric and 12 characters
      (this.verifyUrlIdentification(href.split('=')[1])) // it is verified to be in the database
    ) {
      // set state of listID & dbID
      this.state = {listID: href.split('=')[1]};
      
      this.getDbID()
        .then(db => {
          if (db === undefined){
            this.newUrlIdentification()
              .then(urlID => {this.setState({
                listID: urlID.identification,
                dbID: urlID.id})})
              .then(x => window.history.pushState({}, "", "/?list_id=" + this.state.listID));
          }else{
            this.getDbID()
              .then((db) => this.setState({dbID: db.id}));
          }
        })
    } else { // else new ID
      this.newUrlIdentification()
        .then(urlID => {this.setState({
          listID: urlID.identification,
          dbID: urlID.id})})
        .then(x => window.history.pushState({}, "", "/?list_id=" + this.state.listID));
    }
  }

  async verifyUrlIdentification (toVerify) {
    const response = await fetch(baseAPI+"url_identifications/",initGet);
    const data = await response.json();
    if (data.find(datum => datum.identification === toVerify)) {
      return true
    } else { return false }
  }
 
  async getDbID(){
    const response = await fetch(baseAPI+"url_identifications/",initGet);
    const data = await response.json();
    const urlIdDatabase = data.find(datum => datum.identification === this.state.listID)
    if (urlIdDatabase === undefined){
      return undefined
    }
    return urlIdDatabase
  }

  async newUrlIdentification() {
    const response = await fetch(baseAPI + "url_identifications/new", initGet);
    const data = await response.json();
    return data
  }

  render() {
    if (!((this.state.dbID === undefined)||(this.state.dbID === -1))){
      return (
        <div>
          <Main listID = {this.state.listID} dbID = {this.state.dbID}></Main>
        </div>
      )
    }else{
      return (
        <div>
          waiting for data
        </div>
      )
    }
  }
}

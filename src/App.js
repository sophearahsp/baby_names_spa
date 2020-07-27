import React, { Component } from 'react';
import { initGet } from './InitAPI';
import Main from "./Main"

// API constants
//const baseAPI = 'http://localhost:3001/api/v1/';
const baseAPI = 'https://floating-headland-40405.herokuapp.com/api/v1/';

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
    
    // if has url has an id
    const checkUrlHasID = href.startsWith(protocol + "//" + host + "/?list_id=")
    // and if id is alphanumeric and has 12 characters
    const checkAlphanum12Char = href.includes("=") ? href.split('=')[1].match(/^[a-zA-Z0-9]{12}$/g) : false;

    // if url has id && its valid
    if (checkUrlHasID && checkAlphanum12Char){
      this.getThisIdFromDb(href.split('=')[1])
        .then(idObj => {
          //if exists, sets state
          if (idObj){
            this.setState({
              listID: idObj.identification,
              dbID: idObj.id});
          }else{this.setIdChangeUrl()}//otherwise create new id
        })
    } else{this.setIdChangeUrl()}//otherwise create new id
  }

  //gets new id from db and sets state and change current url
  setIdChangeUrl = () => {
    this.getNewUrlIdFromDb()
      .then(urlID => {this.setState({
        listID: urlID.identification,
        dbID: urlID.id})})
      .then(x => window.history.pushState({}, "", "/?list_id=" + this.state.listID));
  }

  //looks for urlidentification with given identification in database
  getThisIdFromDb = async (idFromUrl) => {
    const response = await fetch(baseAPI+"url_identifications/",initGet);
    const data = await response.json();
    //if id exists in database
    if (data.some(datum => datum.identification === idFromUrl)) {
      let datum = data.find(datum => datum.identification === idFromUrl);
      console.log(datum)
      return datum//return urlidentification object
    }else{return null}//otherwise return false
  }

  //create new id in database and return urlidentification object
  getNewUrlIdFromDb = async () => {
    const response = await fetch(baseAPI + "url_identifications/new", initGet);
    const data = await response.json();
    return data
  }

  render() {
    console.log("new")
    if (!((this.state.dbID === undefined)||(this.state.dbID === -1))){
      return (
        <div>
          <Main listID = {this.state.listID} dbID = {this.state.dbID}></Main>
        </div>
      )
    }else{
      return (
        <div>
          Loading data...
        </div>
      )
    }
  }
}

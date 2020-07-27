import React, { Component } from 'react'
import { initGet, initPost, initPatch } from './InitAPI';
import { Container, Form, Row, Col, ButtonGroup, Button, ListGroup } from 'react-bootstrap';

//const baseAPI = 'http://localhost:3001/api/v1/';
const baseAPI = 'https://floating-headland-40405.herokuapp.com/api/v1/';

export default class Main extends Component {
    constructor(props){
        super(props);
        //initial state
        this.state = {
            nameObjects: [],
            nameInput: '',
            errorMessage: ''
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNameInputChange = this.handleNameInputChange.bind(this);

        this.toggleStrikethrough = this.toggleStrikethrough.bind(this);
        this.sortAlphabetical = this.sortAlphabetical.bind(this);
        this.sortLength = this.sortLength.bind(this);
        this.sortRecent = this.sortRecent.bind(this);

        this.getNames();
    }

    // check if name is valid and submit new name
    handleSubmit = (event) => {
        event.preventDefault();
        let newName = this.state.nameInput.trim() // removes whitespace

        const notBlank = newName !== "";
        const notInLocalList = this.state.nameObjects.find(nameObject => { return nameObject.name === newName; }) === undefined;
        const alreadyInLocal =  this.state.nameObjects.find(nameObject => { return nameObject.name === newName; })
        
        // if input is not blank and not in local list
        if ((notBlank) && (notInLocalList)) {
            // check in db to seeif name already exists
            this.nameInDbCheck(newName).then(inThere => {
                if (inThere === false) {
                    //if doesnt exist add new name
                    this.setState({ errorMessage: "" });
                    this.addName(newName)
                        .then(x => this.getNames())
                //otherwise already exists in list, refresh, display error message
                } else {
                    this.getNames().then(x => this.setState({ errorMessage: "already in there" }));
                }
            })
        // if input in local list, display error message
        } else if (alreadyInLocal) {this.setState({ errorMessage: "already exists in list" });
        // if blank, display error message
        } else {this.setState({ errorMessage: "is blank" });}
        this.setState({ nameInput: "" })
    }
    
    // handle input change and limit user input
    handleNameInputChange = (event) => {
        if (this.state.nameInput.length < event.target.value.length){
            const checkCharAnd1SpaceMax = event.target.value.match(/^([a-zA-Z]*[\s]?[a-zA-Z]*)$/g);
            const inputIsUndefined = this.state.nameInput === undefined;
            if (checkCharAnd1SpaceMax || inputIsUndefined) {
                this.setState({ nameInput: event.target.value});
            }
        }else{this.setState({ nameInput: event.target.value});}
    }
    
    // check database to see if name is already in the list
    nameInDbCheck = async (newName) => {
        const nameObjects = await this.getNames()
        const found = nameObjects.find(nameObject => nameObject.name === newName)
        return ((found === undefined) ? false : true)
    }

    // add new name to database
    addName = async (newName) => {
        const content = {
            name_idea: {
                name: newName,
                url_identification_id: this.props.dbID,
                strikethrough: false
            }
        }
        const response = await fetch(baseAPI+"url_identifications/"+this.props.dbID+"/name_ideas", initPost(content));
        const data = await response.json();
        return data
    }

    // get names from database
    getNames = async () => {
        const response = await fetch(baseAPI + "url_identifications/" + this.props.dbID + "/name_ideas", initGet);
        const data = await response.json();

        if (data.length !== 0) {
            this.setState({ nameObjects: data })
        }

        return data
    }

    // go to database and toggle strikethrough
    toggleStrikethrough = async (nameObject) => {
        const content = {
            name_idea: {
                strikethrough: !nameObject.strikethrough
            }
        }
        const response = await fetch(baseAPI+"url_identifications/"+this.props.dbID+"/name_ideas/"+nameObject.id, initPatch(content));
        const data = await response.json();
        return data
    }

    // click list item
    clickListItem = async (nameObject,e) => {
        this.toggleStrikethrough(nameObject)
            .then(x => this.getNames())
    }

    // sort names alphabetically
    sortAlphabetical = () => {
        this.setState({nameObjects: this.state.nameObjects.sort((a, b) => a.name.localeCompare(b.name))})
    }

    // sort names by length
    sortLength = () => {
        this.setState({nameObjects: this.state.nameObjects.sort((a, b) => b.name.length - a.name.length || a.name.localeCompare(b.name))})
    }

    // sort names by most recently inputted
    sortRecent = () => {
        this.setState({nameObjects: this.state.nameObjects.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))})
    }

    render() {
        return (            
            <div >
                <Container fluid>
                    <Row >
                        <Col lg={3}/>
                        <Col lg={6}>
                            <br/>

                            <small className="text-danger"> {this.state.errorMessage}</small>  
                            <br/>    
                            <Form onSubmit={this.handleSubmit}>
                                <Form.Group>
                                    <Form.Control value={this.state.nameInput} onChange={this.handleNameInputChange} size="lg" type="text" placeholder="add new name" />
                                </Form.Group>
                            </Form>

                            <ButtonGroup aria-label="Basic example">
                                <Button variant="secondary" onClick={this.sortAlphabetical}>Alphabetical</Button>
                                <Button variant="secondary" onClick={this.sortLength}>Length</Button>
                                <Button variant="secondary" onClick={this.sortRecent}>Recents</Button>
                            </ButtonGroup>   

                            <ListGroup >
                                <React.Fragment>
                                    {this.state.nameObjects.map((nameObject) => (

                                        <ListGroup.Item action
                                            style={{ textDecorationLine: (nameObject.strikethrough ? 'line-through' : 'none') }}
                                            key={nameObject.name}
                                            onClick={(e) => this.clickListItem(nameObject, e)}
                                        >
                                            {nameObject.name}
                                        </ListGroup.Item>
                                    ))}
                                </React.Fragment>
                            </ListGroup>

                        </Col>
                        <Col lg={3} />
                    </Row>
                </Container>
            </div>
        )
    }
}

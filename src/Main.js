import React, { Component } from 'react'
import { Container, Form, Row, Col, ButtonGroup, Button, ListGroup } from 'react-bootstrap';

//const baseAPI = 'http://localhost:3001/api/v1/';
const baseAPI = 'https://floating-headland-40405.herokuapp.com/api/v1/';

const initGet = {
    method: 'GET',
    accept: 'application/json',
    cache: 'default',
    headers: {}
};

const initPost = (data) => ({
    method: 'POST',
    accept: 'application/json',
    cache: 'no-cache',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
});

const initPatch = (data) => ({
    method: 'PATCH',
    accept: 'application/json',
    cache: 'no-cache',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
});

export default class Main extends Component {
    constructor(props){
        super(props);
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

    handleSubmit = (event) => {
        event.preventDefault();
        let newName = this.state.nameInput.trim() // removes whitespace
        if ((newName !== "") && //not blank
           (this.state.nameObjects.find(nameObject => {return nameObject.name === newName;}) === undefined) // not already in the list
        ){
            this.nameInDbCheck(newName).then(inThere => {
                if (inThere === false){
                    this.addName(newName)
                        .then(x => this.getNames())
                }else{
                    this.setState({errorMessage: "already in there"});
                }
            })
            this.setState({errorMessage: " "});
        }else if (this.state.nameObjects.find(nameObject => {return nameObject.name === newName;})){
            this.setState({errorMessage: "already exists in list"});
        }else{
            this.setState({errorMessage: "is blank"});
        }
        this.setState({nameInput: " "})
        
    }
    
    handleNameInputChange = (event) => {
        if (this.state.nameInput.length < event.target.value.length){
            if ((event.target.value.match(/^([a-zA-Z]*[\s]?[a-zA-Z]*)$/g)) || this.state.nameInput === undefined){
                this.setState({ nameInput: event.target.value});
            }
        }else{
            this.setState({ nameInput: event.target.value});
        }
    }
    

    async nameInDbCheck(newName){
        const nameObjects = await this.getNames()

        const found = nameObjects.find(nameObject => nameObject.name === newName)
        if (found === undefined){
            return false
        }else{
            return true
        }
    }

    async addName(newName){
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

    async getNames(){
        const response = await fetch(baseAPI+"url_identifications/"+this.props.dbID+"/name_ideas", initGet);
        const data = await response.json();
        
        if (data.length !== 0){
            this.setState({nameObjects: data})
        }
        
        return data
    }

    async toggleStrikethrough(nameObject) {
        const content = {
            name_idea: {
                strikethrough: !nameObject.strikethrough
            }
        }
        const response = await fetch(baseAPI+"url_identifications/"+this.props.dbID+"/name_ideas/"+nameObject.id, initPatch(content));
        const data = await response.json();
        return data
    }

    async clickListItem(nameObject,e){
        console.log(nameObject)
        this.toggleStrikethrough(nameObject)
            .then(x => this.getNames())
    }

    sortAlphabetical(){
        this.setState({
            nameObjects: this.state.nameObjects.sort((a, b) => a.name.localeCompare(b.name))
        })
    }

    sortLength(){
        this.setState({
            nameObjects: this.state.nameObjects.sort((a, b) => b.name.length - a.name.length || a.name.localeCompare(b.name))
        })
    }

    sortRecent(){
        this.setState({
            nameObjects: this.state.nameObjects.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        })
    }

    render() {
        return (
            <div>
                <Container>
                    <br/> <br/>
                    <Row>
                        <Col/>
                        <Col lg={6}>
                            <small className="text-danger"> {this.state.errorMessage}</small>
                            
                            <Form onSubmit={this.handleSubmit}>
                                <Form.Group>
                                    <Form.Control value = {this.state.nameInput} onChange = {this.handleNameInputChange} size="lg" type="text" placeholder="add new name" />
                                </Form.Group>
                            </Form>
                            
                            <br/>
                            <ButtonGroup aria-label="Basic example">
                                <Button variant="secondary" onClick={this.sortAlphabetical}>Alphabetical</Button>
                                <Button variant="secondary" onClick={this.sortLength}>Length</Button>
                                <Button variant="secondary" onClick={this.sortRecent}>Recents</Button>
                            </ButtonGroup>

                            <ListGroup>
                                <React.Fragment>
                                    {this.state.nameObjects.map((nameObject) => (
                                        
                                        <ListGroup.Item action
                                            style={{textDecorationLine: (nameObject.strikethrough ? 'line-through' : 'none')}}
                                            key={nameObject.name}
                                            onClick={(e) => this.clickListItem(nameObject,e)}
                                        >
                                            {nameObject.name}
                                        </ListGroup.Item>
                                    ))}
                                </React.Fragment>
                            </ListGroup>
                        </Col>
                        <Col>
                        
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}
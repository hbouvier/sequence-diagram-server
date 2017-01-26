import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import TextArea from './TextArea';
const PouchDB = require('pouchdb');
const db = new PouchDB('seqdiga');
window.PouchDB = PouchDB;

class App extends Component {
  constructor (props, context) {
    super(props, context);
    this.state = {
      filename:  '/static/media/sequence-diagram.png',
      value: ''
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    const self = this;
    db.get('sd').then(doc => {
      self.setState({value:doc.value});
      console.log('componentWillMount->doc:', doc);
    });
  }

  handleChange(value) {
    const self = this;
    const payload = {id:'sd', value: `${value}`};
    fetch('/generate-sequence-diagram', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      json: true,
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
      db.put({_id: 'sd', value: value})
      .then( () => {
        console.log('generatge-sequence-diagram:', payload);
        self.setState({filename: `/static/media/sequence-diagram.png?v=${(new Date()).getTime()}`, value: value});
      })
      .catch(err => {
        db.get('sd').then(function (doc) {
          db.put({_id: 'sd', _rev: doc._rev, value: value}).then( () => {
            console.log('generatge-sequence-diagram:', payload);
            self.setState({filename: `/static/media/sequence-diagram.png?v=${(new Date()).getTime()}`, value: value});
          });
        });
      });
    });
  }

  render() {
    console.log('render state:', this.state)
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>React Sequence Diagram</h2>
        </div>
        <div id="wrap">
          <div id="left_col">
            <TextArea label="" rows="40" cols="40" value={this.state.value} done={this.handleChange}/>
          </div>
          <div id="right_col">
            <img className="img" src={this.state.filename} alt="diagram"/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

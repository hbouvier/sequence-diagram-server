import React, { Component, PropTypes } from 'react';

var handle = null;
const refresh_rate = 250;
var once = true;

class TextArea extends Component {

  constructor (props, context) {
    super(props, context);
    this.state = {
      done:  this.props.done,
      value: this.props.value
    };
    this.handleChange  = this.handleChange.bind(this);
    // this.handleSubmit  = this.handleSubmit.bind(this);
    // this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (once) {
      once = false;
      this.setState({value: nextProps.value});
      this.props.done(nextProps.value);
    }
  }


  handleChange(event) {
    const self = this;
    const value = event.target.value;
    console.log('handleChange')
    this.setState({value: value});
    this.props.done(value);
    clearTimeout(handle);
    handle = setTimeout(() => {
      self.props.done(self.state.value);
    }, refresh_rate);
  }

  // handleSubmit(event) {
  //   // console.log('handleSubmit')
  //   // this.props.done(this.state.value);
  //   event.preventDefault();
  // }

  handleKeyDown(event) {
    console.log('handleKeyDown')
    if (event.which === 13 && typeof(this.props.enterKeyAction) === 'function') {
      clearTimeout(handle);
      handle = null;
      this.props.done(this.state.value);
    }
  }

  render () {
    console.log('render text:', this.state)
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          {this.props.label}
          <textarea
            rows={this.props.rows}
            cols={this.props.cols}
            value={this.state.value}
            onChange={this.handleChange}
          />
        </label>
      </form>
    );
  }
}

TextArea.propTypes = {
  rows:           PropTypes.string,
  cols:           PropTypes.string,
  label:          PropTypes.string,
  value:          PropTypes.string
}

export default TextArea;
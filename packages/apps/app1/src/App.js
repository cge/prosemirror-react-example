import React, { Component } from 'react';
import { Rte } from 'pm-comps-lib';

class App extends Component {
  state = {
    rteValue: '<p>edit me...</p>'
  };

  onRteChange = (id, html) => {
    // Rte currently working as uncontrolled component
    // this.setState({
    //   rteValue: html
    // });
  };

  render() {
    return (
      <div className="App">
        <div className="rte-container">
          <Rte
            id="rte1"
            value={this.state.rteValue}
            onChange={this.onRteChange}
          />
        </div>
      </div>
    );
  }
}

export default App;

import { Component } from "react";

class Spinner extends Component {
  render() {
    return (
      <div className="spinner-wrapper">
        <div className="spinner">
          <div className="cube1"></div>
          <div className="cube2"></div>
        </div>
      </div>
    );
  }
}

export default Spinner;

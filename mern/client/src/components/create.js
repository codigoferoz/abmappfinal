import React, { Component } from "react";
import axios from 'axios';

export default class Create extends Component {
  // This is the constructor that stores the data.
  constructor(props) {
    super(props);

    this.onChangecashflowConcept = this.onChangecashflowConcept.bind(this);
    this.onChangecashflowAmount = this.onChangecashflowAmount.bind(this);
    this.onChangecashflowDate = this.onChangecashflowDate.bind(this);
    this.onChangecashflowType = this.onChangecashflowType.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      cashflow_concept: "",
      cashflow_amount: "",
      cashflow_date: "",
      cashflow_type: "",
    };
  }

  // These methods will update the state properties.
  onChangecashflowConcept(e) {
    this.setState({
      cashflow_concept: e.target.value,
    });
  }

  onChangecashflowAmount(e) {
    this.setState({
      cashflow_amount: e.target.value,
    });
  }

  onChangecashflowDate(e) {
    this.setState({
      cashflow_date: e.target.value,
    });
  }

  onChangecashflowType(e) {
    this.setState({
      cashflow_type: e.target.value,
    });
  }

// This function will handle the submission.
  onSubmit(e) {
    e.preventDefault();

    // When post request is sent to the create url, axios will add a new record(newcashflow) to the database.
    const newcashflow = {
      cashflow_concept: this.state.cashflow_concept,
      cashflow_amount: this.state.cashflow_amount,
      cashflow_date: this.state.cashflow_date,
      cashflow_type: this.state.cashflow_type,
    };

    axios
      .post("http://localhost:5000/record/add", newcashflow)
      .then((res) => console.log(res.data));

    // We will empty the state after posting the data to the database
    this.setState({
      cashflow_concept: "",
      cashflow_amount: "",
      cashflow_date: "",
      cashflow_type: "",
    });
  }

  // This following section will display the form that takes the input from the user.
  render() {
    return (
      <div class="container" style={{ marginTop: 20 }}>
        <h3>Create New Record</h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Concept: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.cashflow_concept}
              onChange={this.onChangecashflowConcept}
            />
          </div>
          <div className="form-group">
            <label>Amount: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.cashflow_amount}
              onChange={this.onChangecashflowAmount}
            />
          </div>
          <div className="form-group">
            <label>Date: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.cashflow_date}
              onChange={this.onChangecashflowDate}
            />
          </div>
          <div className="form-group">
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="priorityOptions"
                id="priorityLow"
                value="Income"
                checked={this.state.cashflow_type === "Income"}
                onChange={this.onChangecashflowType}
              />
              <label className="form-check-label">Income</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="priorityOptions"
                id="priorityMedium"
                value="Out"
                checked={this.state.cashflow_type === "Out"}
                onChange={this.onChangecashflowType}
              />
              <label className="form-check-label">Out</label>
            </div>
          </div>
          <div className="form-group">
            <input
              type="submit"
              value="Create movement"
              className="btn btn-primary"
            />
          </div>
        </form>
      </div>
    );
  }
}

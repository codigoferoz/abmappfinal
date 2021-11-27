import React,  {Component}  from "react";
import axios from "axios";
import { withRouter } from "react-router";

class Edit extends Component {
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
      records: [],
    };
  }
  // This will get the record based on the id from the database.
  componentDidMount() {
    axios
      .get("http://localhost:5000/record/" + this.props.match.params.id)
      .then((response) => {
        this.setState({
          cashflow_concept: response.data.cashflow_concept,
          cashflow_amount: response.data.cashflow_amount,
          cashflow_date: response.data.cashflow_date,
          cashflow_type: response.data.cashflow_type,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
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
    const newEditedcashflow = {
      cashflow_concept: this.state.cashflow_concept,
      cashflow_amount: this.state.cashflow_amount,
      cashflow_date: this.state.cashflow_date,
      cashflow_type: this.state.cashflow_type,
    };
    console.log(newEditedcashflow);

    // This will send a post request to update the data in the database.
    axios
      .post(
        "http://localhost:5000/update/" + this.props.match.params.id,
        newEditedcashflow
      )
      .then((res) => console.log(res.data));

    this.props.history.push("/");
  }

  // This following section will display the update-form that takes the input from the user to update the data.
  render() {
    return (
      <div class="container" style={{ marginTop: 20 }}>
        <h3 align="center">Update Record</h3>
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
          <br />

          <div className="form-group">
            <input
              type="submit"
              value="Update Record"
              className="btn btn-primary"
            />
          </div>
        </form>
      </div>
    );
  }
}

// You can get access to the history object's properties and the closest <Route>'s match via the withRouter
// higher-order component. This makes it easier for us to edit our records.

export default withRouter(Edit);

import React, { Component } from "react";
import paginate from "paginate-array";
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.css";
import { Link } from "react-router-dom";

const Record = (props) => (
  <tr>
    <td>{props.record.cashflow_concept}</td>
    <td>{props.record.cashflow_amount}</td>
    <td>{props.record.cashflow_type}</td>
    <td>{props.record.cashflow_date}</td>
    <td>
      <Link to={"/edit/" + props.record._id}>Edit</Link> |
      <a
        href="/"
        onClick={() => {
          props.deleteRecord(props.record._id);
        }}
      >
        Delete
      </a>
    </td>
  </tr>
);

// This is the constructor that shall store our data retrieved from the database
export default class RecordList extends Component {  
  constructor(props) {
    super(props);
    this.deleteRecord = this.deleteRecord.bind(this);
    this.state = { 
      records: [],
      size: 5,
      page: 1,
      currPage: null,
    };

    this.previousPage = this.previousPage.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  // This method will get the data from the database.
  componentDidMount() {
    axios
      .get("http://localhost:5000/record/")
      .then((response) => {
        const record = response.data;
        const { page, size } = this.state;
        const currPage = paginate(record, page, size);
        this.setState({
          ...this.state,
          record, 
          currPage,
        });
      }); 
  }

  // fix Warning: Can't perform a React state update on an unmounted component
  componentWillUnmount() {    
    this.setState = (state,callback)=>{
        return;
    };
  }

  // This method will delete a record based on the method
  deleteRecord(id) {
    axios
      .delete("http://localhost:5000/" + id)
      .then((response) => {
      console.log(response.data);
    });

    this.setState({
      record: this.state.records.filter((el) => el._id !== id),
    });
  }

  // This method will map out the flows on the table
  recordList() {
    return this.state.records.map((currentrecord) => {
      return (
        <Record
          record={currentrecord}
          deleteRecord={this.deleteRecord}
          key={currentrecord._id}
        />
      );
    });
  }

  // This method will map out the flows on the table
  previousPage() {
    const { page, size, record } = this.state;
    if (page > 1) {
      const newPage = page - 1;
      const newCurrPage = paginate(record, newPage, size);
      
      this.setState({
        ...this.state,
        page: newPage,
        currPage: newCurrPage,
      });
    }
  }

  nextPage() {
    const { currPage, page, size, record } = this.state;

    if (page < currPage.totalPages) {
      const newPage = page + 1;
      const newCurrPage = paginate(record, newPage, size);
      this.setState({ ...this.state, page: newPage, currPage: newCurrPage });
    }
  }

  handleChange(e) {
    const { value } = e.target;
    const { record } = this.state;

    const newSize = +value;
    const newPage = 1;
    const newCurrPage = paginate(record, newPage, newSize);

    this.setState({
      ...this.state,
      size: newSize,
      page: newPage,
      currPage: newCurrPage,
    });
  }

  // This following section will display the table with the records of financial movements.
  render() {
    const { page, size, currPage, } = this.state;
    return (      
      <div class="container-fluid" style={{ marginTop: 20 }}>
        <div class="container">
          <div class="row">
            <div class="col-12">
              <table class="table">
                <thead class="thead-dark">
                  <div class="container">
                    <div class="row">
                      <div class="col-sm" role="alert">page: {page}</div>
                      <div class="col-sm" role="alert">size: {size}</div>
                      <div class="col-sm" role="alert">                      
                        <label class="" for="inputGroupSelect01">Options</label>                      
                          <select class="custom-select" id="inputGroupSelect01" name="size" id="size" onChange={this.handleChange}>
                            <option class="input-group mb-3" aria-label="Third group" selected>Choose...</option>
                            <option value="5">Five</option>
                            <option value="10">Ten</option>
                            <option value="20">Tuenty</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  <tr>
                  <th scope="col">Actions</th>
                  </tr>
                </thead>
              <tbody>
                <tr>      
                  {currPage &&
                    <ul>
                      {currPage.data.map(currentrecord => 
                      <li key={currentrecord.id}><th>
                      Concept: <br></br> 
                      {currentrecord.cashflow_concept}</th><th>
                      Amount: <br></br>
                      {currentrecord.cashflow_amount}</th><th>
                      Date: <br></br>
                      {currentrecord.cashflow_date}</th><th class="col">
                      Type: <br></br>
                      {currentrecord.cashflow_type}</th>
                      </li>)}
                    </ul>
                  }   
                </tr>             
              </tbody>
            </table>
          </div>
        </div>     
          <div class="btn-group mr-2" role="group" aria-label="Third group">
            <button type="button" class="btn btn-primary" onClick={this.previousPage}>Previous Page</button>
            <button type="button" class="btn btn-secondary" onClick={this.nextPage}>Next Page</button>
          </div>         
        </div>
      </div>      
    );
  }
}

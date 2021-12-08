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
        const totalAmount = record.reduce((acc, curr)=>{ 
          let cur =curr.cashflow_amount
            return acc + Number(cur); 
          }, 0)
        console.log("total:", totalAmount);
        this.setState({
          ...this.state,
          record, 
          currPage,
          totalAmount,
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
    const { page, size, currPage, totalAmount } = this.state;
    return (      
      <div class="container-fluid" style={{ marginTop: 20 }}>        
        <div class="row">
          <div class="col-12">
          <div class="col-sm" role="alert" style={{fontWeight: "bold"}}>Total Balance: {totalAmount}</div>
            <table class="table">
              <thead class="thead-dark">                                
                <tr>
                  <th>Concept</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Actions</th>                          
                </tr>
              </thead>                  
              <tbody>                     
                {currPage &&
                  (
                    currPage.data.map((currentrecord, i) => {
                      return(
                        <tr key={currentrecord.id}>
                          <td style={{fontWeight: "bold"}}>{currentrecord.cashflow_concept}</td>
                          <td>{currentrecord.cashflow_amount}</td>
                          <td>{currentrecord.cashflow_date}</td>
                          <td>{currentrecord.cashflow_type}</td>
                          <td>
                          <Link to={"/edit/" + currentrecord._id}>Edit</Link> | 
                          <Link to={"/delete/" + currentrecord._id}>Delete</Link>
                          </td>                          
                        </tr>
                      );
                    })                      
                  )}
              </tbody>
            </table>
          </div>      
          <div>
            <div class="container-fluid" style={{ marginTop: 20 }}> 
              <div class="col-12">
                <div class="col-sm" role="alert">page: {page}</div>
                <div class="col-sm" role="alert">size: {size}</div>
              </div>
          </div> 
            <div class="container-fluid" style={{ marginTop: 20 }}>
                <label class="col-12" for="inputGroupSelect01">Rows view options</label>                      
                  <select class="custom-select" id="inputGroupSelect01" name="size" id="size" onChange={this.handleChange}>
                    <option class="input-group mb-3" aria-label="Third group" selected>Choose...</option>
                    <option value="5">Five</option>
                    <option value="10">Ten</option>
                    <option value="20">Twenty</option>
                  </select>
            </div> 
          </div> 
        </div>     
        <div class="btn-group mr-2" role="group" aria-label="Third group" style={{ marginTop: 20 }}>
          <button type="button" class="btn btn-primary" onClick={this.previousPage}>Previous Page</button>
          <button type="button" class="btn btn-secondary" onClick={this.nextPage}>Next Page</button>
        </div>                  
      </div>           
    );
  }
}

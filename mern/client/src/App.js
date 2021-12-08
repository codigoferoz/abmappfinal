import React from "react";
import { Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Edit from "./components/edit";
import Delete from "./components/delete";
import Create from "./components/create";
import RecordList from "./components/recordList";

const App = () => {
  return (
    <div>
      <Navbar />
      <Route exact path="/">
        <RecordList />
      </Route>
      <Route path="/edit/:id" component={Edit} />    
      <Route path="/delete/:id" component={Delete} />   
      <Route path="/create">
        <Create />
      </Route>
    </div>
  );
};

export default App;

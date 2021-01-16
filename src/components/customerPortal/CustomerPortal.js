import React from "react";
import LoanRequestForm from './LoanRequestForm';
import CheckStatus from './CheckStatus';
import { NavLink  } from "react-router-dom";
import '../../sass/customer.scss';

class CustomerPortal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      agentUrl: '/login/agent',
      adminUrl: '/login/admin',
    }
  }

  render(){
    return (
    <>
      <div className="title default-shadow">
        <h1>e-Loan Management System</h1>
      </div>
      <div className="container-fluid">
        <h3 className="text-center js-message"></h3>
        <div className="row">
          <div className="col-6 lg-col-6 md-col-6">
            <div className="u-form default-shadow">
              <div className="req-form">
                <p>REQUEST FOR LOAN</p>
              </div>
              <LoanRequestForm />
            </div>
          </div>
          <div className="col-6 lg-col-6 md-col-6">
            <div className="auth-login d-flex justify-content-center align-content-center flex-column h-100">
              <button 
              type="button" 
              className="btn ui-btn warning-btn  ui-round-btn default-shadow" 
              data-toggle="modal" 
              data-target="#show-modal">Check Status</button>
              <br/>
              <NavLink to={{
                pathname : this.state.agentUrl,
                state: {role: 'Agent'}
                }} className="btn ui-btn info-btn  ui-round-btn default-shadow">Agent Login</NavLink>
              <br/>
              <NavLink to={{
                pathname : this.state.adminUrl,
                state: {role: 'Admin'}
                }}  className="btn ui-btn danger-btn ui-round-btn default-shadow">Admin Login</NavLink>
            </div>
          </div>
        </div>
        <CheckStatus />
      </div>
    </>
    );
  }
}

export default CustomerPortal;
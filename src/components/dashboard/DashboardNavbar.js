import React from 'react';
import { NavLink  } from "react-router-dom";

class DashboardNavbar extends React.Component {

    constructor (props) {
        super(props);
        this.home = '/';
    }

    render(){
        return (
            <nav className="navbar navbar-expand-lg fixed-top main-nav">
                <div className="container-fluid">
                    <div className="nav-brand">
                        <button className="sidenav-toggler">
                            <i className="fa fa-dashboard" style={{color : "#fff"}}></i>
                        </button>
                        <NavLink className="navbar-brand" to={this.home}>redCarpet</NavLink>
                    </div>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#main-navbar">
                        <i className="fa fa-bars" style={{color : "#fff"}}></i>
                    </button>
                    <div className="collapse navbar-collapse" id="main-navbar">
                        <ul className="navbar-nav">
                            <div className="left-nav">
                                <li>
                                    <a  className="nav-link text-white" onClick={this.props.new} >new</a>
                                </li>
                                <li>
                                    <a  className="nav-link text-white"  onClick={this.props.approve}>approved</a>
                                </li>
                                <li>
                                    <a  className="nav-link text-white" onClick={this.props.reject}>rejected</a>
                                </li>
                            </div>
                            <div className="right-nav">
                                <li>
                                    <a onClick={this.props.logout} className="nav-link"><i className="fa fa-user-circle-o" style={{fontSize : "#fff"}}></i>&nbsp;&nbsp;logout</a>
                                </li>
                            </div>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

export default DashboardNavbar;
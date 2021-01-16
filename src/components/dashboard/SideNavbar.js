import React from 'react';
import UploadAdminImg from "./UploadAdminImg";
import { NavLink  } from "react-router-dom";

class SideNavbar extends React.Component {
    constructor (props) {
        super(props);
        this.registerUrl = '/register-new-administrator';
        this.state = {
            dbImgUrl : '/static/images/admin/'+ this.props.auth.img,
            adminName : this.props.auth.name,
            isAdmin : this.props.role,
        }
    }

    _setNewImg = (img) => {
        this.setState({dbImgUrl: '/static/images/admin/'+img});
    }

    render (){
        const uploadLink = {
            fontSize : "10px",
            margin : "0",
            position : "relative",
            width : "100%",
            display : "block"
        }
        return (
            <>
            <div className="sidenav flex-column">
                <div className="agent-img_container">
                    { !this.props.auth.img && 
                        <span className="agent-img">
                            <i className="fa fa-user" style={{fontSize : "140px", color : "#fff"}}></i>
                        </span>
                    }
                    { this.props.auth.img &&
                        <img className="agent-img rounded-lg img-fluid " src={this.state.dbImgUrl} />
                    }
                    <a className="text-white text-center" style={uploadLink} data-toggle="modal" data-target="#uploadImg-modal">Upload New</a>
                    
                </div>
                <hr />
                <p style={{textAlign : "center", color: "#fff"}}>{this.state.adminName}</p>
                <ul className="nav-sidenav">
                    <li>
                        <a className="text-white" onClick ={this.props.all} ><i className="fa fa-users" style={{fontSize : "14px"}}></i> &nbsp; Applications</a>
                    </li>
                    <li>
                        <a href="#"><i className="fa fa-500px" style={{fontSize : "14px"}}></i> &nbsp; Update Password</a>
                    </li>
                    <li>
                        <a href="#"><i className="fa fa-clone" style={{fontSize : "14px"}}></i> &nbsp; Payment History</a>
                    </li>
                    { this.state.isAdmin == "admin" && 
                        <li>
                            <NavLink to={this.registerUrl}>
                                <i className="fa fa-plus" style={{fontSize : "14px"}}></i> &nbsp; Add agent
                            </NavLink>
                        </li>
                    }
                    <li>
                        <a href="#"><i className="fa fa-cog" style={{fontSize : "14px"}}></i> &nbsp; settings</a>
                    </li>
                </ul>
            </div>
            <UploadAdminImg setImg={this._setNewImg} />
            </>
        );

    }
}

export default SideNavbar;
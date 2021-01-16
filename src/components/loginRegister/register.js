import React from "react";
import {filterName, getToken, setToken, validateEmail} from "../main";
import { Redirect,NavLink } from "react-router-dom";
import '../../sass/login-register.scss';


class Register extends React.Component {
    
    registerUrl = "/register-new-administrator";
    login = '/';
    forgetPassword = '';

    constructor(props){
        super(props);
        this.state = {
            name: '',
            username: '',
            password: '',
            _password: '',
            phone: '',
            message : '',
            success: '',
            redirect: false
        }
    } 

    _submitHandler = (ev) => {
        ev.preventDefault();
        const data = this.state;
        data._token = getToken();
        if (this.state.name && this.state.username && this.state.password && this.state.phone){
            if (this.state.password === this.state._password) {
                fetch(this.registerUrl,{  
                    method: 'POST',
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                }).then(resp => resp.json()).then(data => {
                    if('success' in data){
                        this.setState({success: data.success});
                        setToken(data.csrf);
                        window.setTimeout(() => {
                            this.setState({redirect: true});
                        }, 5000);
                    }else if ('message' in data) {
                        this.setState({success: data.message});
                    }
                    this.setState({ name: '', username: '', password: '', _password: '', phone: ''})
                },error => {
                    console.log(error);
                });
            }
        }else{
            this.setState({message: "please provide all details!"})
        }
    }

    _changeHandler = (ev) => {
        if (ev.target.name == "name") {
            if (filterName(ev.target.value)) {
                this.setState({name: ev.target.value,message: ""});
            }else{
                this.setState({message: 'name cant be empty and no special charactor allowed!!'});
            }
        }else if(ev.target.name == "username"){
            if (validateEmail(ev.target.value)){
                this.setState({username: ev.target.value,message: ""});
            }else{
                this.setState({message: 'please type correct email!!'});
            }
        }else if(ev.target.name == "password"){
            if (ev.target.value.length < 8 || ev.target.value.length > 15) {
                this.setState({message: 'password length should be between 8 to 15 character!!'});
            }else{
                this.setState({password: ev.target.value, message: ''});
            }
        }else if(ev.target.name == "confirm_password"){
            if (ev.target.value !== this.state.password) {
                this.setState({message: 'password do not match!!'});
            }else{
                this.setState({_password: ev.target.value, message: ''});
            }
        }else{
            if (ev.target.value.length < 10 || ev.target.value.length > 14) {
                this.setState({message: 'please enter your valid phone number'});
            }else{
                this.setState({phone: ev.target.value, message: ''});
            }
        }
    }

  render(){
    const success = {padding : "20px",maxWidth: "500px",margin:"auto",textAlign: "center",color: "red"};
    const {redirect} = this.state;

    if(redirect){
        return <Redirect to="/" />;
    }

    return (
      <>
        <h4 style={success}>{this.state.success}</h4>
        <div className="register">
            <div className="register-form default-shadow">
                <div className="logo">
                    <img src='/static/images/logo.svg' className="logo-img" />
                </div>
                <br />
                <p style={{textAlign: "center",color: "red"}}><b>Administration </b> register</p>
                <br/>
                <p style={{textAlign: "center",color: "red"}} >{this.state.message}</p>
                <form action={this.registerUrl} method="post" onSubmit={this._submitHandler}>
                    <input type="text" name="name" onChange={this._changeHandler} defaultValue={this.state.name} className="form-control form-input" placeholder=" name" />
                    <br />
                    <input type="text" name="username" onChange={this._changeHandler} defaultValue={this.state.username} className="form-control form-input" placeholder="Email" />
                    <br />
                    <input type="password" name="password" onChange={this._changeHandler} defaultValue={this.state.password} className="form-control form-input" placeholder="password" />
                    <br />
                    <input type="password" name="confirm_password" onChange={this._changeHandler} defaultValue={this.state._password} className="form-control form-input" placeholder="Confirm password" />
                    <br />
                    <input type="text" name="phone" onChange={this._changeHandler} defaultValue={this.state.phone} className="form-control form-input" placeholder="(+91) phone" />
                    <br />
                    {"add captcha here"}
                    <button type="submit" className="btn ui-btn primary-btn ui-round-btn" style={{width: "100%"}}>Create Account</button>
                    <div className="d-flex justify-content-between m-2">
                        <NavLink to={this.login}>log in</NavLink>
                        <a >forgot password</a>
                    </div>
                </form>
            </div>
        </div>
      </>
    );
  }
}

export default Register;
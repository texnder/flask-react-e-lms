import React from "react";
import {getToken, validateEmail} from "../main";
import '../../sass/login-register.scss';
import { Redirect,NavLink } from "react-router-dom";


class Login extends React.Component {
    signUp = '/register-new-administrator';
    forgetPassword = '';
    abortController = new AbortController();

    constructor(props){
        super(props);
        const role = (props.history.location.state == undefined) ? '' : props.history.location.state.role;
        this.state = {
            message : '',
            username: '',
            password: '',
            data: {},
            redirect: false,
            role: role
        }
        this.loginUrl = '/login/'+role;
    }

    componentDidMount(){
        fetch("/check-login-status",{signal : this.abortController.signal}).then(res =>res.json()).then(data => {
            if(data){
                this.setState({data:data, redirect: true});
            }
        },error => console.log(error));
    }

    componentWillUnmount(){
        this.abortController.abort();
    }

    _submitHandler = (ev) => {
        ev.preventDefault();
        const data = this.state;
        data._token = getToken();
        if (this.state.username && this.state.password) {
            fetch(this.loginUrl,{  
                method: 'POST',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            }).then(res => res.json()).then(data => {
                if (typeof data == 'object' && data.role) {
                    this.setState({data: data, redirect: true});
                }
                else{
                    this.setState({message : data})
                }
            })
        }
    }

    _changeHandler = (ev) => {
        if(ev.target.name == "username"){
            if (validateEmail(ev.target.value)){
                this.setState({username: ev.target.value,message: ""});
            }else{
                this.setState({message: 'please type correct email!!'});
            }
        }else if(ev.target.name == "password"){
            if (ev.target.value.length > 8 && ev.target.value.length < 15) {
                this.setState({password: ev.target.value, message: ''});
            }
        }
    }

  render(){
    const {data, redirect} = this.state;
    let home;

    if(redirect){
        return <Redirect to= {{
            pathname : "/dashboard",
            state : {data: data}
        }} />;
    }
    if (!this.state.role) {
        home = <NavLink to="/">"role is not set, go to home page!"...</NavLink>;
    }

    return (
      <>
        <div className="login">
            <div className="login-form default-shadow">
                <div className="logo">
                    <img src='/static/images/logo.svg' className="logo-img" />
                </div>
                <br />
                <p style={{textAlign: "center",color: "red"}}><b>{this.state.role} </b> login</p>
                <p style={{textAlign: "center",color: "red"}}>{this.state.message} {home}</p>
                <form action={this.loginUrl} method="post" onSubmit={this._submitHandler} >
                    <input type="text" onChange={this._changeHandler} defaultValue={this.state.username} name="username" className="form-control form-input" placeholder="your Email" />
                    <br />
                    <input type="password" onChange={this._changeHandler} defaultValue={this.state.password} name="password" className="form-control form-input" placeholder="password" />
                    <br />
                    {"add captcha here"}
                    <button type="submit" className="btn ui-btn primary-btn ui-round-btn" style={{width: "100%"}}>Log in</button>
                    <div className="d-flex justify-content-between m-2">
                        <NavLink to={this.signUp}>sign up</NavLink>
                        <a>forgot password</a>
                    </div>
                </form>
            </div>
        </div>
      </>
    );
  }
}

export default Login;
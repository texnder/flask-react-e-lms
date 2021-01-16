import React from "react";
import CustomerImgId from "./CustomerImgId"
import {filterName, getToken, setToken} from "../main";


class LoanRequestForm extends React.Component {

  createUrl =  '/user-request-form-loan';
  uploadUrl = '/upload-customer-images';
  secretToken = '/get-token';

  constructor(props){
    super(props);
    this.state = {
      status : false,
      _token: getToken(),
      name : '',
      dob : '',
      phone : '',
      address : '',
      l_amnt : '',
      l_term : '',
      l_type : 'Home loan',
      aadhar_num : '',
      customerImg : '',
      idImg: '',
    }
  }

  submitHandler  = e => {
    e.preventDefault();
    const {customerImg,idImg} = this.state;
    if (!filterName(this.state.name)) {
      this.setState({status: 'name cant be empty and no special charactor allowed!!'});
			return;
    }else if (!this.state.dob) {
      this.setState({status: 'please select valid date of birth!!'});
			return;
    }else if (!this.state.phone || this.state.phone.length < 10 || this.state.phone.length > 14) {
      this.setState({status: 'please enter your valid phone number'});
			return;
    }else if (!this.state.address) {
      this.setState({status: 'address field cant be empty!!'});
			return;
    }else if (!this.state.l_amnt) {
      this.setState({status: 'loan amount field cant be empty!!'});
			return;
		}else if (!this.state.l_term) {
      this.setState({status: 'loan term field cant be empty!!'});
			return;
		}else if (!this.state.aadhar_num) {
      this.setState({status: 'ID prove field cant be empty!!'});
			return;
    }else if (customerImg && idImg) {
      this.setState({status: true});
      e.target.disabled = true;
      this._uploadImages();
      e.target.disabled = false;
    }else{
      this.setState({status: "please upload valid id image!!"});
      return;
    }
  }

  _uploadImages = () => {
      var fd = new FormData();
      fd.append('customerImg',this.state.customerImg);
      fd.append('idImg',this.state.idImg);
      fetch(this.uploadUrl,{
				method: "POST",
				body: fd
			}).then(res=>res.json()).then(data => {
				if('cFile' in data && 'idFile' in data){
          this._createApplication(data.cFile,data.idFile);
        }
        if ('message' in data) {
          this.setState({status: data.message});
        }
			},err=>console.log(err));
  }

  _createApplication = (cfile,idfile) => {
    const data = this.state;
    data.customerImg = cfile;
    data.idImg = idfile;
    data._token = getToken();
    fetch(this.createUrl,{
      method: 'POST',
      mode: 'cors', 
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    }).then(res => res.json()).then(data => {
      if ('message' in data) {
        document.getElementsByClassName('js-message')[0].innerHTML = data.message;
      }
      let csrf;
      if ('csrf' in data){
        csrf = data.csrf;
        setToken(csrf);
      }
      this.setState({
        _token: csrf,
        name : '',
        dob : '',
        phone : '',
        address : '',
        l_amnt : '',
        l_term : '',
        l_type : 'Home loan',
        aadhar_num : '', 
        customerImg: '',
        idImg: '',
      });
    },err=>console.log(err));
  }

      
  _setImages = (user_img,id_img) => {
    this.setState({customerImg: user_img, idImg: id_img});
    return 'images uploaded successfully!!';
  }


  _onChangeHandler = (ev) => {
    this.setState({ [ev.target.name] : ev.target.value });
  }

  render(){
    const {status, name, dob, phone, address, l_amnt, l_term, l_type, aadhar_num} = this.state;
    
    return (
      <div>
        <p className="text-center" style={{color: 'red'}}>{status}</p>
        <form id="userForm" className="p-4"  encType="multipart/form-data" onSubmit = {this.submitHandler}>
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label >Name:</label>
                <input 
                type="text" 
                name="name" 
                className="form-control form-input" 
                placeholder="your name" 
                value={name} 
                onChange = {this._onChangeHandler}
                required/>
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label >DOB:</label>
                <input 
                type="date" 
                name="dob" 
                className="form-control form-input" 
                value={dob} 
                onChange = {this._onChangeHandler}
                required/>
              </div>
            </div>	
		      </div>
          <div className="form-group">
            <label >Phone:</label>
            <input 
            type="text" 
            name="phone" 
            className="form-control form-input" 
            placeholder="(+91) Phone Number" 
            value={phone} 
            onChange = {this._onChangeHandler}
            required/>
          </div>
          <div className="form-group">
            <label >Address:</label>
            <input 
            type="text" 
            name="address" 
            className="form-control form-input" 
            placeholder="your Address" 
            value={address} 
            onChange = {this._onChangeHandler}
            required/>
          </div>
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label>Loan amount:</label>
                <input 
                type="text"  
                name="l_amnt" 
                className="form-control form-input" 
                placeholder="amount" 
                value={l_amnt} 
                onChange = {this._onChangeHandler}
                required/>
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label>loan term</label>
                <input 
                type="text" 
                name="l_term" 
                className="form-control form-input" 
                placeholder="year" 
                value={l_term} 
                onChange = {this._onChangeHandler}
                required/>
              </div>
            </div>
          </div>
          <div className="form-group">
            <label>Loan Type:</label>
            <select className="form-control form-input js-lone_type" name="l_type" value={l_type} onChange = {this._onChangeHandler}>
              <option>Home loan</option>
              <option>Gold loans</option>
              <option>Personal loan</option>
              <option>Short-term business loans</option>
              <option>Education loans</option>
              <option>Vehicle loans</option>
            </select>
          </div>
          <div className="form-group">
            <label>ID prove:</label>
            <input 
              type="text" 
              name="aadhar_num" 
              className="form-control form-input js-idProve" 
              placeholder="ID number (0000-0000...)" 
              value={aadhar_num}
              onChange = {this._onChangeHandler}
              required/>
          </div>
          <button 
            className="btn ui-btn ui-round-btn w-100" 
            data-toggle="modal" data-target="#imgUploader" onClick={(ev)=>ev.preventDefault()}>Upload ID</button>
          <br/>
          <button 
            className="btn ui-btn primary-btn ui-round-btn w-100" >Submit Request</button>
        </form>
        <CustomerImgId setImg={this._setImages} />
        </div>
    );
  }
}

export default LoanRequestForm;
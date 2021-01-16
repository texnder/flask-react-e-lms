import React from 'react';
import {calculateInterest, getToken, setToken, _calculateAge} from "../main";


export default class EditApplication extends React.Component {

	updateUrl = '/update-user-profile';
	approveUrl = '/approve-application';
	forwordUrl = '/forword-user-profile';
	deleteUrl = '/delete-user-profile';
	userApplication = '/user-application';

	constructor(props){
		super(props);
		this.state = {
			_token: getToken(),
			customer_id : "fcvbhur7u89ghjbh",
			name: "user name",
			dob: "dd-mm-yyyy",
			phone: "+91 9876543210",
			address: "house no. 123, nehru place, delhi",
			idProve: "Id prove",
			l_type : "Home loan",
			l_amnt : "",
			l_term: "",
			interest: "18",
			age: "00",
			total: "0000",
			status: 'new',
			images : {
				user_img : '',
				user_id_img : '',
			},
			styleApprove: 'none',
			styleForword: 'none',
			styleReject: 'none',
			styleUpdate: 'none',
			inputs: {
				nameInput: "user name",
				dobInput: "dd-mm-yyyy",
				phoneInput: "+91 9876543210",
				addressInput: "house no. 123, nehru place, delhi", 
			}
			
		}
	}

	componentDidUpdate(previousProps){
		if (previousProps.id !== this.props.id) {
			if (this.props.id) {
				
				fetch(this.userApplication,{  
					method: 'POST',
					cache: 'no-cache',
					credentials: 'same-origin',
					headers: {'Content-Type': 'application/json'},
					body: JSON.stringify({id: this.props.id})
				}).then(resp => resp.json()).then(data => {
					let age = _calculateAge(data.dob);
					let total = calculateInterest(data.loan_amount,data.loan_term,data.interest_rate);
					document.getElementById('js-update').removeAttribute('disabled');
					document.getElementById('js-reject').removeAttribute('disabled');
					if(this.props.role === "agent") {
						document.getElementById('js-forword').removeAttribute('disabled');
					}else if (this.props.role === "admin") {
						document.getElementById('js-approve').removeAttribute('disabled');
					}
					if(data.deleted_at != null){
						this.setState({
							status: 'rejected('+data.deleted_at+')',
							styleApprove: 'none',
							styleForword: 'none',
							styleReject: 'none',
							styleUpdate: 'none'
						});
						if(this.props.role === "agent"){
							this.setState({
								styleForword: 'inline-block',
								styleReject: 'inline-block',
								styleUpdate: 'inline-block'
							});
						}
					}else if (data.approved != 0) {
						const date = new Date(data.approved*1000);
						this.setState({
							status: 'approved('+date.toLocaleDateString("en-US")+')',
							styleApprove: 'none',
							styleForword: 'none',
							styleReject: 'none',
							styleUpdate: 'none'
						});
					}else{
						if (data.agent_check != 0) {
							if(this.props.role === "agent"){
								this.setState({
									status: 'forworded',
									styleForword: 'none',
									styleReject: 'none',
									styleUpdate: 'none'
								});
							}else if(this.props.role === "admin"){
								this.setState({
									status: 'forworded',
									styleApprove: 'inline-block',
									styleReject: 'inline-block',
									styleUpdate: 'inline-block'
								});
							}
						}else{
							this.setState({
								status: 'new',
								styleApprove: 'none',
								styleForword: 'inline-block',
								styleReject: 'inline-block',
								styleUpdate: 'inline-block'
							});
						}	
					}

					this.setState({
						_token: getToken(),
						customer_id : data.customer_id, 
						name: data.name, 
						dob: data.dob,
						phone: data.phone,
						address: data.Address,
						idProve : data.user_id_num,
						l_type : data.loan_type,
						l_amnt : data.loan_amount,
						l_term: data.loan_term,
						interest: data.interest_rate,
						images: {
							user_img: data.user_img,
							user_id_img: data.user_id_img
						},
						age: age,
						total: total,
						inputs: {
							nameInput : data.name,
							dobInput: data.dob,
							phoneInput: data.phone,
							addressInput: data.Address
						},
					})
				},error => {
					console.log(error);
				});
			}
		}
	}

	
	_makeEditable = () => {
		let name,dob, phone, address;
		name = <input  name='name' onChange={this._onChangeHandler.bind(this)} defaultValue={this.state.name} type="text" className="form-control form-input" />;
		dob = <input name="dob" onChange={this._onChangeHandler.bind(this)} defaultValue={this.state.dob} type="date" className="form-control form-input" />;
		phone = <input name="phone" onChange={this._onChangeHandler.bind(this)} defaultValue={this.state.phone} type="text" className="form-control form-input" />;
		address = <input name="address" onChange={this._onChangeHandler.bind(this)} defaultValue={this.state.address} type="text" className="form-control form-input" />;
		this.setState({
			inputs: {
				nameInput: name,
				dobInput: dob,
				phoneInput: phone,
				addressInput: address
			}
			
		});
	}
	
	_onChangeHandler = (ev) => {
		this.setState({ [ev.target.name] : ev.target.value });
		
	}

	_updateProfile = (ev) => {
		ev.target.disabled = true;
		fetch(this.updateUrl,{
			method: "POST",
			mode: 'cors',
			credentials: 'same-origin',
			cache: 'no-cache',
			headers: {
				"Content-Type": 'application/json'
			},
			body: JSON.stringify(this.state)
		}).then(resp => resp.json()).then(data => {
			this._setToken(data);
		},error => {
			console.log(error);
		});
	}
	
	_setToken = (data) => {
		if ("message" in data) {
			this.setState({status : data.message});
			this.props.status(data.message);
		}
		if ("csrf" in data) {
			this.setState({_token: data.csrf});
			setToken(data.csrf);
		}
	}

	_approveApplication = (ev) => {
		ev.target.disabled = true;
		fetch(this.approveUrl,{
			method: "POST",
			mode: 'cors',
			credentials: 'same-origin',
			cache: 'no-cache',
			headers: {
				"Content-Type": 'application/json'
			},
			body: JSON.stringify({_token: this.state._token, customer_id : this.state.customer_id})
		}).then(resp => resp.json()).then(data => {
			this._setToken(data);
		},error => {
			console.log(error);
		});
	}

	_forwordApplication = (ev) => {
		ev.target.disabled = true;
		fetch(this.forwordUrl,{
			method: "POST",
			mode: 'cors',
			credentials: 'same-origin',
			cache: 'no-cache',
			headers: {
				"Content-Type": 'application/json'
			},
			body: JSON.stringify({_token: this.state._token, customer_id : this.state.customer_id})
		}).then(resp => resp.json()).then(data => {
			this._setToken(data);
		},error => {
			console.log(error);
		});
	}

	_rejectApplication = (ev) => {
		ev.target.disabled = true;
		fetch(this.deleteUrl,{
			method: "POST",
			mode: 'cors',
			credentials: 'same-origin',
			cache: 'no-cache',
			headers: {
				"Content-Type": 'application/json'
			},
			body: JSON.stringify({_token: this.state._token, customer_id : this.state.customer_id})
		}).then(resp => resp.json()).then(data => {
			this._setToken(data);
		},error => {
			console.log(error);
		});
	}

    render () {
		let role;
		if(this.props.role === "admin") {
			role = <button id="js-approve" style={{display : this.state.styleApprove}} className="btn success-btn ui-btn" onClick={this._approveApplication} >approve</button>;
		}else if (this.props.role === "agent") {
			role = <button id="js-forword" style={{display : this.state.styleForword}} className="btn info-btn ui-btn" onClick={this._forwordApplication} >forword</button>;
		}
        return (
            <div className="modal fade" id="edit-modal">
			  	<div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
			    	<div className="modal-content">
				      	<div className="modal-header">
				        	<h6 className="modal-title">user Profile: {this.state.status}</h6>
				        	<button type="button" className="close" data-dismiss="modal">&times;</button>
				      	</div>
				      	<div className="modal-body">
				        	<div className="u-card container-fluid">
				        		<div className="row">
				        			<div className="col-4">
										{ !this.state.images.user_img &&
											<span className="agent-img">
												<i className="fa fa-user" style={{fontSize: '240px',color: '#000'}} ></i>
											</span>
										}
										{ this.state.images.user_img &&
				        					<img src={"/static/images/customer/"+ this.state.images.user_img} style={{width: "100%", height: "auto"}} />
										}
				        			</div>
				        			<div className="col-7">
				        				<p>Customer Id: {this.state.customer_id}</p>
				        				<p>Name: <span id="js-name">{this.state.inputs.nameInput}</span></p>
				        				<p>DOB: <span id="js-dob">{this.state.inputs.dobInput}</span>&nbsp;&nbsp;&nbsp;&nbsp; Age: &nbsp; {this.state.age} </p>
				        				<p>Phone: <span id="js-phone">{this.state.inputs.phoneInput}</span></p>
				        				<p>Address: <span id="js-address">{this.state.inputs.addressInput}</span></p>
				        				<p>ID prove: <a href={"/static/images/idCard/"+ this.state.images.user_id_img} target="_blank" >{this.state.idProve}</a></p>
				        			</div>

				        			<div className="col-1">
				        				<span onClick= {this._makeEditable}><i className="fa fa-edit" style={{fontSize: "20px"}}></i></span>
				        			</div>
				        			<div className="container-fluid pt-3">
				        				<div className="row">
				        					<div className="col">
				        						<div className="form-group">
												    <label>Loan Type: </label>
													<select name="l_type"  
													onChange={this._onChangeHandler} 
													className="form-control form-input" 
													value={this.state.l_type} >
												    	<option>Home loan</option>
												    	<option>Gold loans</option>
												    	<option>Personal loan</option>
												    	<option>Short-term business loans</option>
												    	<option>Education loans</option>
												    	<option>Vehicle loans</option>
												    </select>
											    </div>
						        				<div className="form-group">
												    <label >Loan amount:</label>
													<input type="text"  
													name='l_amnt' 
													onChange={this._onChangeHandler}  
													className="form-control form-input" 
													placeholder="amount" 
													value={this.state.l_amnt} />
											    </div>

											    <p>Monthly payment(Rs): {this.state.total/12} </p>
				        					</div>
				        					<div className="col">
				        						 <div className="form-group">
												    <label >loan term:</label>
													<input type="text"   
													name="l_term" 
													onChange={this._onChangeHandler} 
													className="form-control form-input " 
													placeholder="year" 
													value={this.state.l_term} />
											    </div>
											    <div className="form-group">
												    <label >loan interest:</label>
													<input type="text"   
													name="interest" 
													onChange={this._onChangeHandler} 
													className="form-control form-input " 
													placeholder="int" 
													value={this.state.interest} />
											    </div>

											    <p>Total pyaments(Rs): {this.state.total} </p>
				        					</div>
				        				</div>
				        			</div>

				        		</div>
				        	</div>
				      	</div>
				      	<div className="modal-footer">
				        	<button id="js-update" style={{display : this.state.styleUpdate}} className="btn primary-btn ui-btn" onClick={this._updateProfile}>update</button>
				        	{role}
				        	<button id="js-reject" style={{display : this.state.styleReject}} className="btn danger-btn ui-btn" onClick={this._rejectApplication} >reject</button>
				      	</div>
			    	</div>
			  	</div>
			</div>
        );
    }
}

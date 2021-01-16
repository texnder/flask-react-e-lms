import React from "react";
import {calculateInterest, getToken, setToken, _calculateAge} from "../main";

class CheckStatus extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			name : 'user name',
			dob : 'dd-mm-yyyy',
			phone : '+91 9876543210',
			address: 'Address: house no. 123, nehru place, delhi',
			loanType: 'Home loan',
			loan_amount : '100000',
			loan_term : '10',
			user_id_num : 'Id prove',
			user_img : '',
			user_id_img : '',
			interest: '18',
			monthlyPayment : '000',
			TotalPayment: '0000',
			age: '00',
			status: 'status'
		}
	}

  	fetchCustomerData = () => {
		const id = document.getElementsByClassName('js-customer_id')[0].value;
		fetch("/check-application-status",{
			method: "POST",
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({_token : getToken(), customer_id: id})
		}).then(res => res.json()).then((data) => {
			if ('row' in data) {
				setToken(data.csrf);
				var row = data.row;
				const total = calculateInterest(row.loan_amount,row.loan_term,row.interest_rate);
				this.setState({
					isLoaded: true,
					name : row.name,
					dob : row.dob,
					phone : row.phone,
					address: row.Address,
					loanType: row.loan_type,
					loan_amount : row.loan_amount,
					loan_term : row.loan_term,
					user_id_num : row.user_id_num,
					user_img : "/static/images/customer/"+row.user_img,
					user_id_img :  "/static/images/idCard/"+row.user_id_img,
					interest: row.interest_rate,
					monthlyPayment : total/12,
					TotalPayment: total,
					age: _calculateAge(row.dob),
					status: 'new'
				});
				if (row.agent_check != 0) {
					this.setState({status: 'forworded'});
				}
				if (row.approved != 0) {
					const date = new Date(row.approved*1000);
					this.setState({status: 'approved('+date.toLocaleDateString("en-US")+')'});
				}else if(row.deleted_at != null){
					this.setState({status: 'rejected('+row.deleted_at+')'});
				}
			}else if('message' in data) {
				this.setState({status: data.message});
			}
		},(error) => console.log(error));
	}

  render(){
    return (
        <div className="modal fade" id="show-modal">
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
									{ !this.state.user_img &&
										<span className="agent-img">
											<i className="fa fa-user" style={{fontSize: '240px',color: '#000'}} ></i>
										</span>
									}
									{ this.state.user_img &&
										<img src={this.state.user_img} style={{width: '100%', height: 'auto'}} />
									}
			        			</div>
			        			<div className="col-8">
			        				Customer Id: 
			        				<div className="d-flex">
			        					<input type="text" name="customer_id" className="form-input form-control mr-3 js-customer_id" placeholder="enter your customer id.."/> 
			        					<button className="btn info-btn ui-btn ui-round-btn" onClick = {this.fetchCustomerData}>check</button>
			        				</div>
			        				<hr/>
			        				<p>Name: {this.state.name}</p>
			        				<p>DOB: {this.state.dob} &nbsp;&nbsp;&nbsp;&nbsp; Age: {this.state.age}</p>
			        				<p>Phone: {this.state.phone}</p>
			        				<p>Address: {this.state.address}</p>
			        				<p>ID prove: <a href={this.state.user_id_img} target="_blank" >{this.state.user_id_num}</a></p>
			        			</div>
			        			<div className="container-fluid pt-3">
			        				<div className="row">
			        					<div className="col">
			        						<div className="form-group">
											    <label>Loan Type: </label>
											    <select className="form-control form-input" disabled>
											    	<option>{this.state.loanType}</option>
											    </select>
										    </div>
					        				<div className="form-group">
											    <label >Loan amount:</label>
											    <input type="text" className="form-control form-input" placeholder="amount" value={this.state.loan_amount} disabled />
										    </div>

										    <p>Monthly payment(Rs): {this.state.monthlyPayment}</p>
			        					</div>
			        					<div className="col">
			        						 <div className="form-group">
											    <label >loan term:</label>
											    <input type="text" className="form-control form-input" placeholder="year" value={this.state.loan_term} disabled />
										    </div>
										    <div className="form-group">
											    <label >loan interest:</label>
											    <input type="text" className="form-control form-input" placeholder="int" value={this.state.interest} disabled />
										    </div>

										    <p>Total pyaments(Rs): {this.state.TotalPayment}</p>
			        					</div>
			        				</div>
			        			</div>
			        		</div>
			        	</div>
			      	</div>
			    </div>
			</div>
		</div>
    );
  }
}

export default CheckStatus;
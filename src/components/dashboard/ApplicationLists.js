import React from "react";
import { getToken, setToken } from "../main";

class ApplicationLists extends React.Component {
    trashUrl = "/delete-user-profile";
    destroyUrl = "/delete-permanently-user-profile";
    constructor (props) {
        super(props);
    }
    
    _trashApplication (id) {
        fetch(this.trashUrl,{
			method: "POST",
			mode: 'cors',
			credentials: 'same-origin',
			cache: 'no-cache',
			headers: {
				"Content-Type": 'application/json'
			},
			body: JSON.stringify({_token: getToken(), customer_id : id})
		}).then(data => data.json()).then(data => {
            this.props.status(data.message);
            if ('csrf' in data) {
                setToken(data.csrf);
            }
        },error => {
            console.log(error);
        });
    }

    _destroyApplicationRequest (id) {
        const conf = confirm('do you want to delete id: "'+id+'" application permanently!!');
        if(conf){
            fetch(this.destroyUrl,{
                method: "POST",
                mode: 'cors',
                credentials: 'same-origin',
                cache: 'no-cache',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({_token: getToken(), id : id})
            }).then(data => data.json()).then(data => {
                this.props.status(data.message);
                if ('csrf' in data) {
                    setToken(data.csrf);
                }
            },error => {
                console.log(error);
            });
        }
    }

    render (){
        let icon;
        if (this.props.data.approved) {
            icon = <span><i className="fa fa-check" style={{fontSize: "20px"}}></i></span>;
        }else if(this.props.data.deleted_at){
            icon = <span><i className="fa fa-close" onClick={() => this._destroyApplicationRequest(this.props.data.id)} style={{fontSize: "20px"}}></i></span>
        }
        return (
            <tr className={"dataRow"+this.props.data.id}>
                <td><img  src={"/static/images/customer/"+this.props.data.user_img} width="60" height="60" /> </td>
                <td>{this.props.data.name}</td>
                <td>{this.props.data.dob}</td>
                <td>{this.props.data.phone}</td>
                <td>{this.props.data.Address}</td>
                <td>{this.props.data.loan_type}</td>
                <td>{this.props.data.loan_amount}</td>
                <td>{this.props.data.loan_term}</td>
                <td>
                    <span onClick={() => this.props.editIt(this.props.data.id)}><i className="fa fa-edit" style={{fontSize: "20px"}} data-toggle="modal" data-target="#edit-modal"></i></span>
                </td>
                <td>
                { !this.props.data.approved && 
                    <span onClick={() => this._trashApplication(this.props.data.customer_id)}><i className="fa fa-trash" style={{fontSize: "20px"}}></i></span>
                }
                </td>
                <td>
                    {icon}
                </td>
            </tr>
        );
    }
}

export default ApplicationLists;
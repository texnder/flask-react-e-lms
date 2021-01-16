import React from 'react';
import DashboardNavbar from './DashboardNavbar';
import SideNavbar from './SideNavbar';
import ApplicationLists from "./ApplicationLists";
import EditApplication from "./EditApplication";
import { Redirect } from 'react-router-dom';
import '../../sass/dash.scss';

class AdminDashboard extends React.Component {

    abortController = new AbortController();
    logoutUrl = "/logout";
    getAllUrl = '/get-applications';

    constructor (props){
        super(props);
        if(props.history.location.state == undefined){
            this.state = {
                redirect: true
            }
        }else{
            this.state = {
                fields : [],
                role : props.history.location.state.data.role,
                id: '',
                status: '',
                auth: {
                    img: props.history.location.state.data.user_img,
                    name: props.history.location.state.data.name
                },
                redirect: false
            }
        }
    }

    componentDidMount () {
        this._getApplications();
    }

    componentWillUnmount (){
        this.abortController.abort();
    }

    _getApplications = () => {
        fetch(this.getAllUrl,{signal: this.abortController.signal}).then(resp => resp.json()).then((data) => {
            if (data) {
                this.setState({ fields : data});
            }else{
                this.setState({ redirect : true});
            }
        },
        (error) => {
            console.log(error);
        }
        );
    }
    
    _logout = (ev) => {
        ev.preventDefault();
        fetch(this.logoutUrl).then(resp => resp.json()).then(data => {
            if(data){
                this.setState({redirect: true});
            }
        },error => console.log(error));
    }

    _editApplication = (id) => {
        this.setState({id : id});
    }

    _updateStatus = (status) => {
        this.setState({status: status});
        this._getApplications();
    }

    _searchInTable = (ev) => {
        let txtValue, _column, td, _searchIt, table, tr;
        _searchIt = ev.target.value.toLowerCase();
        table = document.getElementById('applications');
        tr = table.getElementsByTagName('tr');
        for (let i = 1; i < tr.length; i++) {
            _column = tr[i].getElementsByTagName("td");
            tr[i].style.display = "none";
            for(let j = 0; j < _column.length; j++){
                td = _column[j];
                if (td) {
                    txtValue = td.textContent || td.innerText;
                    txtValue = txtValue.toLowerCase();
                    if (_searchIt) {
                        if (txtValue.indexOf(_searchIt) > -1) {
                            // td.innerHTML = txtValue.replace(_searchIt,"<strong>"+_searchIt+"</strong>");
                            tr[i].style.display = "";
                            break;
                        }
                    }else{
                        for (let i = 1; i < tr.length; i++){
                            tr[i].style.display = "";
                        }
                    }
                }      
            }
        }
    }

    _hideAll = () => {
        let  tbody,tr;
        tbody = document.getElementsByTagName('tbody')[0];
        tr = tbody.getElementsByTagName('tr');
        for (let i = 0; i < tr.length; i++) {
            tr[i].style.display = 'none';
        }
    }

    
    _showAll = () => {
        let  tbody,tr;
        tbody = document.getElementsByTagName('tbody')[0];
        tr = tbody.getElementsByTagName('tr');
        for (let i = 0; i < tr.length; i++) {
            tr[i].style.display = '';
        }
    }

    
    _showNew = () => {
        let ids = [];
        this._hideAll();
        if (this.state.fields) {
            this.state.fields.map((item) => {
                if(!item.approved && !item.deleted_at){
                    ids.push(item.id);
                }
            });
            if (ids) {
                ids.forEach(id => {
                    document.getElementsByClassName('dataRow'+id)[0].style.display = '';
                })
            }
        }

    }
    
    _showApproved = () => {
        let ids = [];
        this._hideAll();
        if (this.state.fields) {
            this.state.fields.map((item) => {
                if(item.approved){
                    ids.push(item.id);
                }
            });
            if (ids) {
                ids.forEach(id => {
                    document.getElementsByClassName('dataRow'+id)[0].style.display = '';
                })
            }
        }
    }

    _showRejected = () => {
        let ids = [];
        this._hideAll();
        if (this.state.fields) {
            this.state.fields.map((item) => {
                if(item.deleted_at){
                    ids.push(item.id);
                }
            });
            if (ids) {
                ids.forEach(id => {
                    document.getElementsByClassName('dataRow'+id)[0].style.display = '';
                })
            }
        }
    }


    render(){
        let content;
        const {redirect} = this.state;
        if (redirect) {
            return <Redirect to='/' />
        }
        if (this.state.fields) {
            content = this.state.fields.map((item) =>
                <ApplicationLists key={item.id} data={item}  editIt={this._editApplication}  status={this._updateStatus} />
            );
        }else{
            content = <tr><td>no data Found!!</td></tr>;
        }
        
        return (
            <>
            <DashboardNavbar 
                logout= {this._logout} 
                new={this._showNew} 
                approve={this._showApproved} 
                reject={this._showRejected} 
            />
            <SideNavbar auth={this.state.auth} role={this.state.role} all={this._showAll} />
            <div className="main container-fluid">
                <div className="container-fluid show-data">
                    <input onChange={this._searchInTable} className="form-control form-input w-25 float-right" type="text" placeholder="Search.." />
                    <h4>User Applications: {this.state.status}</h4>
                    <br />
                    <table id="applications" className="table table-striped">
                        <thead>
                            <tr>
                                <th>photo</th>
                                <th>name</th>
                                <th>DOB</th>
                                <th>phone</th>
                                <th>Address</th>
                                <th>Loan Type</th>
                                <th>Loan amount</th>
                                <th>Loan Term</th>
                                <th>edit</th>
                                <th>delete</th>
                                <th>status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {content}
                        </tbody>
                    </table>
                    <EditApplication id={this.state.id} role={this.state.role} status={this._updateStatus} />
                </div>
            </div>
            </>
            
        );
    }
    
}

export default AdminDashboard;
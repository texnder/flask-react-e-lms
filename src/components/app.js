import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AdminDashboard from './dashboard/dash';
import CustomerPortal from './customerPortal/CustomerPortal';
import Login from './loginRegister/login';
import Register from './loginRegister/register';


const App = () => {
    return (
        <>
        <Switch>
            <Route path ="/" exact component= {CustomerPortal} />
            <Route path= "/dashboard" render={(props) => <AdminDashboard {...props} />} />
            <Route path= "/login" render= {(props) => <Login {...props} />} />
            <Route path= "/register-new-administrator" component={Register} />
        </Switch>
        </>
    );
}

export default App;
import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import { Toolbar, Typography } from '@material-ui/core';
import { Redirect } from 'react-router-dom';

function CustomerList () {

    const [customer, setCustomer] = useState([]);
    const [redirect, setRedirect] = useState([]);

    useEffect( () => getCustomers(), []);

    const getCustomers = () => {
        fetch('https://customerrest.herokuapp.com/api/customers')
        .then(response => response.json())
        .then(data => setCustomer(data.content))
    }

    const addCustomer = (newCustomer) => {
        fetch('https://customerrest.herokuapp.com/api/customers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCustomer)
        })
        .then(res => getCustomers())
        .catch(err => console.log(err))
    }

    const updateCustomer = (editCustomer, link) => {
        fetch(link, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editCustomer)
        })
        .then(res => getCustomers())
        .catch(err => console.log(err))
    }

    const deleteCustomer = (link) => {
        fetch(link, { method: 'DELETE' })
        .then(res => getCustomers())
        .catch(err => console.log(err))
    }

    const selectCustomer = (event, rowData) => {
        const href = rowData.links[0].href;
        const customerId = href.split('/').pop();
        const redirectString = "/customer/"+customerId;
        console.log(redirectString);
        setRedirect(redirectString);
    }

    if (redirect.length !== 0) {
        console.log(redirect);
        return <Redirect push to={redirect} />
    }

    return (
        <div>
            <Toolbar>
                <Typography variant="h6" noWrap>
                    Customers
                </Typography>
            </Toolbar>
            <MaterialTable
                columns={[
                    { title: "First name", field: "firstname" },
                    { title: "Last name", field: "lastname" },
                    { title: "Street address", field: "streetaddress" },
                    { title: "Postcode", field: "postcode" },
                    { title: "City", field: "city" },
                    { title: "Email", field: "email" },
                    { title: "Phone", field: "phone" }
                ]}
                data={customer}
                title="Customers"
                editable={
                    {
                        onRowAdd: newData =>
                            new Promise( (resolve, reject) => {
                                setTimeout( () => {
                                    addCustomer(newData);
                                    resolve();
                                }, 1000);
                        }),
                        onRowUpdate: (newData, oldData) => 
                            new Promise( (resolve, reject) => {
                                setTimeout( () => {
                                    {
                                        const index = customer.indexOf(oldData);
                                        const link = customer[index].links[0].href;
                                        updateCustomer(newData, link);
                                        resolve();
                                    }
                                    resolve();
                                }, 1000);
                        }),
                        onRowDelete: oldData => 
                            new Promise( (resolve, reject) => {
                                setTimeout( () => {
                                    {
                                        const index = customer.indexOf(oldData);
                                        const link = customer[index].links[0].href;
                                        deleteCustomer(link);
                                        resolve();
                                    }
                                    resolve();
                                }, 1000);
                        })
                    }
                }
                options={
                    { sorting: true,
                     pageSize: 20,
                     headerStyle: {
                        backgroundColor: '#3f51b5',
                        color: '#fff',
                        fontWeight: 'bold'
                    } }
                }
                onRowClick={(event, rowData) => selectCustomer(event, rowData)}
            />
        </div>
    );
}

export default CustomerList;
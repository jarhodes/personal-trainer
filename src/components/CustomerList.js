import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import { Toolbar, Typography, Button, Tooltip, IconButton } from '@material-ui/core';
import { Redirect, Link } from 'react-router-dom';
import CustomerForm from './CustomerForm';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';

function CustomerList () {

    const [customer, setCustomer] = useState([]);
    const [redirect, setRedirect] = useState([]);
    const emptyCustomer = {
        id: 0,
        firstname: "",
        lastname: "",
        streetaddress: "",
        postcode: "",
        city: "",
        phone: "",
        email: "",
        link: "https://customerrest.herokuapp.com/api/customers"
    }

    useEffect( () => getCustomers(), []);

    const getCustomers = () => {
        fetch('https://customerrest.herokuapp.com/api/customers')
        .then(response => response.json())
        .then(data => setCustomer(data.content))
    }

    const addCustomer = (newCustomer, link) => {
        fetch(link, {
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
        if (window.confirm("Are you sure you want to delete this customer?")) {
            fetch(link, { method: 'DELETE' })
            .then(res => getCustomers())
            .catch(err => console.log(err))
        }
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
            <CustomerForm formTitle="Add customer" icon={<AddIcon />} handleSubmit={addCustomer} customer={emptyCustomer} />
            <MaterialTable
                columns={[
                    { title: "Actions", field: "actions" },
                    { title: "First name", field: "firstname" },
                    { title: "Last name", field: "lastname" },
                    { title: "Street address", field: "streetaddress" },
                    { title: "Postcode", field: "postcode" },
                    { title: "City", field: "city" },
                    { title: "Email", field: "email" },
                    { title: "Phone", field: "phone" }
                ]}
                data={customer.map((cust) => {
                    cust.link = cust.links[0].href;
                    const customerLink = "/customer/id/" + cust.link.split("/").pop();
                    return {
                        actions: <div>
                        <CustomerForm formTitle="Edit" icon={<EditIcon />} handleSubmit={updateCustomer} customer={cust} />
                        <Tooltip title="Delete">
                            <IconButton aria-label="delete" onClick={() => deleteCustomer(cust.link)}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                        </div>,
                        firstname: <Link to={customerLink}>{cust.firstname}</Link>,
                        lastname: <Link to={customerLink}>{cust.lastname}</Link>,
                        streetaddress: cust.streetaddress,
                        postcode: cust.postcode,
                        city: cust.city,
                        phone: cust.phone,
                        email: cust.email
                    }
                })}
                title="Customers"
                options={
                    { sorting: true,
                     pageSize: 20,
                     headerStyle: {
                        backgroundColor: '#3f51b5',
                        color: '#fff',
                        fontWeight: 'bold'
                    } }
                }
                
            />
        </div>
    );
}

export default CustomerList;
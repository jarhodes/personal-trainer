import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import { Toolbar, Typography, Button } from '@material-ui/core';
import { useParams, Redirect, BrowserRouter } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import moment from 'moment';

function CustomerTrainingList (props) {

    let { id } = useParams();

    const [customer, setCustomer] = useState([]);
    const [training, setTraining] = useState([]);
    const [redirect, setRedirect] = useState([]);
    
    useEffect( () => initStates(), []);

    const initStates = () => {
        getCustomer();
        getTraining();
    }

    const getCustomer = () => {
        fetch('https://customerrest.herokuapp.com/api/customers/' + id)
        .then(response => response.json())
        .then(data => setCustomer(data))
    }

    const getTraining = () => {
        fetch('https://customerrest.herokuapp.com/api/customers/' + id + '/trainings')
        .then(response => response.json())
        .then(data => setTraining(data.content))
    }

    const addTraining = (newTraining) => {
        newTraining.customer = "https://customerrest.herokuapp.com/api/customers/" + id;
        newTraining.date = moment(newTraining.date).format();
        console.log(newTraining);
        fetch('https://customerrest.herokuapp.com/api/trainings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTraining)
        })
        .then(res => getTraining())
        .catch(err => console.log(err))
    }

    const deleteTraining = (link) => {
        fetch(link, { method: 'DELETE' })
        .then(res => getTraining())
        .catch(err => console.log(err))
    }


    if (redirect.length !== 0) {
        console.log(redirect);
        return <Redirect push to={redirect} />
    }

    return (
        <div>
            <Toolbar>
                <Typography variant="h6" noWrap>
                    Customer {id}
                </Typography>
            </Toolbar>
            <div style={{textAlign: "left"}}><Button variant="contained" color="secondary" startIcon={<ArrowBackIcon />} onClick={() => window.history.back()}>Back</Button></div>
            <MaterialTable
                columns={[
                    { title: "Date", field: "date", type: "date" },
                    { title: "Activity", field: "activity" },
                    { title: "Duration", field: "duration" },
                    { name: "link", options: { hidden: true }}
                ]}
                data={training.map((train) => {
                    return {
                        date: moment(train.date).format('DD.MM.YYYY'),
                        activity: train.activity,
                        duration: train.duration,
                        link: train.links[0].href
                    }
                })}
                title={"Training sessions for " + customer.firstname +" "+ customer.lastname}
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

export default CustomerTrainingList;
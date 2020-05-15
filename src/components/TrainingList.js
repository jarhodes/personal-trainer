import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import { Toolbar, Typography, Tooltip } from '@material-ui/core';
import { Link } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import moment from 'moment';
import TrainingForm from './TrainingForm';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';


function TrainingList () {

    const [training, setTraining] = useState([]);
    const [customerList, setCustomerList] = useState([]);
    const emptyTraining = {
        id: 0,
        date: '',
        activity: '',
        duration: '',
        customer: "",
        link: "https://customerrest.herokuapp.com/api/trainings"
    }

    useEffect( () => initStates(), []);

    const initStates = () => {
        getTraining();
        getCustomerList();
    }

    const getCustomerList = () => {
        fetch('https://customerrest.herokuapp.com/api/customers')
        .then(response => response.json())
        .then(data => setCustomerList(data.content));
    }

    const getTraining = () => {
        fetch('https://customerrest.herokuapp.com/gettrainings')
        .then(response => response.json())
        .then(data => setTraining(data))
    }

    const addTraining = (newTraining) => {
        newTraining.date = moment(newTraining.date).format();
        newTraining.customer = newTraining.customerLink;
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

    const updateTraining = (editTraining) => {
        editTraining.date = moment(editTraining.date).format();
        editTraining.customer = editTraining.customerLink;
        console.log(editTraining);
        fetch('https://customerrest.herokuapp.com/api/trainings', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editTraining)
        })
        .then(res => getTraining())
        .catch(err => console.log(err))   
    }

    const deleteTraining = (id) => {
        if (window.confirm("Are you sure you want to delete this?")) {
            const link = 'https://customerrest.herokuapp.com/api/trainings/' + id;
            fetch(link, { method: 'DELETE' })
            .then(res => getTraining())
            .catch(err => console.log(err))
        }
    }

    return (
        <div>
            <Toolbar>
                <Typography variant="h6" noWrap>
                    Training sessions
                </Typography>
            </Toolbar>
            <TrainingForm formTitle="Add training" icon={<AddIcon />} handleSubmit={addTraining} training={emptyTraining} customerList={customerList} />
            <MaterialTable
                columns={[
                    { title: "Actions", field: "actions" },
                    { title: "Date", field: "date" },
                    { title: "Activity", field: "activity" },
                    { title: "Duration", field: "duration" },
                    { title: "Customer", field: "customer" }
                ]}
                data={training.map((train) => {
                    let customerLink = "/customer/" + train.customer.id;
                    let customerName = train.customer.firstname + " " + train.customer.lastname;
                    train.customerLink = "https://customerrest.herokuapp.com/api/customers/" + train.customer.id;
                    return {
                    actions: <div>
                    <TrainingForm formTitle="Edit" icon={<EditIcon />} handleSubmit={updateTraining} training={train} customerList={customerList} />
                    <Tooltip title="Delete">
                        <IconButton aria-label="delete" onClick={() => deleteTraining(train.id)}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                    </div>,
                    date: moment(train.date).format('DD.MM.YYYY'),
                    activity: train.activity,
                    duration: train.duration,
                    customer: <Link to={customerLink}>{customerName}</Link>,
                    link: train.id }
                    })}
                title="Training sessions"
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

export default TrainingList;
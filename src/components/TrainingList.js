import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import { Toolbar, Typography, Tooltip } from '@material-ui/core';
import { Redirect, Link } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import moment from 'moment';

function TrainingList () {

    const [training, setTraining] = useState([]);
    const [redirect, setRedirect] = useState([]);

    useEffect( () => getTraining(), []);

    const getTraining = () => {
        fetch('https://customerrest.herokuapp.com/gettrainings')
        .then(response => response.json())
        .then(data => setTraining(data))
    }

    const deleteTraining = (id) => {
        if (window.confirm("Are you sure you want to delete this?")) {
            const link = 'https://customerrest.herokuapp.com/api/trainings/' + id;
            fetch(link, { method: 'DELETE' })
            .then(res => getTraining())
            .catch(err => console.log(err))
        }
    }

     if (redirect.length !== 0) {
        console.log(redirect);
        return <Redirect push to={redirect} />
    }

    return (
        <div>
            <Toolbar>
                <Typography variant="h6" noWrap>
                    Training sessions
                </Typography>
            </Toolbar>
            <MaterialTable
                columns={[
                    { title: "", field: "delete" },
                    { title: "Date", field: "date" },
                    { title: "Activity", field: "activity" },
                    { title: "Duration", field: "duration" },
                    { title: "Customer", field: "customer" }
                ]}
                data={training.map((train) => {
                    let customerLink = "/customer/" + train.customer.id;
                    let customerName = train.customer.firstname + " " + train.customer.lastname;
                    return {
                    delete: <Tooltip title="Delete">
                    <IconButton aria-label="delete" onClick={() => deleteTraining(train.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>,
                    date: moment(train.date).format('DD.mm.YYYY'),
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
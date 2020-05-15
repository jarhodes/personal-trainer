import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Tooltip, IconButton, Select, MenuItem, InputLabel, FormControl } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker, DatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import MomentUtils from '@date-io/moment';
import moment from 'moment';

function TrainingForm(props) {

    const [open, setOpen] = React.useState(false);

    const [training, setTraining] = React.useState([]);

    const handleClickOpen = () => {
        setTraining({
            date: new Date(),
            activity: props.training.activity,
            duration: props.training.duration,
            customerLink: props.training.customerLink
        });
        setOpen(true);
    };
  
    const handleClose = () => {
        setOpen(false);
    };

    const handleInputChange = (event) => {
        setTraining({ ...training, [event.target.name]: event.target.value });
    };

    const handleSubmit = () => {
        props.handleSubmit(training, props.training.link);
        handleClose();
    }

    const handleDateChange = (date) => {
        console.log(date);
        setTraining({ ...training, date: date._d })
    }

    return (
        <div>
            <Tooltip title={props.formTitle}>
                <IconButton aria-label={props.formTitle} onClick={handleClickOpen}>
                    {props.icon}
                </IconButton>
            </Tooltip>
            
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{props.formTitle}</DialogTitle>
                <DialogContent>
                    <MuiPickersUtilsProvider utils={MomentUtils} moment={moment}>
                        <DatePicker 
                            format={'DD.MM.YYYY'}
                            value={moment(training.date, 'DD.MM.YYYY')}
                            autoOk={true}
                            onChange={handleDateChange} 
                            name="date"
                            label="Date"
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            name="activity"
                            value={training.activity}
                            onChange={e => handleInputChange(e)}
                            label="Activity"
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            name="duration"
                            value={training.duration}
                            onChange={e => handleInputChange(e)}
                            label="Duration"
                            fullWidth
                        />
                        <FormControl
                            margin="dense"
                            fullWidth
                        >
                        <InputLabel id="select-label">Customer</InputLabel>
                        <Select
                            labelId="select-label"
                            value={training.customerLink}
                            onChange={e => handleInputChange(e)}
                            name="customerLink"
                        >
                            {props.customerList.map((cust) => {
                                let customerName = cust.firstname + " " + cust.lastname;
                                return (
                                    <MenuItem value={cust.links[0].href}>{customerName}</MenuItem>
                                );
                            })}
                        </Select>
                        </FormControl>
                    </MuiPickersUtilsProvider>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default TrainingForm;
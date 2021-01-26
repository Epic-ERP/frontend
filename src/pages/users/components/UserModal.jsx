import React from 'react';
import { Modal, Paper, Grid, CircularProgress, withStyles, Typography, Divider, FormControlLabel, Switch } from '@material-ui/core';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

import { FetchUser, CreateUser, UpdateUser } from 'redux/user/action'
import Button from 'components/Button/Button.component';

toast.configure()

const styles = theme => ({
    modalBody: {
        top: "50%",
        left: "50%",
        position: "absolute",
        transform: "translate(-50%,-50%)",
        display: "flex",
        flexDirection: "column",
        padding: 50
    }
});

class EditModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            submit: {},
        }
    }

    componentDidMount() {
        if (this.props.userId !== null && this.props.userId !== undefined) {
            this.props.FetchUser(this.props.userId);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.selectedUser !== prevProps.selectedUser) {
            this.setState({
                user: { ...this.props.selectedUser } ?? {}
            })

            if (prevProps.selectedUser && this.props.selectedUser) {
                const action = this.props.userId ? "updated" : "created";
                toast.success(`User ${this.props.selectedUser.full_name} ${action} successfully 🙌`, {
                    position: toast.POSITION.TOP_CENTER
                });
            }
        }
    }

    handleInputChange = (event) => {

        let user = this.state.user;
        let submit = this.state.submit;
        let checkbox = event.target.type === "checkbox";
        user[event.target.name] = checkbox ? event.target.checked : event.target.value;
        submit[event.target.name] = user[event.target.name];
        this.setState({ user, submit });

    }

    handleSubmit = (event) => {
        event.preventDefault();

        const { submit } = this.state;
        const { userId, selectedUser } = this.props;
        const submit_keys = Object.keys(submit);

        if (userId) {
            if (submit_keys.length && !submit_keys.every(key => selectedUser[key] === submit[key])) {
                this.props.UpdateUser(userId, submit);
            } else {
                toast.error('Please update some information 😓', {
                    position: toast.POSITION.TOP_CENTER
                })
            }
        } else {
            if (['email', 'type', 'password'].every(key => submit.hasOwnProperty(key) && submit[key])) {
                this.props.CreateUser(submit);
            } else {
                toast.error('Please add email, type and password 😓', {
                    position: toast.POSITION.TOP_CENTER
                })
            }
        }
    }

    render() {
        const { classes, userId } = this.props;
        const action = userId ? "Update" : "Create";

        if (this.props.isLoading) {
            return (
                <Modal open={this.props.isOpen} onClose={this.props.onClose}>
                    <Paper className={classes.modalBody} component={Grid} item>
                        <CircularProgress size="3em" />
                    </Paper>
                </Modal>
            );
        }

        return (
            <Modal open={this.props.isOpen} onClose={this.props.onClose}>
                <Paper className={classes.modalBody} component={Grid} item>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Typography color='primary'><h1>{action} User</h1></Typography>
                    </div>

                    <Divider />

                    <input type="text" name="full_name" placeholder="Full Name" value={this.state.user.full_name ?? ""} onChange={this.handleInputChange} />
                    <input type="email" name="email" placeholder="Email" value={this.state.user.email ?? ""} onChange={this.handleInputChange} />

                    {
                        userId &&
                        <FormControlLabel
                            control={<Switch name="is_active" checked={this.state.user.is_active ?? false}
                                             onChange={this.handleInputChange} color="primary"/>}
                            label="Active" style={{marginLeft: "auto", marginRight: "auto"}}
                        />
                    }

                    <select name="type" placeholder="User Type" value={this.state.user.type ?? ""} onChange={this.handleInputChange} >
                        <option hidden={true} disabled={true} value="">User Type</option>
                        <option value="student">Student</option>
                        <option value="professor">Professor</option>
                        <option value="admin">Admin</option>
                        <option value="superuser">Superuser</option>
                    </select>

                    {/* <input type="text" name="profile_picture" value={this.state.user.profile_picture??""} onChange={this.handleInputChange}></input> */}

                    <input type="password" name="password" placeholder="Password" value={this.state.user.password ?? ""} onChange={this.handleInputChange} />

                    <Button onClick={this.handleSubmit} color="primary" variant="contained">Submit</Button>
                </Paper>
            </Modal>

        )
    }
}


const mapStateToProps = (state) => ({
    selectedUser: state.user.selectedUser,
    isLoading: state.user.isLoading,
    errorMessage: state.user.errorMessage
})

export default withStyles(styles)(
    connect(mapStateToProps, { FetchUser, CreateUser, UpdateUser })(EditModal)
);
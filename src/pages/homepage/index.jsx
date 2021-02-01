import { Component, createRef } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { withStyles, Grid, TextField, IconButton } from "@material-ui/core";
import { AddAPhoto } from "@material-ui/icons";
import { toast } from "react-toastify";

import CenterContent from "components/CenterContent";
import Button from "components/Button";
import Loader from "components/Loader";
import { UpdateUserMe } from "redux/user/action";

const styles = (theme) => ({
    textField: {
        width: "30%",
    },
    action: {
        width: "30%",
        ...theme.styles.centerItem,
    },
    image: {
        maxHeight: "10rem",
        maxWidth: "10rem",
        marginBottom: "2rem",
        borderRadius: "4px",
    },
    fullScreen: {
        height: "100%",
        width: "100%",
        overflow: "auto",
    },
});

class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: { ...this.props.currentUser },
            submit: {},
        };

        this.fileInput = createRef();
        this.reader = new FileReader();
        this.reader.onloadend = () => {
            let { currentUser, submit } = this.state;
            submit["profile_picture"] = currentUser["profile_picture"] = this.reader.result;
            this.setState({ submit, currentUser });
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.currentUser !== this.props.currentUser) {
            toast.success(`Updated successfully 🙌`, {
                position: toast.POSITION.TOP_CENTER,
            });
        }
    }

    handleInputChange = (event) => {
        let { currentUser, submit } = this.state;
        if (event.target.type === "file") {
            this.reader.readAsDataURL(this.fileInput.current.files[0]);
        } else {
            submit[event.target.name] = currentUser[event.target.name] = event.target.value;
        }
        this.setState({ currentUser, submit });
    };

    handleSubmit = (event) => {
        event.preventDefault();

        const { submit } = this.state;
        const { currentUser } = this.props;
        const submit_keys = Object.keys(submit);

        if (submit_keys.length && !submit_keys.every((key) => currentUser[key] === submit[key])) {
            if (
                submit.hasOwnProperty("password") &&
                !(submit.hasOwnProperty("confirm_password") && submit.password === submit.confirm_password)
            ) {
                toast.error("Passwords don't match 😓", {
                    position: toast.POSITION.TOP_CENTER,
                });
            } else {
                delete submit.confirm_password;
                this.props.UpdateUserMe(submit);
            }
        } else {
            toast.error("Please update some information 😓", {
                position: toast.POSITION.TOP_CENTER,
            });
        }
    };

    render() {
        const { currentUser } = this.state;

        if (this.props.isLoading) {
            return <Loader />;
        }

        const { classes } = this.props;

        if (!currentUser.profile_picture) {
            currentUser.profile_picture = "/logos/revamp_favicon_transparent.png";
        }

        return (
            <CenterContent>
                <form className={classes.fullScreen} onSubmit={this.handleSubmit}>
                    <Grid
                        container
                        direction="column"
                        justify="space-evenly"
                        wrap="nowrap"
                        className={classes.fullScreen}
                    >
                        <Grid container direction="column" alignItems="center">
                            <img className={classes.image} src={currentUser.profile_picture} alt="" />
                            <IconButton color="primary" component="label" hidden={!currentUser.is_admin}>
                                <AddAPhoto />
                                <input
                                    type="file"
                                    name="profile_picture"
                                    accept="image/png, image/jpeg"
                                    ref={this.fileInput}
                                    onChange={this.handleInputChange}
                                    hidden
                                />
                            </IconButton>
                        </Grid>

                        <Grid container justify="space-around">
                            <TextField
                                className={classes.textField}
                                label="Full Name"
                                name="full_name"
                                value={currentUser.full_name}
                                disabled={!currentUser.is_admin}
                                onChange={this.handleInputChange}
                            />
                            <TextField
                                className={classes.textField}
                                label="Email"
                                name="email"
                                value={currentUser.email}
                                disabled={!currentUser.is_admin}
                                onChange={this.handleInputChange}
                            />
                        </Grid>

                        <Grid container justify="space-around" hidden={!currentUser.is_admin}>
                            <TextField
                                type="password"
                                className={classes.textField}
                                label="Password"
                                name="password"
                                onChange={this.handleInputChange}
                            />
                            <TextField
                                type="password"
                                className={classes.textField}
                                label="Confirm Password"
                                name="confirm_password"
                                onChange={this.handleInputChange}
                            />
                        </Grid>

                        <Button
                            type="submit"
                            variant="contained"
                            className={classes.action}
                            hidden={!currentUser.is_admin}
                        >
                            Update
                        </Button>
                    </Grid>
                </form>
            </CenterContent>
        );
    }
}

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser,
    isLoading: state.user.isLoading,
});

export default withRouter(connect(mapStateToProps, { UpdateUserMe })(withStyles(styles)(Homepage)));

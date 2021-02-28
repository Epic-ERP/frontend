import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Switch } from "react-router-dom";
import { withStyles, Grid } from "@material-ui/core";
import { toast } from "react-toastify";

import SideBar from "components/SideBar";
import Header from "components/Header";
import AuthenticatedRoute from "components/AuthenticatedRoute";
import Users from "pages/users";
import Schools from "pages/schools";
import Homepage from "pages/homepage";

toast.configure();

const useStyles = (theme) => ({
    content: {
        padding: theme.spacing(3),
        flex: 2,
        flexGrow: 1,
        height: "valuemax",
    },
    offset: theme.mixins.toolbar,
    fullScreen: {
        display: "flex",
        height: "100%",
        width: "100%",
    },
});

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            drawerOpen: false,
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // check if any new error message needs to be displayed
        for (let i = 0; i < this.props.errorMessage.length; i++) {
            if (prevProps.errorMessage[i] !== this.props.errorMessage[i] && this.props.errorMessage[i]) {
                toast.error(`Error 😓: ${this.props.errorMessage[i]}`, {
                    position: toast.POSITION.TOP_CENTER,
                });
            }
        }
    }

    switchDrawer = () => {
        this.setState({
            drawerOpen: !this.state.drawerOpen,
        });
    };

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.fullScreen}>
                <Header handleMenuButtonClick={this.switchDrawer} />
                <SideBar drawerOpen={this.state.drawerOpen} />
                <Grid container direction="column" style={{ height: "100%" }}>
                    <div className={classes.offset} />
                    <Grid item className={classes.content}>
                        <Switch>
                            <AuthenticatedRoute exact path={`${this.props.match.url}/users`} component={Users} />
                            <AuthenticatedRoute exact path={`${this.props.match.url}/schools`} component={Schools} />
                            <AuthenticatedRoute exact path={`${this.props.match.url}/`} component={Homepage} />
                        </Switch>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser,
    errorMessage: [state.user.errorMessage, state.school.errorMessage],
});

export default withRouter(connect(mapStateToProps)(withStyles(useStyles)(Dashboard)));

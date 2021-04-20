import React, { Component } from "react";
import { connect } from "react-redux";
import { Switch, withRouter } from "react-router-dom";
import { Grid, withStyles } from "@material-ui/core";

import SideBar from "components/SideBar";
import Header from "components/Header";
import AuthenticatedRoute from "components/AuthenticatedRoute";
import Users from "pages/users";
import Schools from "pages/schools";
import Homepage from "pages/homepage";
import Years from "pages/years";
import Terms from "pages/terms";
import Courses from "pages/courses";
import Admins from "pages/admins";

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
                <SideBar drawerOpen={this.state.drawerOpen} switchDrawer={this.switchDrawer} />
                <Grid container direction="column" style={{ height: "100%" }}>
                    <div className={classes.offset} />
                    <Grid item className={classes.content}>
                        <Switch>
                            <AuthenticatedRoute
                                exact
                                path={`${this.props.match.url}/users`}
                                component={Users}
                                permission="user"
                            />
                            <AuthenticatedRoute
                                exact
                                path={`${this.props.match.url}/schools`}
                                component={Schools}
                                permission="school"
                            />
                            <AuthenticatedRoute
                                exact
                                path={`${this.props.match.url}/years`}
                                component={Years}
                                permission="year"
                            />
                            <AuthenticatedRoute
                                exact
                                path={`${this.props.match.url}/terms`}
                                component={Terms}
                                permission="term"
                            />
                            <AuthenticatedRoute
                                exact
                                path={`${this.props.match.url}/courses`}
                                component={Courses}
                                permission="course"
                            />
                            <AuthenticatedRoute
                                exact
                                path={`${this.props.match.url}/admins`}
                                component={Admins}
                                permission="admin"
                            />
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
});

export default withRouter(connect(mapStateToProps)(withStyles(useStyles)(Dashboard)));

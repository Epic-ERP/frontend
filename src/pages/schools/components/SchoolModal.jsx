import React from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { Divider, TextField, Typography, withStyles } from "@material-ui/core";

import { CreateSchool, FetchSchool, UpdateSchool } from "redux/school/action";
import Button from "components/Button";
import PopupModal from "components/PopupModal";

toast.configure();

const styles = (theme) => ({
    form: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        height: "100%",
    },
    centerItem: theme.styles.centerItem,
});

class SchoolModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            school: {},
            submit: {},
            errors: {
                name: "",
                head: "",
            },
            formSubmitted: false,
        };
    }

    componentDidMount() {
        if (this.props.schoolId !== null && this.props.schoolId) {
            this.props.FetchSchool(this.props.schoolId);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.selectedSchool !== prevProps.selectedSchool) {
            this.setState({
                school: { ...this.props.selectedSchool } ?? {},
            });

            if (this.state.formSubmitted) {
                const action = this.props.schoolId ? "updated" : "created";
                toast.success(`${this.props.selectedSchool.name} ${action} successfully 🙌`, {
                    position: toast.POSITION.TOP_CENTER,
                });
                this.props.onClose();
            }
        }
    }

    validateInput = (event) => {
        event.preventDefault();

        let errors = this.state.errors;
        const { name, value } = event.target;

        // validate input
        const fieldName = name === "name" ? "School" : "School Head";
        errors[name] = value ? "" : fieldName + " name cannot be empty";

        this.setState({ errors });
    };

    handleInputChange = (event) => {
        let school = this.state.school;
        let submit = this.state.submit;
        const { name, value } = event.target;

        // validate new input value
        this.validateInput(event);
        // update value in submit if it is valid
        if (!this.state.errors[name]) {
            submit[name] = value;
        }

        school[name] = value;
        this.setState({ school, submit });
    };

    handleSubmit = (event) => {
        event.preventDefault();

        const { submit, errors } = this.state;

        // make sure there are no errors
        if (errors.name || errors.head) return;

        const { schoolId, selectedSchool } = this.props;
        const submit_keys = Object.keys(submit);

        if (schoolId) {
            if (submit_keys.length && !submit_keys.every((key) => selectedSchool[key] === submit[key])) {
                this.props.UpdateSchool(submit);
                this.setState({ formSubmitted: true });
            } else {
                toast.error("Please update some information 😓", {
                    position: toast.POSITION.TOP_CENTER,
                });
            }
        } else {
            if (submit.name && submit.head) {
                this.props.CreateSchool(submit);
                this.setState({ formSubmitted: true });
            } else {
                toast.error("Please add School name and Head name 😓", {
                    position: toast.POSITION.TOP_CENTER,
                });
            }
        }
    };

    render() {
        const { classes, schoolId, isLoading, isOpen, onClose } = this.props;
        const action = schoolId ? "Update" : "Create";

        return (
            <PopupModal isLoading={isLoading} isOpen={isOpen} onClose={onClose}>
                <div style={{ textAlign: "center" }}>
                    <Typography color="primary" variant="h3">
                        {action} School
                    </Typography>
                </div>

                <Divider style={{ marginBottom: "1rem" }} />

                <form onSubmit={this.handleSubmit} className={classes.form}>
                    <TextField
                        name="name"
                        label="Name"
                        value={this.state.school.name ?? ""}
                        required={true}
                        onBlur={this.validateInput}
                        onChange={this.handleInputChange}
                        error={this.state.errors.name}
                        helperText={this.state.errors.name}
                    />
                    <TextField
                        name="head"
                        label="Head"
                        value={this.state.school.head ?? ""}
                        required={true}
                        onBlur={this.validateInput}
                        onChange={this.handleInputChange}
                        error={this.state.errors.head}
                        helperText={this.state.errors.head}
                    />
                    <Button type="submit" color="primary" variant="contained">
                        Submit
                    </Button>
                </form>
            </PopupModal>
        );
    }
}

const mapStateToProps = (state) => ({
    selectedSchool: state.school.selectedSchool,
    isLoading: state.school.isLoading,
    errorMessage: state.school.errorMessage,
});

export default withStyles(styles)(connect(mapStateToProps, { FetchSchool, CreateSchool, UpdateSchool })(SchoolModal));
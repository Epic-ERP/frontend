import React from "react";
import { connect } from "react-redux";
import { fetchStudentsForSelectedTerm, deleteStudentFromSelectedTerm, fetchTerm } from "redux/term/action";
import { Delete } from "mdi-material-ui";
import {
    withStyles,
    Tooltip,
    IconButton,
    Dialog,
    DialogTitle,
    Typography,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextareaAutosize,
    Divider,
} from "@material-ui/core";

import DataPage from "components/DataPage";
import Button from "components/Button";

import StudentModal from "../components/StudentModal";
import PopupModal from "components/PopupModal";

const styles = (theme) => ({
    centerItem: theme.styles.centerItem,
    error: {
        color: theme.palette.error.main,
        "&:hover": {
            backgroundColor: theme.palette.error.main,
            color: "#000000",
        },
    },
    success: {
        color: theme.palette.success.main,
        "&:hover": {
            backgroundColor: theme.palette.success.main,
            color: "#000000",
        },
    },
});

class TermDetails extends React.Component {
    columns = [
        {
            field: "id",
            headerName: "ID",
            headerAlign: "center",
            align: "center",
            width: 350,
            hide: true,
        },
        {
            field: "full_name",
            headerName: "Name",
            headerAlign: "center",
            align: "center",
            width: 350,
            valueFormatter: ({ row }) => `${row.user.full_name}`,
        },
        {
            field: "email",
            headerName: "Email ID",
            headerAlign: "center",
            align: "center",
            width: 350,
            valueFormatter: ({ row }) => `${row.user.email}`,
        },
        {
            field: "school",
            headerName: "School",
            headerAlign: "center",
            align: "center",
            width: 350,
            valueFormatter: ({ row }) => `${row.term.year.school.name}`,
        },
        {
            field: "year",
            headerName: "Year",
            headerAlign: "center",
            align: "center",
            width: 350,
            valueFormatter: ({ row }) => `${row.term.year.name}`,
            hide: true,
        },
        {
            field: "actions",
            headerName: "Actions",
            headerAlign: "center",
            flex: 1,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <div className={this.props.classes.centerItem}>
                    <Tooltip title="Delete">
                        <IconButton onClick={() => this.onDelete(params)}>
                            <Delete color={"error"} />
                        </IconButton>
                    </Tooltip>
                </div>
            ),
        },
    ];

    constructor(props) {
        super(props);

        this.state = {
            termId: this.props.match.params.termid,
            deleteConfirmAlert: false,
            modalIsOpen: false,
            responseModal: false,
        };
    }

    componentDidMount() {
        this.props.fetchTerm(this.state.termId);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.selectedTerm !== this.props.selectedTerm && this.props.selectedTerm) {
            this.props.fetchStudentsForTerm();
        }

        if (prevProps.addStudentsResponse !== this.props.addStudentsResponse && this.props.addStudentsResponse) {
            this.setState({ responseModal: true });
        }
    }

    onDelete = ({ row }) =>
        this.setState({ deleteConfirmAlert: true, studentId: row.id, studentName: row.user.full_name });

    onDeleteClose = () => this.setState({ deleteConfirmAlert: false, studentId: null, studentName: null });

    deleteStudent = () => {
        this.props.deleteStudentFromTerm(this.state.studentId);
        this.onDeleteClose();
    };

    openModal = () => this.setState({ modalIsOpen: true });

    closeModal = () => this.setState({ modalIsOpen: false });

    generateErrorsList = () => {
        const { errors } = this.props.addStudentsResponse;

        return (
            <>
                {Object.keys(errors).map((key) => (
                    <>
                        <Typography variant="h6">{key.charAt(0).toUpperCase() + key.slice(1)}:</Typography>
                        <TextareaAutosize value={errors[key].join()} disabled />
                        <br />
                    </>
                ))}
            </>
        );
    };

    render() {
        const { studentsForTerm, isLoading, selectedTerm, classes, addStudentsResponse } = this.props;
        const { deleteConfirmAlert, studentId, studentName, modalIsOpen, responseModal } = this.state;

        //! Not the best logic, but works for now
        const termName = selectedTerm ? selectedTerm.name : "";
        return (
            <>
                <DataPage
                    title={termName}
                    isLoading={isLoading}
                    modalIsOpen={modalIsOpen}
                    openModal={this.openModal}
                    PopupModal={<StudentModal isOpen={modalIsOpen} onClose={this.closeModal} />}
                    objects={studentsForTerm}
                    columns={this.columns}
                />

                {deleteConfirmAlert && studentId && (
                    <Dialog open={deleteConfirmAlert} onClose={this.onDeleteClose}>
                        <DialogTitle>
                            <Typography variant="h6" color="primary">
                                Delete Student?
                            </Typography>
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Are you sure you want to delete <strong>{studentName}</strong> from{" "}
                                <strong>{selectedTerm.name}</strong>?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.onDeleteClose} className={classes.error}>
                                No
                            </Button>
                            <Button onClick={this.deleteStudent} className={classes.success}>
                                Yes
                            </Button>
                        </DialogActions>
                    </Dialog>
                )}

                {addStudentsResponse && (
                    <PopupModal isOpen={responseModal} onClose={() => this.setState({ responseModal: false })}>
                        <div style={{ textAlign: "center" }}>
                            <Typography color="primary" variant="h5">
                                Success
                            </Typography>
                        </div>
                        <TextareaAutosize
                            value={addStudentsResponse.success ? addStudentsResponse.success.join() : ""}
                            disabled
                        />

                        <Divider style={{ marginBottom: "1rem" }} />

                        <div style={{ textAlign: "center" }}>
                            <Typography color="error" variant="h5">
                                Errors
                            </Typography>
                        </div>
                        {this.generateErrorsList()}
                    </PopupModal>
                )}
            </>
        );
    }
}

const mapStateToProps = (state) => ({
    studentsForTerm: state.term.studentsForTerm,
    isLoading: state.term.isLoading,
    selectedTerm: state.term.selectedTerm,
    addStudentsResponse: state.term.addStudentsResponse,
});

export default withStyles(styles)(
    connect(mapStateToProps, {
        fetchStudentsForTerm: fetchStudentsForSelectedTerm,
        deleteStudentFromTerm: deleteStudentFromSelectedTerm,
        fetchTerm,
    })(TermDetails)
);
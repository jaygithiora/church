import {
    Alert,
    alpha,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormGroup,
    FormHelperText,
    IconButton,
    Pagination,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    useTheme,
} from "@mui/material";
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
//import { formatDistanceToNow } from "date-fns";
import { MdClose, MdDeleteOutline} from "react-icons/md";
import { useAuth } from "../../../services/AuthContext";
import { FaBan, FaEdit, FaPlus } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { useSnackbar } from "notistack";
import PeopleService from "../../../services/dashboard/people/PeopleService";
import UsersSelectComponent from "../../../components/dashboard/users/UsersSelectComponent";
import { useParams } from "react-router-dom";
import { FaPeopleGroup } from "react-icons/fa6";

function PeopleMembersPage() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const {enqueueSnackbar} = useSnackbar();
    const {id} = useParams();
    const formRef = useRef(null);
    const { loading, setLoading } = useAuth();
    const [reload, setReload] = useState(false);
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [person, setPerson] = useState(null);
    const [errors, setErrors] = useState({
        person: "",
        users:""
    });

    const [members, setMembers] = useState([]);
    const [pages, setPages] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        if(id != undefined){
            getPerson();
        }
    }, [id]);

    useEffect(() => {
        getPeople();
    }, [reload, pages]);

    const getPerson = async () => {
        setLoading(true);
        const personData =
            await PeopleService.getPerson(id, enqueueSnackbar);
        if (members) {
            //console.log(personData);
            setPerson(personData);
        }
        setLoading(false);
    };
    const getPeople = async () => {
        setLoading(true);
        const membersData =
            await (id != undefined?PeopleService.getPersonMembers(id, pages, enqueueSnackbar):PeopleService.getMembers(pages, enqueueSnackbar));
        if (members) {
            //console.log(membersData);
            setMembers(membersData.data);
            setTotalPages(membersData.last_page);
        }
        setLoading(false);
    };
    // Call this function when new data is added
    const refreshPeople = () => {
        setReload((prev) => !prev); // Toggle state to trigger useEffect
    };
    const handleAddMembers = () => {
        handleClickOpen();
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDeleteMember = async (member) => {
        
            setLoading(true);
            const data = await PeopleService.deleteMember(
                {id:member?.id}, enqueueSnackbar
            );
            if (data) {
                //handleClose();
                refreshPeople();
            }
            setLoading(false);
    };

    const handleSaveMembers = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setLoading(true);
      const userIds = users.map(option => option.value)
            const data = await PeopleService.addMembers(
                {users:userIds,id:id}, enqueueSnackbar
            );
            if (data) {
                handleClose();
                refreshPeople();
            }
            setLoading(false);
        }
    };

    const validateForm = () => {
        let valid = true;
        const errorsCopy = { ...errors };

        if (id != undefined) {
            errorsCopy.person = "";
        } else {
            errorsCopy.person = "Invalid Group Id";
            enqueueSnackbar(errorsCopy.person, {variant:"error"});
            valid = false;
        } 

        if (users.length > 0) {
            errorsCopy.users = "";
        } else {
            errorsCopy.users = "Add Users before proceeding";
            enqueueSnackbar(errorsCopy.users, {variant:"error"});
            valid = false;
        } /*
    if (status) {
      errorsCopy.status = "";
    } else {
      errorsCopy.status = "Status is required";
      valid = false;
    }*/
        setErrors(errorsCopy);
        return valid;
    };

    return (
        <Container fluid>
            <Row>
                <Col sm={9} className="p-3">
                    <h5>
                        <FaPeopleGroup /> {person != null?person.name:""} Members
                    </h5>
                </Col>

                <Col sm={3} className="text-end p-3">
                    {id!=undefined&&<Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddMembers}
                    >
                        <FaPlus /> ADD
                    </Button>}
                </Col>
                <Col sm={12}>
                    <TableContainer
                        component={Paper}
                        sx={(theme) => ({
                            backgroundColor: alpha(theme.palette.background.paper, 0.5),
                        })}
                    >
                        <Table sx={{ minWidth: 650 }} aria-label="members Table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Phone</TableCell>
                                    <TableCell>Group</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell align="right">Action</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {members.length > 0 ? (
                                    members.map((member, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                        >
                                            <TableCell component="th">{index + 1}</TableCell>
                                            <TableCell component="th">{member.user?.firstname} {member.user?.lastname}</TableCell>
                                            <TableCell component="th">{member.user?.email}</TableCell>
                                            <TableCell component="th">{member.user?.phone}</TableCell>
                                            <TableCell component="th">{member.person?.name??person?.name}</TableCell>
                                            <TableCell component="th">
                                                {formatDistanceToNow(new Date(member.created_at), { addSuffix: true })}
                                            </TableCell>
                                            <TableCell component="th" align="right">
                                                <IconButton
                                                    color="error"
                                                    onClick={() =>
                                                        handleDeleteMember(member)
                                                    }
                                                >
                                                    <MdDeleteOutline />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7}>
                                            {!loading ? (
                                                <Box
                                                    display="flex"
                                                    justifyContent="center"
                                                    alignItems="center"
                                                    height="100%"
                                                >
                                                    <Alert icon={<FaBan />} severity="warning">
                                                        No <b>Members</b> yet
                                                    </Alert>
                                                </Box>
                                            ) : (
                                                <div className="text-center">
                                                    Loading <b>Members</b>...
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Col>
                {/*
                {members.length > 0 ? members.map((loan_document, index) => (
                    <Col sm={6} md={4} className="p-3" key={index}>
                        <Card className='border h-100'>
                            <CardHeader className='border-bottom' avatar={<Avatar className='border-dark'><MdAddShoppingCart className='text-dark' /></Avatar>}
                                title={loan_document.name} subheader={formatDistanceToNow(new Date(loan_document.created_at), { addSuffix: true })}></CardHeader>
                            <CardContent className='p-0'>

                            </CardContent>
                            <CardActions className='border-top pb-3 pt-3'>
                                {!loan_document.status && <Badge bg='secondary' className='btn-pill ps-3 pe-3'>Inactive</Badge>}
                                {loan_document.status && <Badge bg='primary' className='btn-pill ps-3 pe-3'>Active</Badge>}
                            </CardActions>
                        </Card>
                    </Col>
                )) : (!loading && <Col xs={12} className='pt-5 pb-5'>
                    <div className='alert my-bg-secondary text-center text-muted'><Image src='/assets/no-data.svg' className='no-data-img' /> <br></br>No <b>delivery settings</b> yet</div>
                </Col>)}*/}
                {/* Material-UI Pagination Component */}
                {totalPages > 1 && (
                    <Pagination
                        count={totalPages}
                        page={pages}
                        onChange={(event, value) => setPages(value)}
                        color="primary"
                        className="d-flex justify-content-center mt-3"
                    ></Pagination>
                )}
                {/*Add Loan Document Modal*/}
                <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
                    <DialogTitle>
                        <FaPeopleGroup /> Add Members
                        <IconButton
                            aria-label="close"
                            onClick={handleClose}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                color: (theme) => theme.palette.grey[500],
                            }}
                        >
                            <MdClose />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <Form ref={formRef} onSubmit={handleSaveMembers}>
                            <Row className="mt-3">
                                <FormGroup className="col-sm-12 mb-3">
                                    <UsersSelectComponent selectedOption={users} onSelectChange={setUsers}/>
                                    {errors.users && <FormHelperText error>{errors.users}</FormHelperText>}
                                    {errors.id && <FormHelperText error>{errors.id}</FormHelperText>}
                                </FormGroup>
                            </Row>
                        </Form>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="dark" onClick={handleClose}>
                            Close
                        </Button>
                        &nbsp;
                        <Button
                            disabled={loading}
                            variant="contained"
                            color="primary"
                            onClick={() => formRef.current.requestSubmit()}
                        >
                            {loading && (
                                <div
                                    className="spinner-border spinner-border-sm text-light"
                                    role="status"
                                >
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            )}
                            &nbsp;Save Changes
                        </Button>
                    </DialogActions>
                </Dialog>
                {/*End Loan Document Dialog*/}
            </Row>
        </Container>
    );
}

export default PeopleMembersPage;

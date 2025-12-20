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
import { MdClose, MdEdit} from "react-icons/md";
import { useAuth } from "../../../services/AuthContext";
import { FaBan, FaEdit, FaPeopleArrows, FaPlus } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { useSnackbar } from "notistack";
import PeopleService from "../../../services/dashboard/people/PeopleService";
import UserSelectComponent from "../../../components/dashboard/users/UserSelectComponent";
import RolesSelectComponent from "../../../components/dashboard/users/RolesSelectComponent";
import AgeGroupSelectComponent from "../../../components/dashboard/settings/AgeGroupSelectComponent";
import { useNavigate } from "react-router-dom";

function PeoplePage() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const {enqueueSnackbar} = useSnackbar();
    const navigate = useNavigate();
    const { loading, setLoading } = useAuth();
    const [reload, setReload] = useState(false);
    const formRef = useRef(null);
    const [formData, setFormData] = useState({ id: 0, name: "", description:"", age_group:"", role:"", user:"" });
    const [ageGroup, setAgeGroup] = useState(null);
    const [role, setRole] = useState(null);
    const [user, setUser] = useState(null);
    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState({
        name: "",
        description:"",
        age_group: "",
        role: "",
        user: "",
    });

    const [people, setPeople] = useState([]);
    const [pages, setPages] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        setFormData((prev)=>({...prev, age_group:ageGroup?.value, user:user?.value, role:role?.value}));
    }, [role, user,ageGroup]);

    useEffect(() => {
        getPeople();
    }, [reload, pages]);

    const getPeople = async () => {
        setLoading(true);
        const peopleData =
            await PeopleService.getPeople(pages, enqueueSnackbar);
        if (people) {
            //console.log(peopleData);
            setPeople(peopleData.data);
            setTotalPages(peopleData.last_page);
        }
        setLoading(false);
    };
    // Call this function when new data is added
    const refreshPeople = () => {
        setReload((prev) => !prev); // Toggle state to trigger useEffect
    };
    const handleEditPerson = (person) => {
        setFormData({ ...formData, id: person.id, name: person.name, description:person.description });
        setAgeGroup({value:person.age_group?.id, label:person.age_group?.name});
        setUser({value:person.user?.id, label:`${person.user?.firstname} ${person.user?.lastname} (${person.user?.email}`});
        setRole({value:person.role?.id, label:person.role?.name});
        handleClickOpen();
    };
    const handleNewPerson = () => {
        setFormData({ ...formData, id: 0, name: "", description:"",});
        setAgeGroup(null);
        setUser(null);
        setRole(null);
        handleClickOpen();
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSavePerson = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setLoading(true);
            const data = await PeopleService.addPerson(
                formData, enqueueSnackbar
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

        if (formData.name) {
            errorsCopy.name = "";
        } else {
            errorsCopy.name = "Name is required";
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
                        <FaPeopleArrows /> People
                    </h5>
                </Col>

                <Col sm={3} className="text-end p-3">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNewPerson}
                    >
                        <FaPlus /> ADD
                    </Button>
                </Col>
                <Col sm={12}>
                    <TableContainer
                        component={Paper}
                        sx={(theme) => ({
                            backgroundColor: alpha(theme.palette.background.paper, 0.5),
                        })}
                    >
                        <Table sx={{ minWidth: 650 }} aria-label="people Table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Age Group</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>User</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell align="right">Action</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {people.length > 0 ? (
                                    people.map((person, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{ "&:last-child td, &:last-child th": { border: 0 },cursor: 'pointer'  }} 
                                            hover 
                                            onClick={()=>{
                                                navigate(`/dashboard/people/members/view/${person.id}`);
                                            }}
                                        >
                                            <TableCell component="th">{index + 1}</TableCell>
                                            <TableCell component="th">{person.name}</TableCell>
                                            <TableCell component="th">{person.description}</TableCell>
                                            <TableCell component="th">{person.age_group?.name}</TableCell>
                                            <TableCell component="th">{person.role?.name}</TableCell>
                                            <TableCell component="th">{person.user?.firstname} {person.user?.lastname}</TableCell>
                                            <TableCell component="th">
                                                {formatDistanceToNow(new Date(person.created_at), { addSuffix: true })}
                                            </TableCell>
                                            <TableCell component="th" align="right">
                                                <IconButton
                                                    color="primary"
                                                    onClick={(e) =>{
                                                        e.stopPropagation();
                                                        handleEditPerson(person);
                                                    }
                                                    }
                                                >
                                                    <MdEdit />
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
                                                        No <b>People</b> yet
                                                    </Alert>
                                                </Box>
                                            ) : (
                                                <div className="text-center">
                                                    Loading <b>People</b>...
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
                {people.length > 0 ? people.map((loan_document, index) => (
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
                        <FaEdit /> {formData.id > 0 ? "Edit" : "Add"} People
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
                        <Form ref={formRef} onSubmit={handleSavePerson}>
                            <Row className="mt-3">
                                <FormGroup className="col-sm-12 mb-3">
                                    <TextField
                                        label="Name"
                                        size="small"
                                        error={errors.name}
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        helperText={errors.name}
                                    />
                                    {/*errors.firstname && <div className='invalid-feedback d-block'>{errors.firstname}</div>*/}
                                </FormGroup>
                                <FormGroup className="col-sm-12 mb-3">
                                    <TextField multiline
                                        label="Description"
                                        size="small"
                                        error={errors.description}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        helperText={errors.description}
                                    />
                                    {/*errors.firstname && <div className='invalid-feedback d-block'>{errors.firstname}</div>*/}
                                </FormGroup>
                                <FormGroup className="col-sm-12 mb-3">
                                    <UserSelectComponent selectedOption={user} onSelectChange={setUser}/>
                                    {/*errors.firstname && <div className='invalid-feedback d-block'>{errors.firstname}</div>*/}
                                </FormGroup>
                                <FormGroup className="col-sm-12 mb-3">
                                    <RolesSelectComponent selectedOption={role} onSelectChange={setRole}/>
                                    {/*errors.firstname && <div className='invalid-feedback d-block'>{errors.firstname}</div>*/}
                                </FormGroup>
                                <FormGroup className="col-sm-12 mb-3">
                                    <AgeGroupSelectComponent selectedOption={ageGroup} onSelectChange={setAgeGroup}/>
                                    {/*errors.firstname && <div className='invalid-feedback d-block'>{errors.firstname}</div>*/}
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

export default PeoplePage;

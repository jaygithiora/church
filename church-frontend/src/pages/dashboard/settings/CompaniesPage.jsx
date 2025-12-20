import { alpha, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material'
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef, useState } from 'react'
import { Badge, Col, Container, Form, Row } from 'react-bootstrap'
import { formatDistanceToNow } from 'date-fns'
import { MdEdit } from 'react-icons/md'
import { useAuth } from '../../../services/AuthContext'
import { FaBan, FaPlus } from 'react-icons/fa'
import { BsPlus } from 'react-icons/bs'
import { FaBuildingLock } from 'react-icons/fa6'
import CompanyService from '../../../services/dashboard/settings/CompanyService'
import { Autocomplete } from '@react-google-maps/api'

function CompaniesPage() {
    const { loading, setLoading } = useAuth();
    const [reload, setReload] = useState(false);
    const [open, setOpen] = useState(false);
    const [id, setId] = useState(0);

    const formRef = useRef(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [longitude, setLongitude] = useState("");
    const [latitude, setLatitude] = useState("");
    const [status, setStatus] = useState("");
    const [errors, setErrors] = useState({
        name: '',
        description: '',
        status: '',
        location:''
    });

    const [companies, setCompanies] = useState([]);
    const [pages, setPages] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const autocompleteRef = useRef(null);
    const inputRef = useRef(null);

    const onPlaceChanged = () => {
        if (autocompleteRef.current !== null) {
            const place = autocompleteRef.current.getPlace();
            //setName(place.address_components[1].long_name);
            //console.log('Place:', place);
            //setLocation(place.address_components[0].long_name);
            setLocation(inputRef.current.value);
            setLongitude(place.geometry?.location?.lng());
            setLatitude(place.geometry?.location?.lat());
        }
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        getCompanies();
    }, [reload, pages]);

    const getCompanies = async () => {
        setLoading(true);
        const companiesData = await CompanyService.getCompanies(pages);
        if (companiesData) {
            //console.log(companiesData);
            setCompanies(companiesData.data);
            setTotalPages(companiesData.last_page);
        }
        setLoading(false);
    }
    // Call this function when new data is added
    const refreshCompanies = () => {
        setReload(prev => !prev); // Toggle state to trigger useEffect
    };
    const handleEditCompany = (company) => {
        setId(company.id);
        setName(company.name);
        setDescription(company.description);
        setStatus(company.status);
        setLongitude(company?.longitude);
        setLatitude(company?.latitude);
        setLocation(company?.location);
        setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.value = company?.location;
            }
          }, 100); 
        handleClickOpen();
    }
    const handleNewCompany = () => {
        setId(0);
        setName("");
        setDescription("");
        setLongitude("");
        setLatitude("");
        setLocation("");
        setStatus("1");
        handleClickOpen();
    }

    const handleSaveCompany = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setLoading(true);
            const data = await CompanyService.addCompany(id, name, description, location, longitude, latitude, status);
            if (data) {
                handleClose();
                refreshCompanies();
            }
            setLoading(false);
        }
    }

    const validateForm = () => {
        let valid = true;
        const errorsCopy = { ...errors };

        if (name) {
            errorsCopy.name = '';
        } else {
            errorsCopy.name = "Company Name is required";
            valid = false;
        }
        if (location) {
            errorsCopy.location = '';
        } else {
            errorsCopy.location = "Physical Location is required";
            valid = false;
        }
        if (status) {
            errorsCopy.status = '';
        } else {
            errorsCopy.status = "Status is required";
            valid = false;
        }
        setErrors(errorsCopy);
        return valid;
    }

    return (

        <Container fluid>
            <Row>
                <Col sm={9} className='p-3'>
                    <h5><FaBuildingLock /> Companies</h5>
                </Col>

                <Col sm={3} className='text-end p-3'>
                    <Button variant='contained' color='primary' onClick={handleNewCompany}><FaPlus /> ADD</Button>
                </Col>
                <Col sm={12}>
                    <TableContainer
                        component={Paper}
                        sx={(theme) => ({
                            backgroundColor: alpha(theme.palette.background.paper, 0.5),
                        })}
                    >
                        <Table sx={{ minWidth: 650 }} aria-label='Delivery Settings Table'>
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Location</TableCell>
                                    <TableCell>User</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align='right'>Action</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {companies.length > 0 ? companies.map((company, index) => (
                                    <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell component="th">
                                            {company.name}
                                        </TableCell>
                                        <TableCell component="th">
                                            {company.location}
                                        </TableCell>
                                        <TableCell component="th">
                                            {company.user?.firstname} {company.user?.lastname}
                                        </TableCell>
                                        <TableCell component="th">
                                            {formatDistanceToNow(new Date(company.created_at), { addSuffix: true })}
                                        </TableCell>
                                        <TableCell component="th">
                                            {!company.status && <Badge bg='secondary' className='btn-pill ps-3 pe-3'>Inactive</Badge>}
                                            {company.status && <Badge bg='primary' className='btn-pill ps-3 pe-3'>Active</Badge>}
                                        </TableCell>
                                        <TableCell component="th" align='right'>
                                            <IconButton color='primary' onClick={(e) => handleEditCompany(company)}><MdEdit /></IconButton>
                                        </TableCell>

                                    </TableRow>
                                )) : (<TableRow><TableCell colSpan={6}>{!loading ?
                                    <div className='alert my-bg-secondary text-center '>
                                        <FaBan /> No <b>Companies</b> yet</div> : <div className='alert my-bg-secondary text-center text-muted'>
                                        Loading...</div>}
                                </TableCell></TableRow>)}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Col>
                {/*
                {companies.length > 0 ? companies.map((company, index) => (
                    <Col sm={6} md={4} className="p-3" key={index}>
                        <Card className='border h-100'>
                            <CardHeader className='border-bottom' avatar={<Avatar className='border-dark'><MdAddShoppingCart className='text-dark' /></Avatar>}
                                title={delivery_setting.name} subheader={formatDistanceToNow(new Date(delivery_setting.created_at), { addSuffix: true })}></CardHeader>
                            <CardContent className='p-0'>

                            </CardContent>
                            <CardActions className='border-top pb-3 pt-3'>
                                {!delivery_setting.status && <Badge bg='secondary' className='btn-pill ps-3 pe-3'>Inactive</Badge>}
                                {delivery_setting.status && <Badge bg='primary' className='btn-pill ps-3 pe-3'>Active</Badge>}
                            </CardActions>
                        </Card>
                    </Col>
                )) : (!loading && <Col xs={12} className='pt-5 pb-5'>
                    <div className='alert my-bg-secondary text-center text-muted'><Image src='/assets/no-data.svg' className='no-data-img' /> <br></br>No <b>delivery settings</b> yet</div>
                </Col>)}*/}

                {/*Add Company Dialog*/}
                <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
                    <DialogTitle>
                        <BsPlus></BsPlus> {id > 0 ? "Edit" : "Add"} Company
                    </DialogTitle>
                    <DialogContent>
                        <Form className='p-3' onSubmit={handleSaveCompany} ref={formRef}>
                            <div className='form-group mb-3'>
                                <TextField
                                    className='w-100'
                                    label="Name"
                                    size="small"
                                    error={errors.name}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    helperText={errors.name}
                                />
                            </div>
                            <div className='form-group mb-3'>
                                <TextField
                                    className='w-100'
                                    label="Description"
                                    multiline
                                    size="small"
                                    error={errors.description}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    helperText={errors.description}
                                />
                            </div>

                            <div className='form-group mb-3'>
                                <Autocomplete options={{
                                    componentRestrictions: { country: 'ke' }, strictBounds: true
                                }} onLoad={(autocomplete) => autocompleteRef.current = autocomplete} onPlaceChanged={onPlaceChanged}>
                                    <TextField fullWidth type='text' inputRef={inputRef} label="Physical Location"
                                    size='small'
                                        error={errors.location}
                                        helperText={errors.location}
                                    />
                                </Autocomplete>
                                {errors.location && <div className='invalid-feedback d-block'>{errors.location}</div>}
                            </div>
                            <div className='form-group mb-3'>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">
                                        Status
                                    </InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={status}
                                        label="Status"
                                        onChange={(e) => setStatus(e.target.value)}
                                        size="small"
                                    >
                                        <MenuItem value={1}>Active</MenuItem>
                                        <MenuItem value={0}>Inactive</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
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
                {/*End Company Dialog*/}

            </Row>
        </Container>
    )
}

export default CompaniesPage
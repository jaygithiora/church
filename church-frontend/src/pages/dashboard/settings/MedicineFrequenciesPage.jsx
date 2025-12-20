import { alpha, Avatar, Button, Card, CardActions, CardContent, CardHeader, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, TextField, useTheme } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { Badge, CloseButton, Col, Container, Form, Modal, Row } from 'react-bootstrap'
import { FaBan, FaPlus, FaUser, FaUserShield, FaUserTag } from 'react-icons/fa'
import { MdEdit, MdMoreVert, MdOutlineInventory } from 'react-icons/md'
import { BsCapsule, BsEye } from 'react-icons/bs'
import { formatDistanceToNow } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../services/AuthContext'
import { useSnackbar } from 'notistack'
import MedicineFrequenciesService from '../../../services/dashboard/settings/MedicineFrequenciesService'
import { RiMedicineBottleFill } from 'react-icons/ri'

function MedicineFrequenciesPage() {
    const theme = useTheme();
    const { loading, setLoading } = useAuth();
    const { enqueueSnackbar } = useSnackbar();

    const isDark = theme.palette.mode === "dark";
    const [medicineFrequencies, setMedicineFrequencies] = useState([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ id: "0", name: "", frequency:"", description: "", status: 1 });
    const formRef = useRef(null);
    const [errors, setErrors] = useState({
        id: '',
        name: '',
        description: '',
        frequency:"",
        status: ''
    });
    const [reload, setReload] = useState(false);
    const [pages, setPages] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const navigate = useNavigate();

    useEffect(() => {
        getMedicineFrequencies();
    }, [reload, pages]);

    const getMedicineFrequencies = async () => {
        setLoading(true);
        const medicineFrequenciesData = await MedicineFrequenciesService.getMedicineFrequencies(pages, enqueueSnackbar);
        if (medicineFrequenciesData) {
            setMedicineFrequencies(medicineFrequenciesData.data);
            setTotalPages(medicineFrequenciesData.last_page);
        }
        setLoading(false);
    }

    // Call this function when new data is added
    const refreshMedicineFrequencies = () => {
        setReload(prev => !prev); // Toggle state to trigger useEffect
    };

    const handleClickOpen = () => {
        setErrors({ name: '' });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const handleEditMedicineFrequency = (medicineFrequency) => {
        setFormData({ ...formData, id: medicineFrequency?.id, name: medicineFrequency?.name, frequency:medicineFrequency?.frequency, description: medicineFrequency?.description, status: medicineFrequency?.status });
        handleClickOpen();
    }

    const handleNewMedicineFrequency = () => {
        setFormData({ ...formData, id: "0", name: "", frequency:"",description: "", status: 1 });

        handleClickOpen();
    }

    const handleSaveMedicineFrequency = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setLoading(true);
            const saved = await MedicineFrequenciesService.addMedicineFrequency(formData, enqueueSnackbar);
            if (saved) {
                handleClose();
                refreshMedicineFrequencies();
            }
            setLoading(false);
        }
    }


    const validateForm = () => {
        let valid = true;
        const errorsCopy = { ...errors };
        if (formData.name.trim()) {
            errorsCopy.name = '';
        } else {
            errorsCopy.name = "Name is required!";
            valid = false;
            enqueueSnackbar(errorsCopy.name, { variant: "error" });
        }
        setErrors(errorsCopy);
        return valid;
    }

    
    return (
        <Container fluid>
            <Row>
                <Col className='p-4' xs={8}>
                    <h5 className='pb-3'><RiMedicineBottleFill/> Medicine Frequencies</h5>
                </Col>
                <Col className='p-4 text-end' xs={4}>
                    <Button color='primary' variant='contained' onClick={handleNewMedicineFrequency}><FaPlus /> Add</Button>
                </Col>
                <Col xs={12}>

                    <TableContainer
                        component={Paper}
                        sx={(theme) => ({
                            backgroundColor: alpha(theme.palette.background.paper, 0.5),
                        })}
                    >
                        <Table sx={{ minWidth: 650 }} aria-label="Delivery Settings Table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Action</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {medicineFrequencies.length > 0 ? (
                                    medicineFrequencies.map((medicineFrequency, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{medicineFrequency.name}</TableCell>
                                            <TableCell>{medicineFrequency.description}</TableCell>
                                            <TableCell>{formatDistanceToNow(new Date(medicineFrequency.created_at), { addSuffix: true })}</TableCell>
                                            <TableCell><Chip size='small' label={medicineFrequency.status?"Active":"Inactive"} color={medicineFrequency.status?"primary":"default"}/>
                                            </TableCell>
                                            <TableCell align='right'>
                                                <IconButton
                                                    onClick={(e) => handleEditMedicineFrequency(medicineFrequency)}>
                                                    <MdEdit />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : <TableRow>
                                    <TableCell colSpan={5}>
                                        <div className={`m-3 alert my-bg-secondary text-center ${isDark ? 'text-white' : 'text-muted'} `}>
                                            {!loading ?
                                                <>
                                                    <FaBan /> No <b>Medicine Frequency</b> yet</> : <>
                                                    Loading...</>}</div></TableCell></TableRow>
                                }
                            </TableBody>

                            {totalPages > 1 &&
                                <TableFooter><TableRow>
                                    <TableCell colSpan={5}>
                                        {/* Material-UI Pagination Component */}
                                        <Pagination count={totalPages} page={pages} onChange={(event, value) => setPages(value)} color='primary'></Pagination>
                                    </TableCell>
                                </TableRow>
                                </TableFooter>}
                        </Table>
                    </TableContainer>
                </Col>

                {/*start modal*/}
                <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
                    <DialogTitle>
                        <RiMedicineBottleFill /> {formData?.id > 0 ? "Edit" : "Add"} Medicine Frequency
                    </DialogTitle>

                    <DialogContent>
                        <Form ref={formRef} onSubmit={handleSaveMedicineFrequency}>
                            <Form.Group className='mb-3 mt-1'>
                                <TextField error={errors.name} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className='w-100' label='Name' size='small'
                                    helperText={errors.name ? errors.name : ""} />
                            </Form.Group>
                            <Form.Group className='mb-3 mt-1'>
                                <TextField type='number' error={errors.frequency} value={formData.frequency} onChange={(e) => setFormData({ ...formData, frequency: e.target.value })} className='w-100' label='Frequency' size='small'
                                    helperText={errors.frequency ? errors.frequency : ""} />
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <TextField className='w-100' multiline rows={4} label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    error={errors.description} helperText={errors.description ? errors.description : ''} size='small' />
                            </Form.Group>
                            <Form.Group>
                                <TextField
                                    select
                                    label="Status"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    slotProps={{
                                        select: {
                                            native: true,
                                        },
                                    }}
                                    size='small'
                                    className='w-100'
                                >
                                    <option value={1}>Active</option>
                                    <option value={0}>Inactive</option>
                                </TextField>
                            </Form.Group>
                        </Form>
                    </DialogContent>
                    <DialogActions>
                        <Button disableElevation variant='contained' color='dark' onClick={handleClose}>Close</Button>&nbsp;
                        <Button disableElevation disabled={loading} variant='contained' color='primary' onClick={() => formRef.current.requestSubmit()}>{loading && <div class="spinner-border spinner-border-sm text-light" medicineFrequency="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>}&nbsp;Save Changes</Button>
                    </DialogActions>
                </Dialog>
                {/*End modal*/}
            </Row>
        </Container>
    )
}

export default MedicineFrequenciesPage
import { alpha, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, TextField, useTheme } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { Col, Container, Form, Row } from 'react-bootstrap'
import { FaBan, FaPlus} from 'react-icons/fa'
import { MdEdit, MdMedicalInformation} from 'react-icons/md'
import { formatDistanceToNow } from 'date-fns'
import { useAuth } from '../../../services/AuthContext'
import { useSnackbar } from 'notistack'
import { RiMedicineBottleFill } from 'react-icons/ri'
import PractitionerTypeSettingsService from '../../../services/dashboard/settings/PractitionerTypeSettingsService'


function PractitionerTypesPage() {
    const theme = useTheme();
    const { loading, setLoading } = useAuth();
    const { enqueueSnackbar } = useSnackbar();

    const isDark = theme.palette.mode === "dark";
    const [practitionerTypes, setPractitionerTypes] = useState([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ id: "0", name: "", description: "", status: 1 });
    const formRef = useRef(null);
    const [errors, setErrors] = useState({
        id: '',
        name: '',
        description: '',
        status: ''
    });
    const [reload, setReload] = useState(false);
    const [pages, setPages] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        getPractitionerTypes();
    }, [reload, pages]);

    const getPractitionerTypes = async () => {
        setLoading(true);
        const practitionerTypesData = await PractitionerTypeSettingsService.getPractitionerTypes(pages, enqueueSnackbar);
        if (practitionerTypesData) {
            setPractitionerTypes(practitionerTypesData.data);
            setTotalPages(practitionerTypesData.last_page);
        }
        setLoading(false);
    }

    // Call this function when new data is added
    const refreshPractitionerTypes = () => {
        setReload(prev => !prev); // Toggle state to trigger useEffect
    };

    const handleClickOpen = () => {
        setErrors({ name: '' });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const handleEditPractitionerType = (practitionerType) => {
        setFormData({ ...formData, id: practitionerType?.id, name: practitionerType?.name, description: practitionerType?.description, status: practitionerType?.status });
        handleClickOpen();
    }

    const handleNewpractitionerType = () => {
        setFormData({ ...formData, id: "0", name: "", description: "", status: 1 });

        handleClickOpen();
    }

    const handleSavePractitionerType = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setLoading(true);
            const saved = await PractitionerTypeSettingsService.addPractitionerType(formData, enqueueSnackbar);
            if (saved) {
                handleClose();
                refreshPractitionerTypes();
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
                    <h5 className='pb-3'><MdMedicalInformation className='mb-2'/> Practitioner Types</h5>
                </Col>
                <Col className='p-4 text-end' xs={4}>
                    <Button color='primary' variant='contained' onClick={handleNewpractitionerType}><FaPlus /> Add</Button>
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
                                    <TableCell>Date</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Action</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {practitionerTypes.length > 0 ? (
                                    practitionerTypes.map((practitionerType, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{practitionerType.name}</TableCell>
                                            <TableCell>{formatDistanceToNow(new Date(practitionerType.created_at), { addSuffix: true })}</TableCell>
                                            <TableCell><Chip size='small' label={practitionerType.status?"Active":"Inactive"} color={practitionerType.status?"primary":"default"}/>
                                            </TableCell>
                                            <TableCell align='right'>
                                                <IconButton
                                                    onClick={(e) => handleEditPractitionerType(practitionerType)}>
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
                                                    <FaBan /> No <b>Practitioner Type</b> yet</> : <>
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
                        <MdMedicalInformation className='mb-2' /> {formData?.id > 0 ? "Edit" : "Add"} Practitioner Type
                    </DialogTitle>

                    <DialogContent>
                        <Form ref={formRef} onSubmit={handleSavePractitionerType}>
                            <Form.Group className='mb-3 mt-1'>
                                <TextField error={errors.name} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className='w-100' label='Name' size='small'
                                    helperText={errors.name ? errors.name : ""} />
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
                        <Button disableElevation variant='outlined' color='default' onClick={handleClose}>Close</Button>&nbsp;
                        <Button disableElevation disabled={loading} variant='contained' color='primary' onClick={() => formRef.current.requestSubmit()}>{loading && <div class="spinner-border spinner-border-sm text-light" practitionerType="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>}&nbsp;Save Changes</Button>
                    </DialogActions>
                </Dialog>
                {/*End modal*/}
            </Row>
        </Container>
    )
}

export default PractitionerTypesPage
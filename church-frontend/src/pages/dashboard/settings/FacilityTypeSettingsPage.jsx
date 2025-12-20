import { alpha, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, TextField, Typography, useTheme } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { Col, Container, Form, Row } from 'react-bootstrap'
import { FaBan, FaPlus} from 'react-icons/fa'
import { MdDelete, MdEdit, MdOutlinePermDataSetting} from 'react-icons/md'
import { formatDistanceToNow } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../services/AuthContext'
import { useSnackbar } from 'notistack'
import { RiMedicineBottleFill } from 'react-icons/ri'
import FacilityTypeSettingsService from '../../../services/dashboard/settings/FacilityTypeSettingsService'

function FacilityTypeSettingsPage() {
    const theme = useTheme();
    const { loading, setLoading } = useAuth();
    const { enqueueSnackbar } = useSnackbar();

    const isDark = theme.palette.mode === "dark";
    const [facilityTypes, setFacilityTypes] = useState([]);
    const [facilityTypeD, setFacilityTypeD] = useState(null);
    const [open, setOpen] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [formData, setFormData] = useState({ id: "0", name: "", description: ""});
    const formRef = useRef(null);
    const [errors, setErrors] = useState({
        id: '',
        name: '',
        description: ''
    });
    const [reload, setReload] = useState(false);
    const [pages, setPages] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const navigate = useNavigate();

    useEffect(() => {
        getFacilityTypes();
    }, [reload, pages]);

    const getFacilityTypes = async () => {
        setLoading(true);
        const facilityTypesData = await FacilityTypeSettingsService.getFacilityTypes(pages, enqueueSnackbar);
        if (facilityTypesData) {
            setFacilityTypes(facilityTypesData.data);
            setTotalPages(facilityTypesData.last_page);
        }
        setLoading(false);
    }

    // Call this function when new data is added
    const refreshFacilityTypes = () => {
        setReload(prev => !prev); // Toggle state to trigger useEffect
    };

    const handleClickOpen = () => {
        setErrors({ name: '' });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseConfirm = () => {
        setOpenConfirm(false);
    };


    const handleEditFacilityTypes = (facilityType) => {
        setFormData({ ...formData, id: facilityType?.id, name: facilityType?.name, description: facilityType?.description});
        handleClickOpen();
    }

    const handleNewFacilityType = () => {
        setFormData({ ...formData, id: "0", name: "", description: ""});
        handleClickOpen();
    }

    const handleSaveFacilityType = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setLoading(true);
            const saved = await FacilityTypeSettingsService.addFacilityType(formData, enqueueSnackbar);
            if (saved) {
                handleClose();
                refreshFacilityTypes();
            }
            setLoading(false);
        }
    }
    const deleteFacilityType = async(fT)=>{
        setFacilityTypeD(fT);
        setOpenConfirm(true);
        //handleDeleteFacilityType(fT);
    }
    const handleDeleteFacilityType = async () => {
        const formData = {id:facilityTypeD.id};
            setLoading(true);
            const saved = await FacilityTypeSettingsService.deleteFacilityType(formData, enqueueSnackbar);
            if (saved) {
                handleCloseConfirm();
                refreshFacilityTypes();
            }
            setLoading(false);
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
                    <h5 className='pb-3'><MdOutlinePermDataSetting/> Facility Types</h5>
                </Col>
                <Col className='p-4 text-end' xs={4}>
                    <Button color='primary' variant='contained' onClick={handleNewFacilityType}><FaPlus /> Add</Button>
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
                                    <TableCell align="right">Action</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {facilityTypes.length > 0 ? (
                                    facilityTypes.map((facilityType, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{facilityType.name}</TableCell>
                                            <TableCell>{formatDistanceToNow(new Date(facilityType.created_at), { addSuffix: true })}</TableCell>
                                            <TableCell align='right'>
                                                <IconButton
                                                    onClick={(e) => handleEditFacilityTypes(facilityType)}>
                                                    <MdEdit />
                                                </IconButton>
                                                <IconButton
                                                    onClick={(e) =>deleteFacilityType(facilityType)} 
                                                    color='error'>
                                                    <MdDelete />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : <TableRow>
                                    <TableCell colSpan={5}>
                                        <div className={`m-3 alert my-bg-secondary text-center ${isDark ? 'text-white' : 'text-muted'} `}>
                                            {!loading ?
                                                <>
                                                    <FaBan /> No <b>Medicine Route</b> yet</> : <>
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
                        <Form ref={formRef} onSubmit={handleSaveFacilityType}>
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
                        <Button disableElevation variant='contained' color='dark' onClick={handleClose}>Close</Button>&nbsp;
                        <Button disableElevation disabled={loading} variant='contained' color='primary' onClick={() => formRef.current.requestSubmit()}>{loading && <div class="spinner-border spinner-border-sm text-light" facilityType="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>}&nbsp;Save Changes</Button>
                    </DialogActions>
                </Dialog>
                {/*End modal*/}

                {/* Confirm Dialog */}
      <Dialog open={openConfirm} onClose={handleCloseConfirm}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{facilityTypeD?.name}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm}>Cancel</Button>
          <Button onClick={handleDeleteFacilityType} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {/* Confirm Delete Dialog */}
            </Row>
        </Container>
    )
}

export default FacilityTypeSettingsPage
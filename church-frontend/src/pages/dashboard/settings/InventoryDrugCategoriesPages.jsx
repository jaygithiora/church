import { alpha, Avatar, Button, Card, CardActions, CardContent, CardHeader, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, TextField, useTheme } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { Badge, CloseButton, Col, Container, Form, Modal, Row } from 'react-bootstrap'
import { FaBan, FaPlus, FaUser, FaUserShield, FaUserTag } from 'react-icons/fa'
import { MdEdit, MdMoreVert, MdOutlineInventory } from 'react-icons/md'
import { BsEye } from 'react-icons/bs'
import { formatDistanceToNow } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../services/AuthContext'
import { useSnackbar } from 'notistack'
import InventoryDrugCategoriesService from '../../../services/dashboard/settings/InventoryDrugCategoriesService'
import { LuClipboardList } from 'react-icons/lu'

function InventoryDrugCategoriesPage() {
    const theme = useTheme();
    const { loading, setLoading } = useAuth();
    const { enqueueSnackbar } = useSnackbar();

    const isDark = theme.palette.mode === "dark";
    const [inventoryDrugCategories, setInventoryDrugCategories] = useState([]);
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

    const navigate = useNavigate();

    useEffect(() => {
        getInventoryDrugCategories();
    }, [reload, pages]);

    const getInventoryDrugCategories = async () => {
        setLoading(true);
        const inventoryDrugCategoriesData = await InventoryDrugCategoriesService.getInventoryDrugCategories(pages, enqueueSnackbar);
        if (inventoryDrugCategoriesData) {
            setInventoryDrugCategories(inventoryDrugCategoriesData.data);
            setTotalPages(inventoryDrugCategoriesData.last_page);
        }
        setLoading(false);
    }

    // Call this function when new data is added
    const refreshInventoryDrugCategories = () => {
        setReload(prev => !prev); // Toggle state to trigger useEffect
    };

    const handleClickOpen = () => {
        setErrors({ name: '' });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const handleEditInventoryDrugCategory = (inventoryDrugCategory) => {
        setFormData({ ...formData, id: inventoryDrugCategory?.id, name: inventoryDrugCategory?.name, description: inventoryDrugCategory?.description, status: inventoryDrugCategory?.status });
        handleClickOpen();
    }

    const handleNewInventoryDrugCategory = () => {
        setFormData({ ...formData, id: "0", name: "", description: "", status: 1 });

        handleClickOpen();
    }

    const handleSaveInventoryDrugCategory = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setLoading(true);
            const saved = await InventoryDrugCategoriesService.addInventoryDrugCategory(formData, enqueueSnackbar);
            if (saved) {
                handleClose();
                refreshInventoryDrugCategories();
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

    {/* inventoryDrugCategories menu*/ }
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openMenu = Boolean(anchorEl);
    const handleMenuClick = (event, inventoryDrugCategory) => {
        setAnchorEl(event.currentTarget);
        alert("Clicked");
        //setDescription(inventoryDrugCategory);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEditMenu = () => {
        handleMenuClose();
        handleEditInventoryDrugCategory(description);
        handleShowModal();
    }

    const handleViewMenu = () => {
        navigate(`/dashboard/users/user/tags/view/${description.id}`);
    }
    return (
        <Container fluid>
            <Row>
                <Col className='p-4' xs={8}>
                    <h5 className='pb-3'><LuClipboardList /> Inventory Drug Categories</h5>
                </Col>
                <Col className='p-4 text-end' xs={4}>
                    <Button color='primary' variant='contained' onClick={handleNewInventoryDrugCategory}><FaPlus /> Add</Button>
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
                                    <TableCell>Category</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Action</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {inventoryDrugCategories.length > 0 ? (
                                    inventoryDrugCategories.map((inventoryDrugCategory, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{inventoryDrugCategory.name}</TableCell>
                                            <TableCell>{formatDistanceToNow(new Date(inventoryDrugCategory.created_at), { addSuffix: true })}</TableCell>
                                            <TableCell>{inventoryDrugCategory.status && <Badge bg="primary">Active</Badge>} {inventoryDrugCategory.can_register == 0 && <Badge bg="secondary">Inactive</Badge>}
                                            </TableCell>
                                            <TableCell align='right'>
                                                <IconButton
                                                    onClick={(e) => handleEditInventoryDrugCategory(inventoryDrugCategory)}>
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
                                                    <FaBan /> No <b>Inventory Drug Categories</b> yet</> : <>
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
                        <MdOutlineInventory /> {formData?.id > 0 ? "Edit" : "Add"} Inventory Drug Category
                    </DialogTitle>

                    <DialogContent>
                        <Form ref={formRef} onSubmit={handleSaveInventoryDrugCategory}>
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
                        <Button disableElevation disabled={loading} variant='contained' color='primary' onClick={() => formRef.current.requestSubmit()}>{loading && <div class="spinner-border spinner-border-sm text-light" inventoryDrugCategory="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>}&nbsp;Save Changes</Button>
                    </DialogActions>
                </Dialog>
                {/*End modal*/}
            </Row>
        </Container>
    )
}

export default InventoryDrugCategoriesPage
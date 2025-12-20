import {
    Alert,
    alpha,
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormGroup,
    IconButton,
    InputLabel,
    MenuItem,
    Pagination,
    Paper,
    Select,
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
import { MdEdit, MdOutlineStore } from "react-icons/md";
import { useAuth } from "../../../services/AuthContext";
import { FaBan, FaEdit, FaPlus } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import CompanySelectComponent from "../../../components/dashboard/settings/CompanySelectComponent";
import BranchSelectComponent from "../../../components/dashboard/settings/BranchSelectComponent";
import { useSnackbar } from "notistack";
import StoresService from "../../../services/dashboard/settings/StoresService";
import { IoIosArrowRoundForward } from "react-icons/io";
import { LiaEdit } from "react-icons/lia";
import { Link } from "react-router-dom";

function StorePage() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const { loading, setLoading } = useAuth();
    const [reload, setReload] = useState(false);
    const formRef = useRef(null);
    const { enqueueSnackbar } = useSnackbar();
    const [formData, setFormData] = useState({
        id: 0, name: "", description: "", company: "", branch: "", status: 1
    });
    const [company, setCompany] = useState(null);
    const [branch, setBranch] = useState(null);
    const [status, setStatus] = useState("");
    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState({
        name: "",
        description: "",
        company: "", branch: "",
        status: "",
    });

    const [stores, setStores] = useState([]);
    const [pages, setPages] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        setFormData({ ...formData, company: company?.value, branch: branch?.value });
    }, [company, branch]);
    useEffect(() => {
        getStores();
    }, [reload, pages]);


    const getStores = async () => {
        setLoading(true);
        const storesData =
            await StoresService.getStores(pages);
        if (storesData) {
            //console.log(storesData);
            setStores(storesData.data);
            setTotalPages(storesData.last_page);
        }
        setLoading(false);
    };
    // Call this function when new data is added
    const refreshStores = () => {
        setReload((prev) => !prev); // Toggle state to trigger useEffect
    };
    const handleEditStore = (store) => {
        setFormData({ ...formData, id: store?.id, name: store?.name, description: store?.description, company: store?.company_id, branch: store?.branch_id, status: store?.status })
        if (store.company != null)
            setCompany({ value: store.company?.id, label: store.company?.name });
        if (store.branch != null)
            setBranch({ value: store.branch?.id, label: store.branch?.name });
        handleClickOpen();
    };
    const handleNewStore = () => {
        setFormData({ ...formData, id: 0, name: "", description: "", company: "", branch: "", status: 1 });
        setCompany(null);
        setBranch(null);
        handleClickOpen();
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSaveStore = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setLoading(true);
            const data = await StoresService.addStore(
                formData, enqueueSnackbar
            );
            if (data) {
                handleClose();
                refreshStores();
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
            enqueueSnackbar(errorsCopy.name, { variant: "error" });
            valid = false;
        } if (formData.company) {
            errorsCopy.company = "";
        } else {
            errorsCopy.company = "Company is required";
            enqueueSnackbar(errorsCopy.company, { variant: "error" });
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
                        <MdOutlineStore /> Stores
                    </h5>
                </Col>

                <Col sm={3} className="text-end p-3">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNewStore}
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
                        <Table sx={{ minWidth: 650 }} aria-label="Delivery Settings Table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Company</TableCell>
                                    <TableCell>Branch</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Action</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {stores.length > 0 ? (
                                    stores.map((store, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                        >
                                            <TableCell component="th">{index + 1}</TableCell>
                                            <TableCell component="th">{store.name}</TableCell>
                                            <TableCell component="th">
                                                {store.company?.name}
                                            </TableCell>
                                            <TableCell component="th">
                                                {store.branch?.name}
                                            </TableCell>
                                            <TableCell component="th">
                                                {formatDistanceToNow(new Date(store.created_at), { addSuffix: true })}
                                            </TableCell>
                                            <TableCell component="th">
                                                {!store.status ? (
                                                    <Chip
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: isDark ? "#6c757d" : "#dee2e6",
                                                            color: isDark ? "#fff" : "#000",
                                                        }}
                                                        label="Inactive"
                                                    ></Chip>
                                                ) : (
                                                    <Chip
                                                        color="primary"
                                                        label="Active"
                                                        size="small"
                                                    ></Chip>
                                                )}
                                            </TableCell>
                                            <TableCell component="th" align="right">
                                                <IconButton
                                                    color="primary"
                                                    onClick={() =>
                                                        handleEditStore(store)
                                                    }
                                                >
                                                    <LiaEdit />
                                                </IconButton>
                                                <IconButton
                                                    color="primary"
                                                    LinkComponent={Link}
                                                    to={"/dashboard/settings/stores/view/" + store.id}
                                                >
                                                    <IoIosArrowRoundForward />
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
                                                        No <b>Stores</b> yet
                                                    </Alert>
                                                </Box>
                                            ) : (
                                                <div className="text-center">
                                                    Loading <b>Stores</b>...
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
                {stores.length > 0 ? stores.map((store, index) => (
                    <Col sm={6} md={4} className="p-3" key={index}>
                        <Card className='border h-100'>
                            <CardHeader className='border-bottom' avatar={<Avatar className='border-dark'><MdAddShoppingCart className='text-dark' /></Avatar>}
                                title={store.name} subheader={formatDistanceToNow(new Date(store.created_at), { addSuffix: true })}></CardHeader>
                            <CardContent className='p-0'>

                            </CardContent>
                            <CardActions className='border-top pb-3 pt-3'>
                                {!store.status && <Badge bg='secondary' className='btn-pill ps-3 pe-3'>Inactive</Badge>}
                                {store.status && <Badge bg='primary' className='btn-pill ps-3 pe-3'>Active</Badge>}
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
                        <FaEdit /> {formData.id > 0 ? "Edit" : "Add"} Store
                    </DialogTitle>
                    <DialogContent>
                        <Form ref={formRef} onSubmit={handleSaveStore}>
                            <Row className="mt-3">
                                <FormGroup className="col-sm-12 mb-3">
                                    <TextField
                                        label="Name"
                                        size="small"
                                        error={errors.name}
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name:e.target.value})}
                                        helperText={errors.name}
                                    />
                                    {/*errors.firstname && <div className='invalid-feedback d-block'>{errors.firstname}</div>*/}
                                </FormGroup>
                                <FormGroup className="col-sm-12 mb-3">
                                    <TextField
                                        size="small"
                                        label="Description"
                                        error={errors.description}
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description:e.target.value})}
                                        multiline
                                        helperText={errors.description}
                                    />
                                    {/*errors.lastname && <div className='invalid-feedback d-block'>{errors.lastname}</div>*/}
                                </FormGroup>
                                <FormGroup className="col-sm-12 mb-3">
                                    <CompanySelectComponent selectedOption={company} onSelectChange={setCompany} />
                                </FormGroup>
                                <FormGroup className="col-sm-12 mb-3">
                                    <BranchSelectComponent company={company?.value} selectedOption={branch} onSelectChange={setBranch} isMultiple={false}/>
                                </FormGroup>
                                <Form.Group className="col-sm-12 mb-3">
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">
                                            Status
                                        </InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={formData.status}
                                            label="Status"
                                            onChange={(e) => setFormData({...formData, status:e.target.value})}
                                            size="small"
                                        >
                                            <MenuItem value={1}>Active</MenuItem>
                                            <MenuItem value={0}>Inactive</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Form.Group>
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
                                    <span className="visually-hidden">Loading.s..</span>
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

export default StorePage;

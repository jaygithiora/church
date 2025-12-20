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
import { MdEdit, MdInventory } from "react-icons/md";
import { useAuth } from "../../../services/AuthContext";
import { FaBan, FaBoxOpen, FaPlus } from "react-icons/fa";
import { FaBuildingShield } from "react-icons/fa6";
import { formatDistanceToNow } from "date-fns";
import { useSnackbar } from "notistack";
import StockTakeService from "../../../services/dashboard/stock-management/StockTakeService";
import InventoryItemSelectComponent from "../../../components/dashboard/inventory/InventoryItemSelectComponent";
import StoreSelectComponent from "../../../components/dashboard/settings/StoreSelectComponent";

function StockTakePage() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const {enqueueSnackbar} = useSnackbar();
    const { loading, setLoading } = useAuth();
    const [reload, setReload] = useState(false);
    const formRef = useRef(null);
    const [stock, setstock] = useState(null);
    const [store, setStore] = useState(null);
    const [inventoryItem, setInventoryItem] = useState(null);
    const [inventoryStrengthUnit, setInventoryStrengthUnit] = useState(null);
    const [doseMeasure, setDoseMeasure] = useState(null);

    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        id: 0, store: "", inventory_item: "", purchase_price: "", selling_price: "", expiry_date: "", 
        quantity: "", strength: "", batch: "",
    })
    const [errors, setErrors] = useState({
        store: "",
        inventory_item: "",
        purchase_price: "",
        selling_price: "",
        expiry_date: "",
        quantity:"", 
        strength:"",
        batch:"",
    });

    const [stocks, setStocks] = useState([]);
    const [pages, setPages] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(()=>{
        setFormData({...formData, store:store?.value, 
            inventory_item:inventoryItem?.value});
    }, [inventoryItem, store]);
    useEffect(() => {
        getStocks();
    }, [reload, pages]);

    const getStocks = async () => {
        setLoading(true);
        const stocksData =
            await StockTakeService.getStocks(pages, enqueueSnackbar);
        if (stocksData) {
            //console.log(stocksData);
            setStocks(stocksData.data);
            setTotalPages(stocksData.last_page);
        }
        setLoading(false);
    };
    // Call this function when new data is added
    const refreshStocks = () => {
        setReload((prev) => !prev); // Toggle state to trigger useEffect
    };
    const handleEditStock = (stock) => {
        setFormData({...formData, id:stock?.id, inventory_item:stock?.inventory_item_id, store:stock?.store_id, 
            purchase_price:stock?.purchase_price, selling_price:stock?.selling_price,
            expiry_date:stock?.expiry_date, quantity:stock?.quantity,
            strength:stock?.strength, batch:stock?.batch, status:stock?.status
        });
        setInventoryItem({value:stock?.inventory_item_id, label:stock?.inventory_item?.name});
        setStore({value:stock?.store_id, label:stock?.store?.name});
        handleClickOpen();
    };
    const handleNewStock = () => {
        setFormData({...formData, id:0, store:"", inventory_item:"", purchase_price:"", selling_price:"", quantity:"",
             strength:"", batch:"", expiry_date:"", status:1});
        setInventoryItem(null);
        setStore(null);
        handleClickOpen();
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSaveStock = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setLoading(true);
            const data = await StockTakeService.addStock(
                formData, enqueueSnackbar
            );
            if (data) {
                handleClose();
                refreshStocks();
            }
            setLoading(false);
        }
    };

    const validateForm = () => {
        let valid = true;
        const errorsCopy = { ...errors };

        if (formData.inventory_item) {
            errorsCopy.inventory_item = "";
        } else {
            errorsCopy.inventory_item = "inventory Item is required";
            enqueueSnackbar(errorsCopy.inventory_item, { variant: "error" });
            valid = false;
        }
        if (formData.store) {
            errorsCopy.store = "";
        } else {
            errorsCopy.store = "Store is required";
            enqueueSnackbar(errorsCopy.store, { variant: "error" });
            valid = false;
        }
        if (!isNaN(formData.quantity) && formData.quantity != "") {
            errorsCopy.quantity = "";
        } else {
            errorsCopy.quantity = "Quantity is invalid";
            enqueueSnackbar(errorsCopy.quantity, { variant: "error" });
            valid = false;
        }
        if (!isNaN(formData.purchase_price) && formData.purchase_price != "") {
            errorsCopy.purchase_price = "";
        } else {
            errorsCopy.purchase_price = "Purchase Price is invalid";
            enqueueSnackbar(errorsCopy.purchase_price, { variant: "error" });
            valid = false;
        }
        if (!isNaN(formData.selling_price) && formData.selling_price != "") {
            errorsCopy.selling_price = "";
        } else {
            errorsCopy.selling_price = "Selling Price is invalid";
            enqueueSnackbar(errorsCopy.selling_price, { variant: "error" });
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
                        <FaBoxOpen /> Stock Take
                    </h5>
                </Col>

                <Col sm={3} className="text-end p-3">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNewStock}
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
                        <Table sx={{ minWidth: 650 }} aria-label="stocks Table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Code</TableCell>
                                    <TableCell>Item</TableCell>
                                    <TableCell>Store</TableCell>
                                    <TableCell>Cost</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Quantity</TableCell>
                                    <TableCell>Dispensed</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell align="right">Action</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {stocks.length > 0 ? (
                                    stocks.map((stock, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                        >
                                            <TableCell component="th">{stock.code}</TableCell>
                                            <TableCell component="th">{stock.inventory_item.item_code} - {stock.inventory_item.name} ({stock.inventory_item.generic_name})</TableCell>
                                            <TableCell component="th">{stock.store.name}</TableCell>
                                            <TableCell component="th">
                                                {stock.purchase_price}
                                            </TableCell>
                                            <TableCell component="th">
                                                {stock?.selling_price}
                                            </TableCell>
                                            <TableCell component="th">
                                                {stock?.quantity}
                                            </TableCell>
                                            <TableCell component="th">
                                                {stock.dispensed}
                                            </TableCell>
                                            <TableCell component="th">
                                                {formatDistanceToNow(new Date(stock.created_at), { addSuffix: true })}
                                            </TableCell>
                                            {/*<TableCell component="th">
                                                {!stock.status ? (
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
                                            </TableCell>*/}
                                            <TableCell component="th" align="right">
                                                <IconButton
                                                    color="primary"
                                                    onClick={() =>
                                                        handleEditStock(stock)
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
                                                        No <b>stocks</b> yet
                                                    </Alert>
                                                </Box>
                                            ) : (
                                                <div className="text-center">
                                                    Loading <b>stocks</b>...
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Col>

                {/* Material-UI Pagination Component */}
                {totalPages > 1 && (
                    <Paper>
                    <Pagination
                        count={totalPages}
                        page={pages}
                        onChange={(event, value) => setPages(value)}
                        color="primary"
                        className="d-flex justify-content-center mt-3"
                    ></Pagination>
                    </Paper>
                )}
                {/*Add Loan Document Modal*/}
                <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
                    <DialogTitle>
                        <FaBuildingShield /> {formData.id > 0 ? "Edit" : "Add"} Stock Take
                    </DialogTitle>
                    <DialogContent>
                        <Form ref={formRef} onSubmit={handleSaveStock}>
                            <Row className="mt-3">
                                <FormGroup className="col-sm-12 mb-3">
                                    <InventoryItemSelectComponent selectedOption={inventoryItem} onSelectChange={setInventoryItem} isMultiple={false}/>
                                    {errors.inventory_item && <div className='invalid-feedback d-block'>{errors.inventory_item}</div>}
                                </FormGroup>
                                <FormGroup className="col-sm-12 mb-3">
                                    <StoreSelectComponent selectedOption={store} onSelectChange={setStore} isMultiple={false}/>
                                    {errors.store && <div className='invalid-feedback d-block'>{errors.store}</div>}
                                </FormGroup>
                                <FormGroup className="col-sm-12 mb-3">
                                    <TextField type='number'
                                        label="Quantity"
                                        size="small"
                                        error={errors.quantity}
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({...formData, quantity:e.target.value})}
                                        helperText={errors.quantity}
                                    />
                                </FormGroup>
                                <FormGroup className="col-sm-12 mb-3">
                                    <TextField type='number'
                                        label="Purchase Price"
                                        size="small"
                                        error={errors.purchase_price}
                                        value={formData.purchase_price}
                                        onChange={(e) => setFormData({...formData, purchase_price:e.target.value})}
                                        helperText={errors.purchase_price}
                                    />
                                </FormGroup>
                                <FormGroup className="col-sm-12 mb-3">
                                    <TextField type='number'
                                        label="Selling Price"
                                        size="small"
                                        error={errors.selling_price}
                                        value={formData.selling_price}
                                        onChange={(e) => setFormData({...formData, selling_price:e.target.value})}
                                        helperText={errors.selling_price}
                                    />
                                </FormGroup>
                                <FormGroup className="col-sm-12 mb-3">
                                    <TextField type='date'
                                        label="Expiry Date"
                                        size="small"
                                        error={errors.expiry_date}
                                        value={formData.expiry_date}
                                        onChange={(e) => setFormData({...formData, expiry_date:e.target.value})}
                                        helperText={errors.expiry_date}
                                    />
                                </FormGroup>
                                <FormGroup className="col-sm-12 mb-3">
                                    <TextField 
                                        label="Batch"
                                        size="small"
                                        error={errors.batch}
                                        value={formData.batch}
                                        onChange={(e) => setFormData({...formData, batch:e.target.value})}
                                        helperText={errors.batch}
                                    />
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

export default StockTakePage;

import { Alert, Avatar, Button, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemText, Paper, styled } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { Col, Container, Form, InputGroup, Row } from 'react-bootstrap'
import { MdDelete, MdInfo, MdShoppingCart, MdShoppingCartCheckout } from 'react-icons/md'
import "react-image-crop/dist/ReactCrop.css";
import { useAuth } from '../../../services/AuthContext'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FaBan, FaMinus, FaPlus } from 'react-icons/fa';
import CartService from '../../../services/dashboard/CartService';
import PhoneInput from 'react-phone-input-2';
import OrdersService from '../../../services/dashboard/orders/OrdersService';
import { toast } from 'react-toastify';

function CheckoutStatusPage() {
    const { loading, setLoading, user } = useAuth();
    const [order, setOrder] = useState(null);
    const { id } = useParams();
    const [phone, setPhone] = useState(user?.phone);
    const [errors, setErrors] = useState({ phone: '' });
    const navigator = useNavigate();

    useEffect(() => {
        getPurchases();
    }, [id]);

    const getPurchases = async () => {
        setLoading(true);
        const orderData = await OrdersService.getOrder(id);
        if (orderData) {
            setOrder(orderData);
        }
        setLoading(false);
    }
    const checkout = async()=>{
        if(phone){
            setLoading(true);
            await OrdersService.checkoutOrder(id, phone);
            setLoading(false);
        }
    }
    const formatNumber = (num) => {
        // Convert to string with two decimals
        const fixed = num.toFixed(0);
        // Add thousand separators (commas)
        return fixed.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    return (
        <Container fluid>
            <Row className='mb-5'>
                <Col xs={12} className='p-3'>
                    <h4><MdShoppingCartCheckout /> Order Status ({id})</h4>
                    {!order?.paid?
                    <Alert severity='info' className='mb-3 mb-3'><b>Order {id} Pending.</b> Payments for these order pending. If you've initiated the payments we're update here soon once recieved</Alert>:
                    <Alert severity='success' className='mb-3 mb-3'><b>Congratulations!</b> Order {id} fully paid for, keep shopping with us</Alert>
}

                </Col>
                <Col sm={6} md={7} xl={8}>
                    <div className='card border-secondary mb-3 h-100'>
                        <div className='card-body'>
                            {order != null ? order.purchases.map((purchase, index) => (
                                <List key={index}>
                                        <ListItem component={Paper} secondaryAction={<b className='text-muted'>{"KES " + formatNumber(purchase.price)}</b>}>
                                            <ListItemAvatar>
                                                <Avatar src={purchase?.product?.image != null ? purchase?.product?.image : "/assets/no-data.svg"} className='border-0' />
                                            </ListItemAvatar>
                                            <ListItemText primary={<span>{purchase?.product?.item_name} ({purchase?.product?.item_code}) - {purchase?.product?.product_category.name}</span>}
                                                secondary={<b className='text-success'>{purchase.quantity + " x KES " + purchase?.product?.selling + " = KES " + purchase.price}</b>}>
                                            </ListItemText>
                                        </ListItem>
                                    </List>
                            )) : (!loading &&
                                <div className='alert my-bg-secondary text-center text-muted'><FaBan /> Order is empty</div>
                            )}
                        </div>
                        <div className='card-footer border-top border-secondary p-3'>
                            <Button component={Link} to="/dashboard/shop" variant='outlined' color='success' className='btn-pill'>Back to Shopping</Button>
                        </div>
                    </div>
                </Col>
                <Col sm={6} md={5} xl={4}>
                    <div className='card border-secondary'>
                        <div className='card-body'>
                            <h6>Cart Totals</h6>
                            <table className='table'>
                                <tbody>
                                    <tr>
                                        <td className='border-0'>Shipping & Handling:</td>
                                        <td className='border-0 text-end'><small>KES</small> 0</td>
                                    </tr>
                                    <tr>
                                        <td className='border-0 border-secondary border-bottom'>Subtotal:</td>
                                        <td className='border-0 border-secondary border-bottom text-end'><small>KES</small> {order!=null?formatNumber(order.totals):'Loading...'}</td>
                                    </tr>
                                    <tr>
                                        <td className='border-0 border-secondary'><h6>Grand Total:</h6></td>
                                        <td className='border-0 border-secondary text-end'><h6><small>KES</small> {order!=null?formatNumber(order.totals):'Loading...'}</h6></td>
                                    </tr>
                                    <tr>
                                        <td className='border-0 pt-4' colSpan={2}>
                                            {!order?.paid&&<><Alert icon={false}><b>Payments</b> are processed via <b>M-PESA</b>. Please enter your <b>phone number</b> for checkout</Alert>
                                            <Form.Group className="mt-3">
                                                <PhoneInput className='border-success' country={'ke'} onlyCountries={['ke']} value={phone} onChange={(phone) => setPhone(phone)}
                                                    inputProps={{ name: 'phone', required: true, autoFocus: false }} inputClass={`${errors.phone ? 'is-invalid' : 'border-secondary'}`} />
                                                {errors.phone && <div className='invalid-feedback d-block'>{errors.phone}</div>}
                                            </Form.Group></>}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        {!order?.paid&&
                        <div className='card-footer border-top border-secondary p-3'>
                            <Button variant='contained' color='success' className='w-100 btn-pill' disabled={order==null || order?.paid} onClick={checkout}><MdShoppingCartCheckout /> Checkout</Button>
                        </div>}
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default CheckoutStatusPage
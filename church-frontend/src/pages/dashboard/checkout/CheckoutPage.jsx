import { Alert, Avatar, Button, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemText, styled } from '@mui/material'
import React, { useMemo, useState } from 'react'
import { Col, Container, Form, InputGroup, Row } from 'react-bootstrap'
import { MdDelete, MdInfo, MdShoppingCart, MdShoppingCartCheckout } from 'react-icons/md'
import "react-image-crop/dist/ReactCrop.css";
import { useAuth } from '../../../services/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { FaBan, FaMinus, FaPlus } from 'react-icons/fa';
import CartService from '../../../services/dashboard/CartService';
import PhoneInput from 'react-phone-input-2';
import OrdersService from '../../../services/dashboard/orders/OrdersService';
import { toast } from 'react-toastify';

function CheckoutPage() {
    const { loading, setLoading, cart, updateCart, user } = useAuth();
    const [products, setProducts] = useState(cart);
    const [id, setId] = useState(0);
    const [phone, setPhone] = useState(user?.phone);
    const [errors, setErrors] = useState({phone:''});
    const navigator = useNavigate();

    const totals = useMemo(() => {
        return products.reduce((sum, item) => sum + (item.selling * (item.product_discount != null ? 1 - item.product_discount.discount / 100 : 1) * item.quantity), 0);
    }, [products]);

    const handleIncrease = (product) => {
        CartService.addToCart(product)
        setProducts(prevProducts =>
            prevProducts.map(product =>
                product.id === product.id
                    ? { ...product, quantity: product.quantity + 1 }
                    : product
            )
        );
    };

    const handleDecrease = (product) => {
        if (product.quantity > 1) {
            CartService.addToCart(product);
            setProducts(prevProducts =>
                prevProducts.map(product =>
                    product.id === product.id && product.quantity > 1
                        ? { ...product, quantity: product.quantity - 1 }
                        : product
                )
            );
        }
    };

    const deleteItem = async (productId) => {
        CartService.removeFromCart(productId);
        setProducts(products => products.filter(product => product.id !== productId));
        updateCart();
        if(cart.length <= 0){
            navigator("/dashboard/shop");
        }
    }

    const checkout=async ()=>{
        if(cart.length > 0){
            if(phone){
                setLoading(true);
                const orderId = await OrdersService.addOrder(id, cart, totals, phone);
                if(orderId){
                    CartService.clearCart();
                    updateCart();
                    navigator(`/dashboard/checkout/${orderId}/status`);
                }
                setLoading(false);
            }
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
                    <h4><MdShoppingCartCheckout /> Checkout</h4>
                </Col>
                <Col sm={6} md={7} xl={8}>

                    <div className='card border-secondary mb-3'>
                        <div className='card-body'>
                            {products.length > 0 ? products.map((product, index) => (
                                <>
                                    <List key={index}>
                                        <ListItem secondaryAction={
                                            <IconButton edge="end" aria-label="delete" onClick={(e) => { deleteItem(product.id) }}>
                                                <MdDelete className='text-danger' />
                                            </IconButton>
                                        }>
                                            <ListItemAvatar>
                                                <Avatar src={product?.image != null ? product?.image : "/assets/no-data.svg"} className='border-0' />
                                            </ListItemAvatar>
                                            <ListItemText primary={<span>{product?.item_name} ({product?.item_code}) - {product?.product_category.name}</span>}
                                                secondary={<Row className='d-flex align-items-center mt-2'><Col><InputGroup className='border-2 border' style={{ maxWidth: "200px" }}>
                                                    <InputGroup.Text className='border-0 p-1'>
                                                        <Button variant='contained' color='success' className='h-100 shadow-none' onClick={(e) => { handleDecrease(product) }}><FaMinus /></Button>
                                                    </InputGroup.Text>
                                                    <Form.Control className='text-center border-0' placeholder='quantity' value={product.quantity} readOnly></Form.Control>
                                                    <InputGroup.Text className='border-0 p-1'>
                                                        <Button variant='contained' color='success' className='h-100 shadow-none' onClick={(e) => { handleIncrease(product) }}><FaPlus /></Button>
                                                    </InputGroup.Text>
                                                </InputGroup></Col><Col><b>Subtotals:</b> <small>KES</small> {formatNumber(product.selling * (product.product_discount != null ? 1 - product.product_discount.discount / 100 : 1) * product.quantity)}</Col></Row>}>
                                            </ListItemText>
                                        </ListItem>
                                    </List>
                                    <Divider variant='inset' component="div" />
                                </>
                            )) : (!loading &&
                                <div className='alert my-bg-secondary text-center text-muted'><FaBan /> Cart is empty</div>
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
                                        <td className='border-0 border-secondary border-bottom text-end'><small>KES</small> {formatNumber(totals)}</td>
                                    </tr>
                                    <tr>
                                        <td className='border-0 border-secondary'><h6>Grand Total:</h6></td>
                                        <td className='border-0 border-secondary text-end'><h6><small>KES</small> {formatNumber(totals)}</h6></td>
                                    </tr>
                                    <tr>
                                        <td className='border-0 pt-4' colSpan={2}>
                                            <Alert icon={false}><b>Payments</b> are processed via <b>M-PESA</b>. Please enter your <b>phone number</b> for checkout</Alert>
                                            <Form.Group className="mt-3">
                                                <PhoneInput className='border-success' country={'ke'} onlyCountries={['ke']} value={phone} onChange={(phone) => setPhone(phone)}
                                                    inputProps={{ name: 'phone', required: true, autoFocus: false }} inputClass={`${errors.phone ? 'is-invalid' : 'border-secondary'}`} />
                                                {errors.phone && <div className='invalid-feedback d-block'>{errors.phone}</div>}
                                            </Form.Group>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className='card-footer border-top border-secondary p-3'>
                            <Button variant='contained' color='success' className='w-100 btn-pill' disabled={cart.length<=0} onClick={checkout}><MdShoppingCartCheckout /> Checkout</Button>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default CheckoutPage
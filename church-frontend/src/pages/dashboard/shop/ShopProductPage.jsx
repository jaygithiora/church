import { Box, Button, Card, CardContent, Divider, styled } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Col, Container, Form, Image, InputGroup, Row } from 'react-bootstrap'
import { FaMinus, FaPlus } from 'react-icons/fa'
import { MdShoppingBag } from 'react-icons/md'
import "react-image-crop/dist/ReactCrop.css";
import { useAuth } from '../../../services/AuthContext'
import ProductsService from '../../../services/dashboard/products/ProductsService'
import { useNavigate, useParams } from 'react-router-dom'
import CartComponent from '../../../components/CartComponent'
import CartService from '../../../services/dashboard/CartService'
import { toast } from 'react-toastify'

const Ribbon = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 10,
    right: 10,
    borderRadius: 100,
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white,
    padding: '4px 12px',
    //transform: 'translate(25%, -50%) rotate(45deg)',
    boxShadow: theme.shadows[3],
    zIndex: 1,
    fontSize: '0.75rem',
    fontWeight: 'bold',
}));

const CardContainer = styled(Card)({
    position: 'relative', // Necessary for absolute positioning of the ribbon
    overflow: 'visible', // Ensure the ribbon is visible even if it overflows
});

function ShopProductPage() {
    const { loading, setLoading,cart,updateCart } = useAuth();
    const [quantity, setQuantity] = useState(1);
    const [reload, setReload] = useState(false);
    const { id } = useParams();
    const navigator = useNavigate();

    const [product, setProduct] = useState(null);

    useEffect(() => {
        const productQ = cart.filter(product => product.id == id);
        if(productQ.length > 0){
            setQuantity(productQ[0].quantity);
            console.log(productQ[0]);
        }
        getProduct();
    }, [reload, id]);

    const getProduct = async () => {
        setLoading(true);
        const productData = await ProductsService.getProduct(id);
        if (productData) {
            //console.log(productData);
            setProduct(productData);
        }
        setLoading(false);
    }
const addToCart = ()=>{
    addItem();
    toast.success(product.item_name+" added to cart", {autoClose:1000});
}
    const addItem = () => {
        const newProduct = { ...product, quantity: quantity };
        CartService.addToCart(newProduct);
        updateCart();
    }
    const checkout=()=>{
        addItem();
        navigator("/dashboard/checkout");
    }

    const formatNumber = (num) => {
        // Convert to string with two decimals
        const fixed = num.toFixed(0);
        // Add thousand separators (commas)
        return fixed.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };


    return (
        <Container fluid>
            <Row>
                <Col xs={9} className='p-3'>
                    <h4><MdShoppingBag /> Product Details</h4>
                </Col>
                <Col xs={3} className='text-end p-3'>
                    {/*<Button variant='contained' color='primary' onClick={handleNewProduct}><FaPlus /> ADD</Button>*/}
                </Col>
                <Col sm={12} className='mb-3'>
                    {product != null && <CardContainer className='my-card border'>
                        <CardContent className='row'>
                            <Col sm={6} md={4} style={{ position: 'relative' }}>
                                <Image src={product.image != null ? product.image : "/assets/no-data.svg"} className='img-fluid' />
                                {product.product_discount != null && <Ribbon className='bg-danger'>-{product.product_discount.discount}%</Ribbon>}
                            </Col>
                            <Col sm={6} md={4}>
                                <h5>{product.item_name + " (" + product.item_code + ")"}<br />
                                    <span className='text-muted'>{product.product_category.name}</span></h5>
                                <table className='d-block d-sm-none w-100'>
                                    <tbody>
                                        <tr>
                                            <td>{<b className='text-primary'>KES {formatNumber(product.selling * (product.product_discount != null ? 1 - product.product_discount.discount / 100 : 1))}</b>}</td>
                                            <td className='text-end text-muted' style={{ textDecoration: "line-through" }}><b className='small'>Was KES {product.selling}</b></td>
                                        </tr>
                                    </tbody>
                                </table>
                                <p>{product.tag_remarks}</p>
                            </Col>
                            <Col sm={12} md={4}>
                                <div className='alert border border-2'>
                                    <table className='w-100 d-sm-block d-none border-bottom border-2 mb-3'>
                                        <tbody>
                                            <tr>
                                                <td className='pb-3'>{<b className='text-primary'>KES {formatNumber(product.selling * (product.product_discount != null ? 1 - product.product_discount.discount / 100 : 1))}</b>}</td>
                                                <td className='pb-3 text-end text-muted' style={{ textDecoration: "line-through" }}><b className='small'>Was KES {product.selling}</b></td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <Form>
                                        <Form.Label>Quantity:</Form.Label>
                                        <InputGroup className='border-2 border mb-3'>
                                            <InputGroup.Text className='border-0'>
                                                <Button variant='contained' color='primary' onClick={(e) => { if (quantity > 1) { setQuantity(quantity - 1) } }}><FaMinus /></Button>
                                            </InputGroup.Text>
                                            <Form.Control className='text-center border-0' placeholder='quantity' value={quantity} onChange={(e) => { setQuantity(e.target.value) }} readOnly></Form.Control>
                                            <InputGroup.Text className='border-0'>
                                                <Button variant='contained' color='primary' onClick={(e) => { setQuantity(quantity + 1) }}><FaPlus /></Button>
                                            </InputGroup.Text>
                                        </InputGroup>
                                        <Form.Group className='mb-3'>
                                            <Button variant='outlined' color='success' className='w-100 btn-pill mb-3' onClick={addToCart}>Add to Cart</Button>
                                            <Button variant='contained' color='success' className='w-100 btn-pill' onClick={checkout}>Buy Now</Button>
                                        </Form.Group>
                                    </Form>

                                </div>
                            </Col>
                        </CardContent>
                    </CardContainer>}
                </Col>
            </Row>
        </Container>
    )
}

export default ShopProductPage
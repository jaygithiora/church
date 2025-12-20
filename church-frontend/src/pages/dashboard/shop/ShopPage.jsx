import { Box, Button, Card, CardActions, CardContent, CardMedia, Pagination, styled } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Col, Container, Image, Row } from 'react-bootstrap'
import { MdShop } from 'react-icons/md'
import "react-image-crop/dist/ReactCrop.css";
import { useAuth } from '../../../services/AuthContext'
import ProductsService from '../../../services/dashboard/products/ProductsService'
import { useNavigate } from 'react-router-dom'
import LazyImageComponent from '../../../components/LazyImageComponent';


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

function ShopPage() {
    const { loading, setLoading } = useAuth();
    const navigator = useNavigate();

    const [products, setProducts] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [pages, setPages] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        getProducts();
    }, [pages]);

    const getProducts = async () => {
        setLoading(true);
        const productsData = await ProductsService.getProducts(pages);
        if (productsData.products) {
            //console.log(transactionsData);
            setProducts(productsData.products.data);
            setTotalPages(productsData.products.last_page);
        }
        setLoading(false);
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
                    <h4><MdShop /> Shop</h4>
                </Col>
                <Col xs={3} className='text-end p-3'>
                    {/*<Button variant='contained' color='primary' onClick={handleNewProduct}><FaPlus /> ADD</Button>*/}
                </Col>
                {products.length > 0 ? products.map((product, index) => (
                    <Col sm={6} md={4} className="p-3" key={index}>
                        <CardContainer className='my-card border h-100'>
                            {product.product_discount != null && <Ribbon className='bg-danger'>-{product.product_discount.discount}%</Ribbon>}
                            {/*<CardMedia component="img" image={product.image != null ? product.image : "/assets/no-data.svg"}></CardMedia>*/}

                            <CardContent className='pb-0'>
                                <LazyImageComponent
                                    src={product.image != null ? product.image : "/assets/avatar.jpeg"}
                                    placeholder="/assets/avatar.jpeg"
                                    alt="Network Image"
                                />

                                <p>{product.item_name + " (" + product.item_code + ")"}
                                    <span className='text-muted'>{product.product_category.name}</span></p>
                                <table className='w-100'>
                                    <tr>
                                        <td>{<b className='text-primary'>KES {formatNumber(product.selling * (product.product_discount != null ? 1 - product.product_discount.discount / 100 : 1))}</b>}</td>
                                        <td className='text-end text-muted' style={{ textDecoration: "line-through" }}><b>Was KES {product.selling}</b></td>
                                    </tr>
                                </table>
                            </CardContent>
                            <CardActions className='pb-3'>
                                <Button variant='contained' color='success' className='btn-pill w-100' onClick={(e) => { navigator(`/dashboard/shop/product/view/${product.id}`) }}>BUY NOW</Button>
                            </CardActions>
                        </CardContainer>
                    </Col>
                )) : (!loading && <Col xs={12} className='pt-5 pb-5'>
                    <div className='alert my-bg-secondary text-center text-muted'><Image src='/assets/no-data.svg' className='no-data-img' /> <br></br>No Products yet</div>
                </Col>)}
                <Col xs={12} className='mb-3'>
                    {/* Material-UI Pagination Component */}
                    {totalPages > 1 && <Pagination count={totalPages} page={pages} onChange={(event, value) => setPages(value)} color='primary' className='d-flex justify-content-center mt-3'></Pagination>}

                </Col>
            </Row>
        </Container>
    )
}

export default ShopPage
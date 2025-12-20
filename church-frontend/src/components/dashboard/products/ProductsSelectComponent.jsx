import React, { useCallback, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import Select from "react-select";
import { debounce } from '@mui/material';
import ProductsService from '../../../services/dashboard/products/ProductsService';

const ProductsSelectComponent = ({ selectedOption, onSelectChange }) => {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getProducts("")
    }, []);

    const getProducts = async (search) => {
        setLoading(true);
        const productsData = await ProductsService.getProducts(1);
        if (productsData) {
            const data = productsData.data.map(product => ({
                value: product.id,
                label: product.item_name
            }));
            let defaultProduct = data.find(product => product.label === "User");
            if (selectedOption != null) {
                //check if selected value exists
                const sr = data.find(role => role.label === selectedOption.label);
                if (sr == null) {
                    //selected value does not exist and should be added
                    //data.unshift({value: selectedOption.id, label: selectedOption.name});
                    data.unshift(selectedOption);
                }
                defaultProduct = data.find(product => product.label === selectedOption.label);
            }
            setOptions(data);
            onSelectChange(defaultProduct);
        }
        setLoading(false);
    }

    const fetchOptions = async (inputValue) => {
        if (!inputValue)
            return;
        await getProducts(inputValue);

    };
    const debouncedFetchOptions = useCallback(debounce(fetchOptions, 500), []);
    return (
        <>
            <Form.Label>Product</Form.Label>
            <Select options={options}
                value={selectedOption}
                onChange={onSelectChange}
                isLoading={loading}
                onInputChange={(inputValue) => debouncedFetchOptions(inputValue)}
                isSearchable
                isClearable
                placeholder="Select Product"
                noOptionsMessage={() => (loading ? "Loading..." : "No Products found")}
            />
        </>
    )
}

export default ProductsSelectComponent
import React, { useCallback, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import Select from "react-select";
import { debounce } from '@mui/material';
import ProductTaxesService from '../../../services/dashboard/products/ProductTaxesService';

const ProductTaxesSelectComponent = ({ selectedOption, onSelectChange }) => {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getProductTaxes("");
    }, []);

    const getProductTaxes = async (search) => {
        setLoading(true);
        const taxesData = await ProductTaxesService.getProductTaxes(1);
        if (taxesData) {
            const data = taxesData.data.map(tax => ({
                value: tax.id,
                label: tax.name
            }));
            let defaultTax = data.find(tax => tax.label === "User");
            if (selectedOption != null) {
                //check if selected value exists
                const sr = data.find(tax => tax.label === selectedOption.label);
                if (sr == null) {
                    //selected value does not exist and should be added
                    //data.unshift({value: selectedOption.id, label: selectedOption.name});
                    data.unshift(selectedOption);
                }
                defaultTax = data.find(tax => tax.label === selectedOption.label);
            }
            setOptions(data);
            onSelectChange(defaultTax);
        }
        setLoading(false);
    }

    const fetchOptions = async (inputValue) => {
        if (!inputValue)
            return;
        await getProductTaxes(inputValue);

    };
    const debouncedFetchOptions = useCallback(debounce(fetchOptions, 500), []);
    return (
        <>
            <Form.Label>Tax</Form.Label>
            <Select options={options}
                value={selectedOption}
                onChange={onSelectChange}
                isLoading={loading}
                onInputChange={(inputValue) => debouncedFetchOptions(inputValue)}
                isSearchable
                isClearable
                placeholder="Select Tax"
                noOptionsMessage={() => (loading ? "Loading..." : "No Taxes found")}
            />
        </>
    )
}

export default ProductTaxesSelectComponent
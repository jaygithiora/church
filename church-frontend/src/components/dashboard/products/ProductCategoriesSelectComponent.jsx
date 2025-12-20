import React, { useCallback, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import Select from "react-select";
import { debounce } from '@mui/material';
import ProductCategoriesService from '../../../services/dashboard/products/ProductCategoriesService';

const ProductCategoriesSelectComponent = ({ selectedOption, onSelectChange }) => {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getProductCategories("")
    }, []);

    const getProductCategories = async (search) => {
        setLoading(true);
        const rolesData = await ProductCategoriesService.getProductCategories(1);
        if (rolesData) {
            const data = rolesData.data.map(role => ({
                value: role.id,
                label: role.name
            }));
            let defaultRole = data.find(role => role.label === "User");
            if (selectedOption != null) {
                //check if selected value exists
                const sr = data.find(role => role.label === selectedOption.label);
                if (sr == null) {
                    //selected value does not exist and should be added
                    //data.unshift({value: selectedOption.id, label: selectedOption.name});
                    data.unshift(selectedOption);
                }
                defaultRole = data.find(role => role.label === selectedOption.label);
            }
            setOptions(data);
            if (defaultRole != null) {
                onSelectChange(defaultRole);
            }
        }
        setLoading(false);
    }

    const fetchOptions = async (inputValue) => {
        if (!inputValue)
            return;
        await getProductCategories(inputValue);

    };
    const debouncedFetchOptions = useCallback(debounce(fetchOptions, 500), []);
    return (
        <>
            <Form.Label>Category</Form.Label>
            <Select options={options}
                value={selectedOption}
                onChange={onSelectChange}
                isLoading={loading}
                onInputChange={(inputValue) => debouncedFetchOptions(inputValue)}
                isSearchable
                isClearable
                placeholder="Select Category"
                noOptionsMessage={() => (loading ? "Loading..." : "No Categories found")}
            />
        </>
    )
}

export default ProductCategoriesSelectComponent
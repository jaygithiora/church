import React, { useCallback, useEffect, useState } from "react";
import {
    Autocomplete,
    CircularProgress,
    debounce,
    TextField,
} from "@mui/material";
import { useSnackbar } from "notistack";
import InventoryDrugCategoriesService from "../../../services/dashboard/settings/InventoryDrugCategoriesService";

const InventoryDrugCategorySelectComponent = ({ selectedOption, onSelectChange }) => {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [inputValue, setInputValue] = useState(selectedOption?.label||"");
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        getInventoryDrugCategories("");
    }, []);

    const getInventoryDrugCategories = async (search) => {
        setLoading(true);
        const inventoryDrugCategoriesData = await InventoryDrugCategoriesService.getInventoryDrugCategories(1, enqueueSnackbar, search);
        if (inventoryDrugCategoriesData) {
            const data = inventoryDrugCategoriesData.data.map((inventoryDrugCategory) => ({
                value: inventoryDrugCategory.id,
                label: inventoryDrugCategory.name,
            }));
            if (selectedOption?.value != null && !data.some(d => d.value === selectedOption.value)) {
                data.unshift(selectedOption);
            }
            setOptions(data);
        }
        setLoading(false);
    };

    const fetchOptions = async (inputValue) => {
        if (!inputValue) return;
        await getInventoryDrugCategories(inputValue);
    };
    const debouncedFetchOptions = useCallback(debounce(fetchOptions, 500), []);
    return (
        <>
            <Autocomplete
                size="small"
                options={options}
                getOptionLabel={(option) => option.label || ""}
                value={selectedOption || null}
                inputValue={inputValue}
                onChange={(event, newValue) => {
                    onSelectChange(newValue);
                }}
                onInputChange={(event, newInputValue, reason) => {
                    if (reason !== "reset") {
                        setInputValue(newInputValue);
                        debouncedFetchOptions(newInputValue);
                    }
                }}
                loading={loading}
                isOptionEqualToValue={(option, value) => option.value === value?.value}
                clearOnEscape
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Inventory Drug Category"
                        placeholder="Select Inventory Drug Category"
                        variant="outlined"
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                    />
                )}
                noOptionsText={loading ? "Loading..." : "No Inventory Drug Categories found"}
            />
        </>
    );
};

export default InventoryDrugCategorySelectComponent;

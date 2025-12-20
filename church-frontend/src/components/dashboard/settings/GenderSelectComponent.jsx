import React, { useCallback, useEffect, useState } from "react";
import {
    Autocomplete,
    CircularProgress,
    debounce,
    TextField,
} from "@mui/material";
import { useSnackbar } from "notistack";
import GenderSettingsService from "../../../services/dashboard/settings/GenderSettingsService";

const GenderSelectComponent = ({ selectedOption, onSelectChange }) => {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [inputValue, setInputValue] = useState(selectedOption?.label||"");
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        getGenders("");
    }, []);

    const getGenders = async (search) => {
        setLoading(true);
        const genderData = await GenderSettingsService.getGenders(1);
        if (genderData) {
            const data = genderData.data.map((gender) => ({
                value: gender.id,
                label: gender.name,
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
        await getGenders(inputValue);
    };
    const debouncedFetchOptions = useCallback(debounce(fetchOptions, 500), []);
    return (
        <>
            <Autocomplete
                size="small"
                options={options}
                getOptionLabel={(option) => option.label || ""}
                value={selectedOption || null} // expects an array
                inputValue={inputValue}
                onChange={(event, newValue) => onSelectChange(newValue)} // newValue is an array

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
                        label="Gender"
                        placeholder="Select Gender"
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
                noOptionsText={loading ? "Loading..." : "No Gender found"}
            />
        </>
    );
};

export default GenderSelectComponent;

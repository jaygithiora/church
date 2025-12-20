import React, { useCallback, useEffect, useState } from "react";
import {
  Autocomplete,
  CircularProgress,
  debounce,
  TextField,
} from "@mui/material";
import { useSnackbar } from "notistack";
import AgeGroupSettingsService from "../../../services/dashboard/settings/AgeGroupSettingsService";

const AgeGroupSelectComponent = ({ selectedOption, onSelectChange }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const {enqueueSnackbar} = useSnackbar();

  useEffect(() => {
    getAgeGroups("");
  }, []);

  const getAgeGroups = async (search) => {
    setLoading(true);
    const ageGroupData = await AgeGroupSettingsService.getAgeGroups(1, enqueueSnackbar, search);
    if (ageGroupData) {
      const data = ageGroupData.data.map((ageGroupData) => ({
        value: ageGroupData.id,
        label: ageGroupData.name,
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
    await getAgeGroups(inputValue);
  };
  const debouncedFetchOptions = useCallback(debounce(fetchOptions, 500), []);
  return (
    <>
      <Autocomplete
        size="small"
        options={options}
        getOptionLabel={(option) => option.label || ""}
        value={selectedOption || []} // expects an array
        onChange={(event, newValue) => onSelectChange(newValue)} // newValue is an array
        onInputChange={(event, newInputValue) =>
          debouncedFetchOptions(newInputValue)
        }
        loading={loading}
        isOptionEqualToValue={(option, value) => option.value === value?.value}
        clearOnEscape
        renderInput={(params) => (
          <TextField
            {...params}
            label="Age Group"
            placeholder="Select Age Group"
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
        noOptionsText={loading ? "Loading..." : "No Age Group found"}
      />
    </>
  );
};

export default AgeGroupSelectComponent;

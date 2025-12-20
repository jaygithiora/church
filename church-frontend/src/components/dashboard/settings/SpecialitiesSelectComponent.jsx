import React, { useCallback, useEffect, useState } from "react";
import {
  Autocomplete,
  CircularProgress,
  debounce,
  TextField,
} from "@mui/material";
import SpecialitiesService from "../../../services/dashboard/settings/SpecialitiesService";

const SpecialitiesSelectComponent = ({ selectedOption, onSelectChange }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  //const [selectedRole, setSelectedRole] = useState(selectedOption);

  useEffect(() => {
    getSpecialities("");
  }, []);

  const getSpecialities = async (search) => {
    setLoading(true);
    const specialitiesData = await SpecialitiesService.getSpecialities(1);
    if (specialitiesData) {
      const data = specialitiesData.data.map((speciality) => ({
        value: speciality.id,
        label: speciality.name,
      }));
      //let defaultRole = [];
      if (selectedOption?.value != null && !data.some(d => d.value === selectedOption.value)) {
        data.unshift(selectedOption);
      }
      /*
      let defaultRole = data.find((role) => role.label === "Customer1");
      if (selectedOption != null) {
        //check if selected value exists
        const sr = data.find((role) => role.label === selectedOption.label);
        if (sr == null) {
          //selected value does not exist and should be added
          data.unshift(selectedOption);
        }
        defaultRole = data.find((role) => role.label === selectedOption.label);
      }*/
      setOptions(data);
      /*if (defaultRole != null) {
        onSelectChange(defaultRole);
      }*/
    }
    setLoading(false);
  };

  const fetchOptions = async (inputValue) => {
    if (!inputValue) return;
    await getSpecialities(inputValue);
  };
  const debouncedFetchOptions = useCallback(debounce(fetchOptions, 500), []);
  return (
    <>
      <Autocomplete
      multiple
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
            label="Specialities"
            placeholder="Select Specialities"
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
        noOptionsText={loading ? "Loading..." : "No Specialities found"}
      />
    </>
  );
};

export default SpecialitiesSelectComponent;

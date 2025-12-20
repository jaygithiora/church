import React, { useCallback, useEffect, useState } from "react";
import {
  Autocomplete,
  CircularProgress,
  debounce,
  TextField,
} from "@mui/material";
import MedicineFrequenciesService from "../../../services/dashboard/settings/MedicineFrequenciesService";
import MedicineRoutesService from "../../../services/dashboard/settings/MedicineRoutesService";

const MedicineRouteSelectComponent = ({ selectedOption, onSelectChange }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  //const [selectedRole, setSelectedRole] = useState(selectedOption);

  useEffect(() => {
    getMedicineRoutes("");
  }, []);

  const getMedicineRoutes = async (search) => {
    setLoading(true);
    const routesData = await MedicineRoutesService.getMedicineRoutes(1);
    if (routesData) {
      const data = routesData.data.map((route) => ({
        value: route.id,
        label: route.name,
        ...route
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
    await getMedicineRoutes(inputValue);
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
            label="Route"
            placeholder="Select Route"
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
        noOptionsText={loading ? "Loading..." : "No Routes found"}
      />
    </>
  );
};

export default MedicineRouteSelectComponent;

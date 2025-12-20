import React, { useCallback, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import Select from "react-select";
import RolesService from "../../../services/dashboard/users/RolesService";
import {
  Autocomplete,
  CircularProgress,
  debounce,
  TextField,
} from "@mui/material";

const RolesSelectComponent = ({ selectedOption, onSelectChange }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  //const [selectedRole, setSelectedRole] = useState(selectedOption);

  useEffect(() => {
    getRoles("");
  }, []);

  const getRoles = async (search) => {
    setLoading(true);
    const rolesData = await RolesService.getRoles(1);
    if (rolesData) {
      const data = rolesData.data.map((role) => ({
        value: role.id,
        label: role.name,
      }));
      let defaultRole = data.find((role) => role.label === "Customer1");
      if (selectedOption != null) {
        //check if selected value exists
        const sr = data.find((role) => role.label === selectedOption.label);
        if (sr == null) {
          //selected value does not exist and should be added
          data.unshift(selectedOption);
        }
        defaultRole = data.find((role) => role.label === selectedOption.label);
      }
      setOptions(data);
      if (defaultRole != null) {
        onSelectChange(defaultRole);
      }
    }
    setLoading(false);
  };

  const fetchOptions = async (inputValue) => {
    if (!inputValue) return;
    await getRoles(inputValue);
  };
  const debouncedFetchOptions = useCallback(debounce(fetchOptions, 500), []);
  return (
    <>
      <Autocomplete
        size="small"
        options={options}
        getOptionLabel={(option) => option.label || ""}
        value={selectedOption}
        onChange={(event, newValue) => onSelectChange(newValue)}
        onInputChange={(event, newInputValue) =>
          debouncedFetchOptions(newInputValue)
        }
        loading={loading}
        isOptionEqualToValue={(option, value) => option.value === value?.value}
        clearOnEscape
        renderInput={(params) => (
          <TextField
            {...params}
            label="Role"
            placeholder="Select Role"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        noOptionsText={loading ? "Loading..." : "No roles found"}
      />
    </>
  );
};

export default RolesSelectComponent;

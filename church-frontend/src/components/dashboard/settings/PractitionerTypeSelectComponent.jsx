import React, { useCallback, useEffect, useState } from "react";
import {
  Autocomplete,
  CircularProgress,
  debounce,
  TextField,
} from "@mui/material";
import PractitionerTypeSettingsService from "../../../services/dashboard/settings/PractitionerTypeSettingsService";

const PractitionerTypeSelectComponent = ({ selectedOption, onSelectChange }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  //const [selectedRole, setSelectedRole] = useState(selectedOption);

  useEffect(() => {
    getPractitionerTypes("");
  }, []);

  const getPractitionerTypes = async (search) => {
    setLoading(true);
    const practitionerTypeData = await PractitionerTypeSettingsService.getPractitionerTypes(1);
    if (practitionerTypeData) {
      const data = practitionerTypeData.data.map((practitionerType) => ({
        value: practitionerType.id,
        label: practitionerType.name,
        ...practitionerType
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
    await getPractitionerTypes(inputValue);
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
            label="Practitioner Type"
            placeholder="Select Practitioner Type"
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
        noOptionsText={loading ? "Loading..." : "No Practitioner Types found"}
      />
    </>
  );
};

export default PractitionerTypeSelectComponent;

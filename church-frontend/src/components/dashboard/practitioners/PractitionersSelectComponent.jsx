import React, { useCallback, useEffect, useState } from "react";
import {
  Autocomplete,
  CircularProgress,
  debounce,
  TextField,
} from "@mui/material";
import PractitionersService from "../../../services/dashboard/practitioners/PractitionersService";

const PractitionersSelectComponent = ({ selectedOption, onSelectChange, isMultiple = true }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    getPractitioners("");
  }, []);

  const getPractitioners = async (search) => {
    setLoading(true);
    const practitionersData = await PractitionersService.getPractitioners(1, search);
    if (practitionersData) {
      const data = practitionersData.data.map((practitioners) => ({
        value: practitioners.id,
        label: practitioners?.name+" - "+practitioners?.speciality?.name+"("+practitioners?.user?.phone+")",
      }));

      // Ensure the selected option(s) are included in options
      const selectedItems = isMultiple ? selectedOption || [] : [selectedOption].filter(Boolean);
      selectedItems.forEach((sel) => {
        if (sel?.value != null && !data.some((d) => d.value === sel.value)) {
          data.unshift(sel);
        }
      });

      setOptions(data);
    }
    setLoading(false);
  };

  const fetchOptions = async (inputValue) => {
    if (!inputValue) return;
    await getPractitioners(inputValue);
  };

  const debouncedFetchOptions = useCallback(debounce(fetchOptions, 500), []);

  return (
    <Autocomplete
      multiple={isMultiple}
      size="small"
      options={options}
      getOptionLabel={(option) => option.label || ""}
      value={selectedOption || (isMultiple ? [] : null)}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
        debouncedFetchOptions(newInputValue);
      }}
      onChange={(event, newValue) => {
        onSelectChange(newValue);
        if (!isMultiple) {
          setInputValue(newValue?.label || "");
        }
      }}
      loading={loading}
      isOptionEqualToValue={(option, value) => option?.value === value?.value}
      clearOnEscape
      renderInput={(params) => (
        <TextField
          {...params}
          label="Practitioners"
          placeholder={isMultiple ? "Practitioners" : "Practitioner"}
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
      noOptionsText={loading ? "Loading..." : "No Practitioners found"}
    />
  );
};

export default PractitionersSelectComponent;

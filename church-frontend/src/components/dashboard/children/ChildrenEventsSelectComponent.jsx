import React, { useCallback, useEffect, useState } from "react";
import {
  Autocomplete,
  CircularProgress,
  debounce,
  TextField,
} from "@mui/material";
import { useSnackbar } from "notistack";
import ChildrenEventsService from "../../../services/dashboard/children/ChildrenEventsService";

const ChildrenEventsSelectComponent = ({ selectedOption, onSelectChange, isMultiple = false }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const {enqueueSnackbar} = useSnackbar();

  useEffect(() => {
    getChildrenEvents("");
  }, []);

  const getChildrenEvents = async (search) => {
    setLoading(true);
    const childrenEventsData = await ChildrenEventsService.getChildrenEvents(1, enqueueSnackbar);
    if (childrenEventsData) {
      const data = childrenEventsData.data.map((event) => ({
        value: event.id,
        label: event.name,
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
    await getChildrenEvents(inputValue);
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
          label={isMultiple ? "Children Events" : "Children Event"}
          placeholder={isMultiple ? "Children Events" : "Children Event"}
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
      noOptionsText={loading ? "Loading..." : "No Children Events found"}
    />
  );
};

export default ChildrenEventsSelectComponent;

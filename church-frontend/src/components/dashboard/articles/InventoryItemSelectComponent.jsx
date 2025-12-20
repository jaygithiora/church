import React, { useCallback, useEffect, useState } from "react";
import {
  Autocomplete,
  CircularProgress,
  debounce,
  TextField,
} from "@mui/material";
import InventoryItemsService from "../../../services/dashboard/children/ChildrenService";

const InventoryItemSelectComponent = ({ selectedOption, onSelectChange, isMultiple = true }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    getInventories("");
  }, []);

  const getInventories = async (search) => {
    setLoading(true);
    const companiesData = await InventoryItemsService.getInventoryItems(1, search);
    if (companiesData) {
      const data = companiesData.data.map((inventoryItem) => ({
        value: inventoryItem.id,
        label: inventoryItem.item_code+" - "+inventoryItem.name+"("+inventoryItem.generic_name+")",
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
    await getInventories(inputValue);
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
          label="Inventory Item"
          placeholder={isMultiple ? "Inventory Items" : "Inventory Item"}
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
      noOptionsText={loading ? "Loading..." : "No Inventory Items found"}
    />
  );
};

export default InventoryItemSelectComponent;

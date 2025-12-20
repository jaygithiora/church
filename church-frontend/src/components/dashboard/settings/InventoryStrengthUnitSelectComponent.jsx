import React, { useCallback, useEffect, useState } from "react";
import {
  Autocomplete,
  CircularProgress,
  debounce,
  TextField,
} from "@mui/material";
import { useSnackbar } from "notistack";
import InventoryStrengthUnitsService from "../../../services/dashboard/settings/InventoryStrengthUnitsService";

const InventoryStrengthUnitSelectComponent = ({ selectedOption, onSelectChange }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const {enqueueSnackbar} = useSnackbar();

  useEffect(() => {
    getInventoryStrengthUnits("");
  }, []);

  const getInventoryStrengthUnits = async (search) => {
    setLoading(true);
    const inventoryStrengthUnitsData = await InventoryStrengthUnitsService.getInventoryStrengthUnits(1, enqueueSnackbar);
    if (inventoryStrengthUnitsData) {
      const data = inventoryStrengthUnitsData.data.map((inventoryStrengthUnit) => ({
        value: inventoryStrengthUnit.id,
        label: inventoryStrengthUnit.name,
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
    await getInventoryStrengthUnits(inputValue);
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
            label="Inventory Strenght Unit"
            placeholder="Select Inventory Strength Unit"
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
        noOptionsText={loading ? "Loading..." : "No Inventory Strength Units found"}
      />
    </>
  );
};

export default InventoryStrengthUnitSelectComponent;

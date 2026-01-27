import { Autocomplete, TextField } from "@mui/material";

const FilterDropdown = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  disabled = false,
}) => {
  return (
    <Autocomplete
      value={value || null}
      onChange={(event, newValue) => {
        onChange(newValue || "");
      }}
      options={options}
      disabled={disabled}
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder={placeholder} />
      )}
      sx={{
        width: "100%",
      }}
    />
  );
};

export default FilterDropdown;
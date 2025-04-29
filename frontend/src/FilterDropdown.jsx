import { Autocomplete, TextField } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiAutocomplete: {
      styleOverrides: {
        inputRoot: {
          color: "#333",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#ccc",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#0C75BC",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#0C75BC",
          },
        },
        option: {
          color: "#333",
          '&[data-focus="true"]': {
            backgroundColor: "#f0f0f0",
          },
          '&[aria-selected="true"]': {
            backgroundColor: "#e0e0e0",
          },
        },
      },
    },
  },
});

const FilterDropdown = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  disabled = false,
}) => {
  return (
    <ThemeProvider theme={theme}>
      <Autocomplete
        value={value || null}
        onChange={(event, newValue) => {
          onChange(newValue || "");
        }}
        options={options}
        disabled={disabled}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={placeholder}
            sx={{
              "& .MuiInputLabel-root": {
                color: "white",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#0C75BC",
              },
            }}
          />
        )}
        sx={{
          width: "100%",
          "& .MuiAutocomplete-clearIndicator": {
            color: "#666",
          },
        }}
      />
    </ThemeProvider>
  );
};

export default FilterDropdown;

import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

export default function SearchBar({ setSearchQuery }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <TextField
      id="table-search-bar"
      sx={{ m: 1, width: "35ch" }}
      placeholder="Search"
      type="search"
      variant="standard"
      value={searchTerm}
      onChange={handleChange}
      onInput={(e) => {
        setSearchQuery((e.target as HTMLInputElement).value);
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton aria-label="clear search bar" edge="end">
              <CloseIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}

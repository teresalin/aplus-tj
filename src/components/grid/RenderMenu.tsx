import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import React from "react";
import Tooltip from "@mui/material/Tooltip";

function RenderMenu({ onClick, onEditClick, onDeleteClick }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    onClick();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    onDeleteClick();
    handleClose();
  };

  const handleEdit = () => {
    onEditClick();
    handleClose();
  };

  return (
    <>
      <Tooltip title="Actions">
        <IconButton
          onClick={handleOpen}
          aria-label="action"
          size="small"
          aria-controls={anchorEl ? "assignment-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={anchorEl ? "true" : undefined}
        >
          <MoreHorizIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id="assignment-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </>
  );
}

export default RenderMenu;

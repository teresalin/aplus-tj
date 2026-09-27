"use client";

import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import React from "react";
import Tooltip from "@mui/material/Tooltip";

interface RenderMenuProps {
  onEditClick: () => void;
  onDeleteClick: () => void;
}

function RenderMenu({ onEditClick, onDeleteClick }: RenderMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  // Rendered once per grid row, so ids must be unique.
  const buttonId = React.useId();
  const menuId = React.useId();

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
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
          id={buttonId}
          onClick={handleOpen}
          aria-label="Actions"
          size="small"
          aria-controls={anchorEl ? menuId : undefined}
          aria-haspopup="true"
          aria-expanded={anchorEl ? "true" : undefined}
        >
          <MoreHorizIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id={menuId}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": buttonId,
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

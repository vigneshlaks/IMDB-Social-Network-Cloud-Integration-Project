import React from 'react';
import {Button} from "@mui/material";

const PageNavigator = ({currentPage, totalPages, onPageChange}) => {
  return (
    <div>
      <Button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="pageNavigatorButton"
      >
        ⬅️
      </Button>
      <span className="pageNavigatorInfo">
        {currentPage} / {totalPages}
      </span>
      <Button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="pageNavigatorButton"
      >
        ➡️
      </Button>
    </div>
  );
};

export default PageNavigator;

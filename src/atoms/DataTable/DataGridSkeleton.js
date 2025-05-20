import { TableCell, TableRow } from "@mui/material";
import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const DataGridSkeleton = ({ totalRow, totalCol, header }) => {
  return (
    <table
      style={{
        width: "100%",
        backgroundColor: "white",
        borderCollapse: "collapse",
      }}
    >
      <thead>
        <TableRow>
          {header?.map((col) => {
            return <TableCell>{col?.headerName}</TableCell>;
          })}
        </TableRow>
      </thead>
      <tbody>
        {Array(totalRow)
          .fill(0)
          .map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array(totalCol)
                .fill(0)
                .map((_, colIndex) => (
                  <td key={colIndex} style={{ padding: "8px" }}>
                    <Skeleton height={20} />
                  </td>
                ))}
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default DataGridSkeleton;

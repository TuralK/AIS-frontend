import React, { useState, useEffect } from "react";
import ListTableCSS from "./ListTable.module.css";
import Pagination from "./pagination";
import { useNavigate } from "react-router-dom";

const ListTable = ({ headers, content, columnSizes = {}, defaultItemsPerPage, isClickable, redirectField }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const navigate = useNavigate();

  const updateItemsPerPage = () => {
    const height = window.innerHeight;
    if (height <= 932) {
      setItemsPerPage(11);
    } else if (height <= 1036) {
      setItemsPerPage(13);
    } else if (height <= 1165) {
      setItemsPerPage(15);
    } else if (height <= 1243) {
      setItemsPerPage(17);
    } else {
      setItemsPerPage(20);
    }
  };

  useEffect(() => {
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => {
      window.removeEventListener("resize", updateItemsPerPage);
    };
  }, []);

  const totalPages = Math.ceil(content.length / itemsPerPage);
  const currentContent = content.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const defaultSize = "1fr";
  const gridTemplateColumns = headers.map((header) => columnSizes[header] || defaultSize).join(" ");

  return (
    <div>
      <div className="rounded-md border overflow-hidden">
        {/* Table Header */}
        <div className="grid" style={{ gridTemplateColumns }}>
          {headers.map((header, index) => (
            <div key={index} className="bg-muted/50 font-medium p-4 text-center border-b font-regular flex items-center justify-center">
              {header}
            </div>
          ))}
        </div>

        {/* Table Body */}
        {currentContent.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`grid transition-colors duration-200 ${isClickable ? "cursor-pointer hover:bg-gray-100" : ""}`}
            style={{ gridTemplateColumns }}
            onClick={() => isClickable && redirectField && navigate(`${row[redirectField]}`)}
          >
            {headers.map((header, cellIndex) => {
              const fieldKey = header.toLowerCase().replace(/\s+/g, "_");
              const fieldValue = row[fieldKey];

              return (
                <div key={`${rowIndex}-${cellIndex}`} className="p-4 border-b text-muted-foreground text-center font-light flex items-center justify-center">
                  {fieldValue}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
    </div>
  );
};

export default ListTable;

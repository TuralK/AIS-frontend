import React, { useState, useEffect } from "react";
import Pagination from "./pagination"

const ListTable = ({ headers, content, columnSizes = {}, defaultItemsPerPage }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);

  // Function to determine items per page based on screen width
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

  // Update items per page on mount and when window resizes
  useEffect(() => {
    updateItemsPerPage(); // Initial setup
    window.addEventListener("resize", updateItemsPerPage);
    
    return () => {
      window.removeEventListener("resize", updateItemsPerPage);
    };
  }, []);

  // Calculate total pages
  const totalPages = Math.ceil(content.length / itemsPerPage)

  // Get current page's content
  const currentContent = content.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Default size if not specified
  const defaultSize = "1fr"

  // Generate grid-template-columns based on headers and columnSizes
  const gridTemplateColumns = headers.map((header) => columnSizes[header] || defaultSize).join(" ")

  return (
    <div>
      <div className="rounded-md border overflow-hidden">
        <div className="grid" style={{ gridTemplateColumns }}>
          {/* Header row */}
          {headers.map((header, index) => (
            <div key={index} className="bg-muted/50 font-medium p-4 text-center border-b font-regular flex items-center justify-center">
              {header}
            </div>
          ))}

          {/* Content rows */}
          {currentContent.map((row, rowIndex) =>
            headers.map((header, cellIndex) => (
              <div key={`${rowIndex}-${cellIndex}`} className="p-4 border-b text-muted-foreground text-center font-light flex items-center justify-center">
                {row[header.toLowerCase().replace(/\s+/g, "_")]}
              </div>
            )),
          )}
        </div>
      </div>

      {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
    </div>
  )
}

export default ListTable


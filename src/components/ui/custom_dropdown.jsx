import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";


const CustomDropdown = ({ onDelete, isSentByUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="p-1 rounded-full hover:bg-gray-200 transition-colors opacity-0 group-hover:opacity-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MoreVertical size={16} className="text-gray-600" />
      </button>

      {isOpen && (
        <div className={`absolute ${isSentByUser ? "left-0" : "right-0"} mt-5 top-2 mt-1 w-auto min-w-[100px] bg-white border border-gray-200 rounded-lg shadow-lg z-20`}>
          <button
            onClick={onDelete}
            className="w-full text-left text-red-600 hover:bg-red-50 focus:bg-red-50 cursor-pointer px-3 py-2 text-sm flex items-center"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t("delete")}
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;

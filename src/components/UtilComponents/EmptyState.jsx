// src/components/EmptyState.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function EmptyState({
  icon,
  title,
  description,
  actionText,
  actionTo
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (typeof actionTo === "string") {
      navigate(actionTo);
    } else if (typeof actionTo === "function") {
      actionTo();
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center">
      {icon && <div className="mb-4 w-16 h-16">{icon}</div>}
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600 mb-6 max-w-md">{description}</p>
      <button
        onClick={handleClick}
        style={{ backgroundColor: "darkred" }}
        className="px-4 py-2 text-white rounded hover:opacity-90 transition-opacity"
      >
        {actionText}
      </button>
    </div>
  );
}
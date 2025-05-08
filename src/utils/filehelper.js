export const FileHelpers = {
    truncateFileName: (name, maxLength = 25) => {
      if (!name) return "";
      if (name.length <= maxLength) return name;
  
      const extension = name.split(".").pop();
      const nameWithoutExt = name.substring(0, name.lastIndexOf("."));
  
      return `${nameWithoutExt.substring(
        0,
        maxLength - extension.length - 3
      )}...${extension}`;
    },
  };
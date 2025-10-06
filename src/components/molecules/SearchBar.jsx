import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import { cn } from "@/utils/cn";

const SearchBar = ({ placeholder = "Search...", onSearch, className }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <ApperIcon 
        name="Search" 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
        size={20}
      />
      <Input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="pl-10"
      />
    </div>
  );
};

export default SearchBar;
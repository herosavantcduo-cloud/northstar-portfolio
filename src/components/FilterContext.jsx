import { createContext, useContext, useState } from "react";

const FilterContext = createContext(null);

export const defaultFilters = {
  dateFrom: "",
  dateTo: "",
  scoreMin: 0,
  scoreMax: 100,
  tags: [],
};

export function FilterProvider({ children }) {
  const [filters, setFilters] = useState(defaultFilters);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const updateFilter = (key, val) => setFilters((f) => ({ ...f, [key]: val }));
  const resetFilters = () => setFilters(defaultFilters);

  const applyFilters = (works) => {
    return works.filter((w) => {
      if (filters.dateFrom && w.created_date < filters.dateFrom) return false;
      if (filters.dateTo && w.created_date > filters.dateTo + "T23:59:59") return false;
      if (filters.scoreMin > 0 && (w.value_score || 0) < filters.scoreMin) return false;
      if (filters.scoreMax < 100 && (w.value_score || 101) > filters.scoreMax) return false;
      if (filters.tags.length > 0) {
        const workTags = w.tags || [];
        if (!filters.tags.every((t) => workTags.includes(t))) return false;
      }
      return true;
    });
  };

  const hasActiveFilters =
    !!filters.dateFrom || !!filters.dateTo || filters.scoreMin > 0 ||
    filters.scoreMax < 100 || filters.tags.length > 0;

  return (
    <FilterContext.Provider value={{ filters, updateFilter, resetFilters, applyFilters, hasActiveFilters, sidebarOpen, setSidebarOpen }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  return useContext(FilterContext);
}
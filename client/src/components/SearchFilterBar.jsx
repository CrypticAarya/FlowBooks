// Reusable search + filter row for list pages
const inputClass =
  'w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-accent hover:border-accent/40 transition-colors'

export default function SearchFilterBar({
  search,
  onSearchChange,
  searchPlaceholder,
  filter,
  onFilterChange,
  filterOptions,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <input
        type="search"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={searchPlaceholder}
        className={`${inputClass} sm:flex-1`}
      />
      <select
        value={filter}
        onChange={(e) => onFilterChange(e.target.value)}
        className={`${inputClass} sm:w-44`}
      >
        {filterOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

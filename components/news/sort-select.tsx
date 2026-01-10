"use client";

import { useRouter } from "next/navigation";

interface SortSelectProps {
  currentSort: string;
  sortOptions: { value: string; label: string }[];
  baseUrl: string;
  preserveParams: Record<string, string | undefined>;
}

export default function SortSelect({
  currentSort,
  sortOptions,
  baseUrl,
  preserveParams,
}: SortSelectProps) {
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams();

    // Add preserved params
    Object.entries(preserveParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    // Add the new sort value
    params.set("sort", e.target.value);

    const queryString = params.toString();
    router.push(`${baseUrl}${queryString ? `?${queryString}` : ""}`);
  };

  return (
    <select
      name="sort"
      value={currentSort}
      onChange={handleChange}
      className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-800 bg-white cursor-pointer"
    >
      {sortOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

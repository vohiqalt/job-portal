"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateJobPage() {
  const [form, setForm] = useState({
    title: "",
    location: "",
    salary: "",
    tags: "",
    description: "",
  });

  const [allLocations, setAllLocations] = useState<
    { city: string; country: string; flag: string | null }[]
  >([]);
  const [locationSuggestions, setLocationSuggestions] = useState<
    { city: string; country: string; flag: string | null }[]
  >([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const tagsArray = form.tags.split(",").map((tag) => tag.trim());

    // Fetch the selected location details
    const selectedLocation = allLocations.find(
      (loc) =>
        `${loc.city}, ${loc.country}`.toLowerCase() ===
        form.location.toLowerCase()
    );

    const jobData = {
      ...form,
      tags: tagsArray,
      location: selectedLocation
        ? {
            city: selectedLocation.city,
            country: selectedLocation.country,
            flag: selectedLocation.flag,
          }
        : { city: form.location, country: "", flag: null }, // Default to minimal structure
    };

    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jobData),
    });

    if (res.ok) {
      router.push("/jobs");
    } else {
      console.error("Failed to create job");
    }
  }

  async function fetchAllLocations() {
    try {
      const [countriesRes, flagsRes] = await Promise.all([
        fetch("https://countriesnow.space/api/v0.1/countries"),
        fetch("https://countriesnow.space/api/v0.1/countries/flag/images"),
      ]);

      if (countriesRes.ok && flagsRes.ok) {
        const countriesData = await countriesRes.json();
        const flagsData = await flagsRes.json();

        const countryFlags = flagsData.data.reduce((acc: any, item: any) => {
          acc[item.name] = item.flag; // Map country name to flag URL
          return acc;
        }, {});

        const locations = countriesData.data.flatMap((country: any) =>
          country.cities.map((city: string) => ({
            city,
            country: country.country,
            flag: countryFlags[country.country] || null, // Get flag URL or null
          }))
        );

        setAllLocations(locations);
      } else {
        console.error("Failed to fetch countries or flags");
      }
    } catch (error) {
      console.error("Error fetching locations and flags:", error);
    }
  }

  useEffect(() => {
    fetchAllLocations();
  }, []);

  useEffect(() => {
    const query = form.location.toLowerCase().trim();
    const delayDebounceFn = setTimeout(() => {
      if (query) {
        const filteredSuggestions = allLocations
          .filter((location) =>
            `${location.city}, ${location.country}`
              .toLowerCase()
              .includes(query)
          )
          .map((location) => ({
            city: location.city,
            country: location.country,
            flag: location.flag,
          }));
        setLocationSuggestions(filteredSuggestions.slice(0, 5)); // Limit to 5 suggestions
      } else {
        setLocationSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [form.location, allLocations]);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create Job Listing</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium mb-1">Job Title:</label>
          <input
            type="text"
            placeholder="Job Title"
            className="w-full p-2 border border-gray-300 rounded text-black"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>

        <div className="relative">
          <label className="block text-sm font-medium mb-1">Location:</label>
          <input
            type="text"
            placeholder="Location"
            className="w-full p-2 border border-gray-300 rounded text-black"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            required
          />
          {locationSuggestions.map((suggestion, index) => {
            // Split city and country for highlighting
            const fullText = `${suggestion.city}, ${suggestion.country}`;
            const query = form.location.toLowerCase();
            const regex = new RegExp(`(${query})`, "gi"); // Case-insensitive matching
            const parts = fullText.split(regex);

            return (
              <li
                key={index}
                className="flex items-center p-2 hover:bg-gray-400 cursor-pointer"
                onClick={() =>
                  setForm({
                    ...form,
                    location: fullText,
                  })
                }
              >
                {suggestion.flag && (
                  <img
                    src={suggestion.flag}
                    alt={suggestion.country}
                    className="w-6 h-4 mr-2"
                  />
                )}
                <span>
                  {parts.map((part, i) =>
                    regex.test(part) ? (
                      <span key={i} className="text-yellow-400 font-bold">
                        {part}
                      </span>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )}
                </span>
              </li>
            );
          })}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Salary:</label>
          <input
            type="text"
            placeholder="Salary"
            className="w-full p-2 border border-gray-300 rounded text-black"
            value={form.salary}
            onChange={(e) => setForm({ ...form, salary: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tags:</label>
          <input
            type="text"
            placeholder="Tags (comma-separated)"
            className="w-full p-2 border border-gray-300 rounded text-black"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Job Description:
          </label>
          <textarea
            placeholder="Job Description"
            className="w-full p-2 border border-gray-300 rounded text-black"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create Job
        </button>
      </form>
    </main>
  );
}

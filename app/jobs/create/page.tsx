"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateJobPage() {
  const [form, setForm] = useState({
    title: "",
    location: "",
    salary: "",
    currency: "",
    tags: "",
    description: "",
  });

  const [allLocations, setAllLocations] = useState<
    { city: string; country: string; flag: string | null }[]
  >([]);
  const [allCurrencies, setAllCurrencies] = useState<string[]>([]);
  const [locationSuggestions, setLocationSuggestions] = useState<
    { city: string; country: string; flag: string | null }[]
  >([]);
  const [currencyDropdownVisible, setCurrencyDropdownVisible] = useState(false);
  const [locationDropdownVisible, setLocationDropdownVisible] = useState(false);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const tagsArray = form.tags.split(",").map((tag) => tag.trim());

    const selectedLocation = allLocations.find(
      (loc) =>
        `${loc.city}, ${loc.country}`.toLowerCase() ===
        form.location.toLowerCase()
    );

    form.title = form.title.trim();

    const jobData = {
      ...form,
      tags: tagsArray,
      location: selectedLocation
        ? {
            city: selectedLocation.city,
            country: selectedLocation.country,
            flag: selectedLocation.flag,
          }
        : { city: form.location, country: "", flag: null },
      currency: form.currency, // Ensure currency is included
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

  async function fetchAllLocationsAndCurrencies() {
    try {
      const [countriesRes, flagsRes, currenciesRes] = await Promise.all([
        fetch("https://countriesnow.space/api/v0.1/countries"),
        fetch("https://countriesnow.space/api/v0.1/countries/flag/images"),
        fetch("https://countriesnow.space/api/v0.1/countries/currency"),
      ]);

      if (countriesRes.ok && flagsRes.ok && currenciesRes.ok) {
        const countriesData = await countriesRes.json();
        const flagsData = await flagsRes.json();
        const currenciesData = await currenciesRes.json();

        const countryFlags = flagsData.data.reduce((acc: any, item: any) => {
          acc[item.name] = item.flag;
          return acc;
        }, {});

        const locations = countriesData.data.flatMap((country: any) =>
          country.cities.map((city: string) => ({
            city,
            country: country.country,
            flag: countryFlags[country.country] || null,
          }))
        );

        // Remove duplicate currencies
        const uniqueCurrencies = Array.from(
          new Set(currenciesData.data.map((item: any) => item.currency))
        ).sort();

        setAllLocations(locations);
        setAllCurrencies(uniqueCurrencies as string[]);
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    fetchAllLocationsAndCurrencies();
  }, []);

  useEffect(() => {
    if (!form.location.trim()) {
      setLocationSuggestions([]);
      return;
    }

    const query = form.location.toLowerCase().trim();
    const delayDebounceFn = setTimeout(() => {
      const filteredSuggestions = allLocations
        .filter((location) =>
          `${location.city}, ${location.country}`.toLowerCase().includes(query)
        )
        .slice(0, 5); // Limit suggestions to 5

      setLocationSuggestions(filteredSuggestions);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [form.location, allLocations]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Check if click is inside location or currency dropdowns
      if (
        !target.closest(".location-dropdown") &&
        !target.closest(".currency-dropdown")
      ) {
        setLocationDropdownVisible(false);
        setCurrencyDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const prioritizedCurrencies = () => {
    const selectedCountry = allLocations.find(
      (loc) =>
        `${loc.city}, ${loc.country}`.toLowerCase() ===
        form.location.toLowerCase()
    )?.country;

    const countryCurrency = allCurrencies.find(
      (currency) =>
        currency.toLowerCase() === (selectedCountry || "").toLowerCase()
    );

    const specialCurrencies = ["USD", "EUR", "GBP"];
    if (countryCurrency && !specialCurrencies.includes(countryCurrency)) {
      specialCurrencies.unshift(countryCurrency);
    }

    const remainingCurrencies = allCurrencies.filter(
      (currency) => !specialCurrencies.includes(currency)
    );

    return [...specialCurrencies, ...remainingCurrencies];
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">Create Job Listing</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label className="block text-sm font-medium">Job Title</label>
          <input
            type="text"
            placeholder="Enter the job title"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded focus:ring focus:ring-blue-500"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>

        <div className="space-y-1 relative location-dropdown">
          <label className="block text-sm font-medium">Location</label>
          <input
            type="text"
            placeholder="City, Country"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded focus:ring focus:ring-blue-500"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            onFocus={() => setLocationDropdownVisible(true)} // Show dropdown on focus
            required
          />
          {locationDropdownVisible && locationSuggestions.length > 0 && (
            <ul className="absolute top-full left-0 w-full bg-gray-800 border border-gray-700 mt-1 rounded shadow-md z-10 max-h-40 overflow-y-auto">
              {locationSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="p-2 hover:bg-gray-700 flex items-center cursor-pointer"
                  onClick={() => {
                    setForm({
                      ...form,
                      location: `${suggestion.city}, ${suggestion.country}`,
                    });
                    setLocationDropdownVisible(false); // Hide dropdown after selection
                  }}
                >
                  {suggestion.flag && (
                    <img
                      src={suggestion.flag}
                      alt={`${suggestion.country} flag`}
                      className="w-6 h-4 mr-2"
                    />
                  )}
                  {suggestion.city}, {suggestion.country}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium">Salary</label>
            <input
              type="text"
              placeholder="e.g., 50000"
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded focus:ring focus:ring-blue-500"
              value={form.salary}
              onChange={(e) => setForm({ ...form, salary: e.target.value })}
            />
          </div>
          <div className="space-y-1 relative currency-dropdown">
            <label className="block text-sm font-medium">Currency</label>
            <input
              type="text"
              placeholder="Select Currency"
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded focus:ring focus:ring-blue-500"
              value={form.currency}
              readOnly // Prevent typing, opens dropdown only
              onFocus={() => setCurrencyDropdownVisible(true)} // Show dropdown on focus
            />
            {currencyDropdownVisible && (
              <ul className="absolute top-full left-0 w-full bg-gray-800 border border-gray-700 mt-1 rounded shadow-md z-10 max-h-60 overflow-y-auto">
                {prioritizedCurrencies().map((currency, index) => (
                  <li
                    key={index}
                    className="p-2 hover:bg-gray-700 cursor-pointer"
                    onClick={() => {
                      setForm({ ...form, currency });
                      setCurrencyDropdownVisible(false); // Hide dropdown after selection
                    }}
                  >
                    {currency}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium">Tags</label>
          <input
            type="text"
            placeholder="e.g., React, JavaScript"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded focus:ring focus:ring-blue-500"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium">Description</label>
          <textarea
            placeholder="Provide a brief job description"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded focus:ring focus:ring-blue-500"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full p-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded focus:ring focus:ring-blue-500"
        >
          Create Job
        </button>
      </form>
    </div>
  );
}

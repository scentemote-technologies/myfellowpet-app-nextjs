"use client";

import { useState } from "react";

type RatesMap = Record<string, string>;

type PetInfo = {
  rates_daily: RatesMap;
  walking_rates: RatesMap;
  meal_rates: RatesMap;
  total_prices: RatesMap;
};

export default function PetPricingTable({
  petInformation,
}: {
  petInformation: Record<string, any>;
}) {
  const petKeys = Object.keys(petInformation);
  const [selectedPet, setSelectedPet] = useState(petKeys[0]);

  const pet: PetInfo = petInformation[selectedPet];

  const sizes = ["Small", "Medium", "Large", "Giant"];

  return (
    <div className="overflow-x-auto rounded-2xl border bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h3 className="text-lg font-semibold">Per-Day Pricing</h3>

        <select
          value={selectedPet}
          onChange={(e) => setSelectedPet(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm font-medium bg-[#2CB4B6]/20 focus:outline-none"
        >
          {petKeys.map((key) => (
            <option key={key} value={key}>
              {petInformation[key].name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-3 text-left font-semibold">Type</th>
            {sizes.map((s) => (
              <th key={s} className="p-3 text-center font-semibold">
                {s}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          <Row label="Boarding" values={pet.rates_daily} sizes={sizes} />
          <Row label="Walking" values={pet.walking_rates} sizes={sizes} />
          <Row label="Meal" values={pet.meal_rates} sizes={sizes} />

          {/* Total */}
          <tr className="bg-yellow-50 font-semibold">
            <td className="p-3">Total</td>
            {sizes.map((s) => (
              <td key={s} className="p-3 text-center">
                ₹{pet.total_prices?.[s] ?? "—"}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function Row({
  label,
  values,
  sizes,
}: {
  label: string;
  values: RatesMap;
  sizes: string[];
}) {
  return (
    <tr className="border-t">
      <td className="p-3 font-medium">{label}</td>
      {sizes.map((s) => (
        <td key={s} className="p-3 text-center">
          ₹{values?.[s] ?? "—"}
        </td>
      ))}
    </tr>
  );
}

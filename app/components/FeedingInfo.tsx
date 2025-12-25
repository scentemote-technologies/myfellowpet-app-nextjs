"use client";

import Image from "next/image";
import { useState } from "react";

type FeedingDetails = Record<string, any>;

export default function PetFeedingDetails({
  petInformation,
}: {
  petInformation: Record<string, any>;
}) {
  const petKeys = Object.keys(petInformation);
  const [selectedPet, setSelectedPet] = useState(petKeys[0]);
  const [expanded, setExpanded] = useState(false);

  const feeding: FeedingDetails =
    petInformation[selectedPet]?.feeding_details || {};

  const meals = Object.entries(feeding).filter(
    ([name]) => !name.toLowerCase().includes("water")
  );

  const water = feeding["Water Availability"];

  return (
    <div className="rounded-2xl border bg-white max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900">
          Feeding Routine
        </h3>

        <select
          value={selectedPet}
          onChange={(e) => setSelectedPet(e.target.value)}
          className="rounded-md border px-3 py-2 text-sm bg-gray-50 focus:outline-none"
        >
          {petKeys.map((key) => (
            <option key={key} value={key}>
              {petInformation[key].name}
            </option>
          ))}
        </select>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Always show Morning */}
        {meals
          .filter(([name]) => name.toLowerCase().includes("morning"))
          .map(([mealName, meal]: any) => (
            <MealBlock key={mealName} mealName={mealName} meal={meal} />
          ))}

        {/* Show more meals */}
        {expanded &&
          meals
            .filter(([name]) => !name.toLowerCase().includes("morning"))
            .map(([mealName, meal]: any) => (
              <MealBlock key={mealName} mealName={mealName} meal={meal} />
            ))}

        {/* Toggle */}
        {meals.length > 1 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm font-medium text-teal-700 hover:underline"
          >
            {expanded ? "Show less" : "Show more"}
          </button>
        )}

        {/* Water */}
        {water?.description && (
          <div className="mt-4 rounded-lg bg-gray-50 p-4">
            <p className="text-sm font-semibold">Water Availability</p>
            <p className="text-sm text-gray-700 mt-1">
              {water.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= MEAL BLOCK ================= */

const MealBlock = ({
  mealName,
  meal,
}: {
  mealName: string;
  meal: any;
}) => {
  if (!meal.food_title && !meal.description) return null;

  return (
    <div className="flex gap-4 border rounded-lg p-4 max-w-xl">
      {/* Image */}
      {meal.image ? (
        <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
          <Image
            src={meal.image}
            alt={meal.food_title || mealName}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="w-16 h-16 rounded-md bg-gray-100 flex items-center justify-center text-[10px] text-gray-400">
          No image
        </div>
      )}

      {/* Text */}
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-900">
          {mealName}
        </p>

        {meal.food_title && (
          <p className="text-sm text-gray-700 mt-0.5">
            {meal.food_title}
          </p>
        )}

        {meal.description && (
          <p className="text-xs text-gray-500 mt-1">
            {meal.description}
          </p>
        )}

        {meal.ingredients?.length > 0 && (
          <p className="text-xs text-gray-500 mt-1">
            <span className="font-medium">Ingredients:</span>{" "}
            {meal.ingredients.join(", ")}
          </p>
        )}

        {meal.portion && (
          <p className="text-xs text-gray-500 mt-1">
            <span className="font-medium">Portion:</span> {meal.portion}
          </p>
        )}
      </div>
    </div>
  );
};

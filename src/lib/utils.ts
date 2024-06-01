import type { DisplayOptions } from "$lib/interfaces";

// Capitalize first letter
export function capitalizeFirstLetter(value: string): string { 
	return value.charAt(0).toUpperCase() + value.slice(1); 
}

// Generates a random string of a given length. Defaults to 6 characters.
export const generateRandomString = (length=6)=>Math.random().toString(20).substring(2, length + 2);

export let protocols: DisplayOptions[] = [
  {
    name: "API",
    displayName: "API",
    active: true
  },
  {
    name: "Analytics Hub",
    displayName: "Analytics Hub",
    active: true
  },
  {
    name: "Event",
    displayName: "Event stream",
    active: false
  },
  {
    name: "Data sync",
    displayName: "Data sync",
    active: true
  }
];

export let audiences: DisplayOptions[] = [
  {
    name: "internal",
    displayName: "Internal",
    active: true
  },
  {
    name: "partner",
    displayName: "Partner",
    active: true
  },
  {
    name: "external",
    displayName: "External",
    active: true
  }
];
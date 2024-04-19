import type { DisplayOptions } from "$lib/interfaces";

// Generates a random string of a given length. Defaults to 6 characters.
export const generateRandomString = (length=6)=>Math.random().toString(20).substring(2, length + 2);

export let protocols: DisplayOptions[] = [
  {
    name: "api",
    displayName: "API",
    active: true
  },
  {
    name: "event",
    displayName: "Event stream",
    active: false
  },
  {
    name: "ah",
    displayName: "Analytics Hub",
    active: false
  },
  {
    name: "sync",
    displayName: "Data sync",
    active: false
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
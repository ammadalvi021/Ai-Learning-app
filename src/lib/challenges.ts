export type ChallengeTest = {
  label: string;
  args: unknown[];
  expected: unknown;
};

export type CodingChallenge = {
  id: string;
  title: string;
  difficulty: string;
  concept: string;
  description: string;
  functionName: string;
  starterCode: string;
  referenceSolution: string;
  hints: string[];
  tests: ChallengeTest[];
};

export const challenges: CodingChallenge[] = [
  {
    id: "sum-positives",
    title: "Sum the positives",
    difficulty: "Starter",
    concept: "Arrays · conditions",
    description:
      "Complete sumPositives(numbers). Return the sum of numbers greater than zero. Ignore negative values and zero. The input is always an array of finite numbers, and an empty array should return 0.",
    functionName: "sumPositives",
    starterCode:
      "function sumPositives(numbers) {\n  // Add only the numbers greater than zero.\n  return 0;\n}\n",
    referenceSolution:
      "function sumPositives(numbers) {\n  return numbers.reduce((sum, number) => {\n    return number > 0 ? sum + number : sum;\n  }, 0);\n}\n",
    hints: [
      "Start a total at 0. Visit every number with a loop or reduce().",
      "Only add a number when number > 0. Return the final total after visiting the whole array.",
    ],
    tests: [
      {
        label: "Mixed positive and negative values",
        args: [[1, -2, 3, 4]],
        expected: 8,
      },
      { label: "No positive values", args: [[-4, 0, -7]], expected: 0 },
      { label: "Empty input", args: [[]], expected: 0 },
      { label: "Every value is positive", args: [[2, 5, 10]], expected: 17 },
    ],
  },
  {
    id: "normalize-usernames",
    title: "Clean up usernames",
    difficulty: "Starter",
    concept: "Strings · array methods",
    description:
      "Complete normalizeUsernames(names). Trim spaces from the start and end of each name, convert it to lowercase, and remove any names that become empty. Keep the remaining names in their original order. The input is always an array of strings.",
    functionName: "normalizeUsernames",
    starterCode:
      "function normalizeUsernames(names) {\n  // Trim, lowercase, and remove empty names.\n  return [];\n}\n",
    referenceSolution:
      "function normalizeUsernames(names) {\n  return names\n    .map((name) => name.trim().toLowerCase())\n    .filter((name) => name.length > 0);\n}\n",
    hints: [
      "Use map() to transform every string with trim() and toLowerCase().",
      "Use filter() after mapping to keep only strings whose length is greater than 0.",
    ],
    tests: [
      {
        label: "Whitespace and uppercase names",
        args: [[" Ada ", "LINUS", "  Grace  "]],
        expected: ["ada", "linus", "grace"],
      },
      {
        label: "Blank names are removed",
        args: [[" ", "ALAN", "", "  "]],
        expected: ["alan"],
      },
      {
        label: "Internal spaces stay intact",
        args: [["  Grace Hopper  "]],
        expected: ["grace hopper"],
      },
      { label: "Empty input", args: [[]], expected: [] },
    ],
  },
  {
    id: "count-words",
    title: "Build a word counter",
    difficulty: "Starter",
    concept: "Strings · regular expressions",
    description:
      "Complete countWords(text). Return the number of whitespace-separated words. Treat one or more spaces, tabs, or line breaks as a separator. Blank or whitespace-only text should return 0. The input is always a string.",
    functionName: "countWords",
    starterCode:
      "function countWords(text) {\n  // Ignore outer whitespace and count the words.\n  return 0;\n}\n",
    referenceSolution:
      "function countWords(text) {\n  const clean = text.trim();\n  return clean === '' ? 0 : clean.split(/\\s+/).length;\n}\n",
    hints: [
      "Trim the text first. Return 0 immediately if the trimmed string is empty.",
      "Split the trimmed text with /\\s+/ to handle runs of spaces, tabs, and line breaks. Return the resulting array’s length.",
    ],
    tests: [
      {
        label: "A short sentence",
        args: ["Code a little every day"],
        expected: 5,
      },
      {
        label: "Extra outer and inner spaces",
        args: ["  hello   world  "],
        expected: 2,
      },
      { label: "Tabs and line breaks", args: ["one\ttwo\nthree"], expected: 3 },
      { label: "Whitespace-only input", args: [" \n\t "], expected: 0 },
    ],
  },
];

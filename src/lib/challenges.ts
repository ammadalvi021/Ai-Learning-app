export type ChallengeTest = {
  label: string;
  args: unknown[];
  expected: unknown;
};

export type CodingChallenge = {
  id: string;
  title: string;
  difficulty: "Starter" | "Intermediate";
  category: "Arrays" | "Strings" | "Numbers" | "Objects" | "Algorithms";
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
    category: "Arrays",
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
    category: "Strings",
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
    category: "Strings",
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
  {
    id: "max-number",
    title: "Find the highest number",
    category: "Numbers",
    difficulty: "Starter",
    concept: "Comparison · array traversal",
    description:
      "Complete maxNumber(numbers). Return the largest value in an array of finite numbers. Return null for an empty array. Negative values and decimal numbers are allowed. Do not change the input array.",
    functionName: "maxNumber",
    starterCode:
      "function maxNumber(numbers) {\n  // Return the greatest value, or null for an empty array.\n  return null;\n}\n",
    referenceSolution:
      "function maxNumber(numbers) {\n  if (numbers.length === 0) return null;\n  let highest = numbers[0];\n  for (const number of numbers) {\n    if (number > highest) highest = number;\n  }\n  return highest;\n}\n",
    hints: [
      "Handle the empty array before reading its first element. Start with the first value rather than 0, because every number might be negative.",
      "Visit each number. Replace your saved highest value only when the current number is larger, then return the saved value.",
    ],
    tests: [
      {
        label: "Mixed values",
        args: [[4, 9, 2, 7]],
        expected: 9,
      },
      {
        label: "All negative",
        args: [[-8, -2, -11]],
        expected: -2,
      },
      {
        label: "Empty array",
        args: [[]],
        expected: null,
      },
      {
        label: "Single decimal",
        args: [[-0.5]],
        expected: -0.5,
      },
      {
        label: "Repeated maximum",
        args: [[3, 3, 1]],
        expected: 3,
      },
    ],
  },
  {
    id: "reverse-text",
    title: "Reverse a string",
    category: "Strings",
    difficulty: "Starter",
    concept: "Strings · array methods",
    description:
      "Complete reverseText(text). Return the characters of an ASCII string in reverse order. Keep spaces, punctuation, and letter case exactly as supplied. The input may be empty. This exercise uses ASCII characters only, so Unicode grapheme handling is outside its scope.",
    functionName: "reverseText",
    starterCode:
      'function reverseText(text) {\n  // Reverse all characters without changing their case.\n  return "";\n}\n',
    referenceSolution:
      'function reverseText(text) {\n  return text.split("").reverse().join("");\n}\n',
    hints: [
      'A string can be split into an array of individual characters using split("").',
      "Reverse that array, then join it back into a string with no separator.",
    ],
    tests: [
      {
        label: "Simple word",
        args: ["hello"],
        expected: "olleh",
      },
      {
        label: "Preserve spaces and punctuation",
        args: ["Code! Now."],
        expected: ".woN !edoC",
      },
      {
        label: "Empty string",
        args: [""],
        expected: "",
      },
      {
        label: "Single character",
        args: ["X"],
        expected: "X",
      },
      {
        label: "Outer spaces",
        args: [" ab "],
        expected: " ba ",
      },
    ],
  },
  {
    id: "title-case",
    title: "Format a title",
    category: "Strings",
    difficulty: "Starter",
    concept: "Whitespace · string transformation",
    description:
      "Complete titleCase(text). Trim outer whitespace, split on one or more whitespace characters, and join words with one space. For each word, uppercase its first character and lowercase the remaining characters. Inputs contain only ASCII letters and whitespace. Return an empty string for whitespace-only input.",
    functionName: "titleCase",
    starterCode:
      'function titleCase(text) {\n  // Normalize whitespace and capitalize each word.\n  return "";\n}\n',
    referenceSolution:
      'function titleCase(text) {\n  const clean = text.trim();\n  if (clean === "") return "";\n  return clean.split(/\\s+/)\n    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())\n    .join(" ");\n}\n',
    hints: [
      "Trim the string first, then check whether it has become empty. A /\\s+/ separator handles spaces, tabs, and line breaks.",
      "Map each word to its uppercase first character plus its lowercase remaining characters. Join the transformed words with one space.",
    ],
    tests: [
      {
        label: "Mixed letter case",
        args: ["hELLo wORLD"],
        expected: "Hello World",
      },
      {
        label: "Runs of whitespace",
        args: ["  learn\tto\nCODE  "],
        expected: "Learn To Code",
      },
      {
        label: "Whitespace only",
        args: [" \n\t "],
        expected: "",
      },
      {
        label: "Single letters",
        args: ["a B c"],
        expected: "A B C",
      },
      {
        label: "Empty string",
        args: [""],
        expected: "",
      },
    ],
  },
  {
    id: "unique-numbers",
    title: "Keep the first occurrence",
    category: "Arrays",
    difficulty: "Starter",
    concept: "Sets · stable ordering",
    description:
      "Complete uniqueNumbers(numbers). Return a new array containing each distinct finite number once, in the order of its first appearance. Do not sort the result or change the input array. An empty input produces an empty array.",
    functionName: "uniqueNumbers",
    starterCode:
      "function uniqueNumbers(numbers) {\n  // Keep unique numbers in their original first-seen order.\n  return [];\n}\n",
    referenceSolution:
      "function uniqueNumbers(numbers) {\n  return [...new Set(numbers)];\n}\n",
    hints: [
      "You need to remember which values have already appeared. A Set stores each distinct value only once.",
      "JavaScript Sets keep insertion order. Construct a Set from the input and spread it into a new array.",
    ],
    tests: [
      {
        label: "Repeated numbers",
        args: [[3, 1, 3, 2, 1]],
        expected: [3, 1, 2],
      },
      {
        label: "Do not sort",
        args: [[8, 2, 5, 8]],
        expected: [8, 2, 5],
      },
      {
        label: "Empty input",
        args: [[]],
        expected: [],
      },
      {
        label: "Negative and decimal values",
        args: [[-1, 0, -1, 0.5, 0]],
        expected: [-1, 0, 0.5],
      },
      {
        label: "All equal",
        args: [[4, 4, 4]],
        expected: [4],
      },
    ],
  },
  {
    id: "count-occurrences",
    title: "Build a frequency table",
    category: "Objects",
    difficulty: "Intermediate",
    concept: "Objects · safe property keys",
    description:
      'Complete countOccurrences(words). Return an object mapping each exact string to its number of appearances. Matching is case-sensitive, and empty strings count as valid keys. Handle special keys such as "__proto__" and "constructor" as ordinary strings. Inputs are arrays of strings. Return an empty object for empty input.',
    functionName: "countOccurrences",
    starterCode:
      "function countOccurrences(words) {\n  // Count every string, including special object-property names.\n  return {};\n}\n",
    referenceSolution:
      "function countOccurrences(words) {\n  const counts = new Map();\n  for (const word of words) {\n    counts.set(word, (counts.get(word) || 0) + 1);\n  }\n  return Object.fromEntries(counts);\n}\n",
    hints: [
      "A plain object inherits property names such as constructor. Use a Map, or an object created with Object.create(null), so those names cannot interfere.",
      "Read the current count (or use 0), add 1, and store it. Object.fromEntries(map) turns a Map into an object with safe own properties.",
    ],
    tests: [
      {
        label: "Repeated words",
        args: [["code", "learn", "code"]],
        expected: {
          code: 2,
          learn: 1,
        },
      },
      {
        label: "Case-sensitive keys",
        args: [["JS", "js", "JS"]],
        expected: {
          JS: 2,
          js: 1,
        },
      },
      {
        label: "Empty string is a key",
        args: [["", "code", ""]],
        expected: {
          "": 2,
          code: 1,
        },
      },
      {
        label: "Special property names",
        args: [["__proto__", "constructor", "__proto__"]],
        expected: {
          ["__proto__"]: 2,
          constructor: 1,
        },
      },
      {
        label: "Empty array",
        args: [[]],
        expected: {},
      },
    ],
  },
  {
    id: "flatten-once",
    title: "Flatten one level",
    category: "Arrays",
    difficulty: "Starter",
    concept: "Nested arrays · flat",
    description:
      "Complete flattenOnce(items). Return a new array with exactly one level of nested arrays flattened. Preserve order and leave deeper arrays nested. Inputs may contain finite numbers, strings, null, and nested arrays; do not change the input. Empty nested arrays contribute no items.",
    functionName: "flattenOnce",
    starterCode:
      "function flattenOnce(items) {\n  // Flatten exactly one level, preserving deeper nesting.\n  return [];\n}\n",
    referenceSolution:
      "function flattenOnce(items) {\n  return items.flat(1);\n}\n",
    hints: [
      "Visit each item. If it is an array, append its members; otherwise append the item itself.",
      "Array.prototype.flat(1) performs exactly one flattening pass. Do not use Infinity, because deeper arrays must remain nested.",
    ],
    tests: [
      {
        label: "One nested level",
        args: [[[1, 2], [3], 4]],
        expected: [1, 2, 3, 4],
      },
      {
        label: "Deeper arrays remain",
        args: [[[1, [2]], 3]],
        expected: [1, [2], 3],
      },
      {
        label: "Empty nested arrays",
        args: [[[], [1], []]],
        expected: [1],
      },
      {
        label: "Mixed scalar values",
        args: [[null, ["a", "b"], 2]],
        expected: [null, "a", "b", 2],
      },
      {
        label: "Empty input",
        args: [[]],
        expected: [],
      },
    ],
  },
  {
    id: "chunk-array",
    title: "Split an array into batches",
    category: "Arrays",
    difficulty: "Intermediate",
    concept: "Loops · slices",
    description:
      "Complete chunkArray(items, size). Split an array into consecutive non-overlapping arrays containing at most size items. The final chunk may be shorter. size is always a positive integer. Preserve order, return new chunk arrays, and do not change the input. Empty input produces an empty array.",
    functionName: "chunkArray",
    starterCode:
      "function chunkArray(items, size) {\n  // Collect a new slice for every batch of size items.\n  return [];\n}\n",
    referenceSolution:
      "function chunkArray(items, size) {\n  const chunks = [];\n  for (let index = 0; index < items.length; index += size) {\n    chunks.push(items.slice(index, index + size));\n  }\n  return chunks;\n}\n",
    hints: [
      "Start at index 0 and advance by size each time. Each starting index identifies one batch.",
      "slice(index, index + size) returns a new batch and safely stops at the end of the array. Collect each slice and return the collection.",
    ],
    tests: [
      {
        label: "Short final batch",
        args: [[1, 2, 3, 4, 5], 2],
        expected: [[1, 2], [3, 4], [5]],
      },
      {
        label: "Exact batches",
        args: [[1, 2, 3, 4], 2],
        expected: [
          [1, 2],
          [3, 4],
        ],
      },
      {
        label: "Size larger than array",
        args: [["a", "b"], 5],
        expected: [["a", "b"]],
      },
      {
        label: "Size one",
        args: [[1, 2], 1],
        expected: [[1], [2]],
      },
      {
        label: "Empty array",
        args: [[], 3],
        expected: [],
      },
    ],
  },
  {
    id: "average-numbers",
    title: "Calculate an average",
    category: "Numbers",
    difficulty: "Starter",
    concept: "Reduction · arithmetic",
    description:
      "Complete averageNumbers(numbers). Return the arithmetic mean of a finite-number array: sum divided by length. Return 0 for an empty array. Negative values are allowed. Do not round the answer or change the input; the provided cases have exactly representable results.",
    functionName: "averageNumbers",
    starterCode:
      "function averageNumbers(numbers) {\n  // Divide the total by the count; handle empty input first.\n  return 0;\n}\n",
    referenceSolution:
      "function averageNumbers(numbers) {\n  if (numbers.length === 0) return 0;\n  return numbers.reduce((sum, number) => sum + number, 0) / numbers.length;\n}\n",
    hints: [
      "Check the length before dividing, so empty input does not produce NaN.",
      "Use reduce() or a loop to calculate the total, then divide by the number of items.",
    ],
    tests: [
      {
        label: "Positive values",
        args: [[2, 4, 6]],
        expected: 4,
      },
      {
        label: "Mixed signs",
        args: [[-4, 0, 4]],
        expected: 0,
      },
      {
        label: "Fractional result",
        args: [[1, 2]],
        expected: 1.5,
      },
      {
        label: "Single value",
        args: [[-7]],
        expected: -7,
      },
      {
        label: "Empty array",
        args: [[]],
        expected: 0,
      },
    ],
  },
  {
    id: "palindrome",
    title: "Recognize a palindrome",
    category: "Strings",
    difficulty: "Intermediate",
    concept: "Normalization · comparison",
    description:
      "Complete isPalindrome(text). Keep only ASCII letters A–Z/a–z and digits 0–9, then compare without regard to letter case. Return true when that normalized sequence reads the same forward and backward. A sequence that becomes empty counts as a palindrome. Inputs are ASCII strings.",
    functionName: "isPalindrome",
    starterCode:
      "function isPalindrome(text) {\n  // Ignore punctuation, whitespace, and letter case.\n  return false;\n}\n",
    referenceSolution:
      'function isPalindrome(text) {\n  const clean = text.toLowerCase().replace(/[^a-z0-9]/g, "");\n  return clean === clean.split("").reverse().join("");\n}\n',
    hints: [
      "Lowercase the input and remove every character that is not an ASCII letter or digit.",
      "Build a reversed copy of the cleaned string and compare the two. An empty string equals its reverse.",
    ],
    tests: [
      {
        label: "Phrase with punctuation",
        args: ["A man, a plan, a canal: Panama!"],
        expected: true,
      },
      {
        label: "Non-palindrome",
        args: ["developer"],
        expected: false,
      },
      {
        label: "Digits matter",
        args: ["12,321"],
        expected: true,
      },
      {
        label: "Different digit sequence",
        args: ["12,341"],
        expected: false,
      },
      {
        label: "Nothing left after cleaning",
        args: [" !!! "],
        expected: true,
      },
    ],
  },
  {
    id: "factorial",
    title: "Multiply a factorial",
    category: "Numbers",
    difficulty: "Starter",
    concept: "Loops · multiplication",
    description:
      "Complete factorial(n). Return the product of the integers from 1 through n. By definition, factorial(0) is 1. n is always an integer from 0 through 12, so the result is exactly representable as a JavaScript number.",
    functionName: "factorial",
    starterCode:
      "function factorial(n) {\n  // Multiply the integers from 1 through n.\n  return 1;\n}\n",
    referenceSolution:
      "function factorial(n) {\n  let product = 1;\n  for (let value = 2; value <= n; value += 1) {\n    product *= value;\n  }\n  return product;\n}\n",
    hints: [
      "Use 1 as your starting product, not 0. Multiplication by 0 would erase every later result.",
      "Multiply by each integer from 2 through n. If n is 0 or 1, the loop runs zero times and the starting value is already correct.",
    ],
    tests: [
      {
        label: "Zero factorial",
        args: [0],
        expected: 1,
      },
      {
        label: "One factorial",
        args: [1],
        expected: 1,
      },
      {
        label: "Five factorial",
        args: [5],
        expected: 120,
      },
      {
        label: "Twelve factorial",
        args: [12],
        expected: 479001600,
      },
      {
        label: "Two factorial",
        args: [2],
        expected: 2,
      },
    ],
  },
  {
    id: "fizzbuzz",
    title: "Return a FizzBuzz sequence",
    category: "Algorithms",
    difficulty: "Starter",
    concept: "Conditions · modulo",
    description:
      'Complete fizzBuzz(n). Return an array for integers 1 through n inclusive. Use "FizzBuzz" for multiples of both 3 and 5, "Fizz" for other multiples of 3, and "Buzz" for other multiples of 5. Keep remaining entries as numbers. n is an integer from 0 through 50; n = 0 returns an empty array. Return the array instead of printing it.',
    functionName: "fizzBuzz",
    starterCode:
      "function fizzBuzz(n) {\n  // Return the sequence; check shared multiples first.\n  return [];\n}\n",
    referenceSolution:
      'function fizzBuzz(n) {\n  const result = [];\n  for (let value = 1; value <= n; value += 1) {\n    if (value % 15 === 0) result.push("FizzBuzz");\n    else if (value % 3 === 0) result.push("Fizz");\n    else if (value % 5 === 0) result.push("Buzz");\n    else result.push(value);\n  }\n  return result;\n}\n',
    hints: [
      "Use the remainder operator (%) to recognize multiples. A multiple of both 3 and 5 is a multiple of 15.",
      "Check the combined case before the individual cases. Push the matching string or number into your result for each value from 1 through n.",
    ],
    tests: [
      {
        label: "First five entries",
        args: [5],
        expected: [1, 2, "Fizz", 4, "Buzz"],
      },
      {
        label: "Combined multiple",
        args: [15],
        expected: [
          1,
          2,
          "Fizz",
          4,
          "Buzz",
          "Fizz",
          7,
          8,
          "Fizz",
          "Buzz",
          11,
          "Fizz",
          13,
          14,
          "FizzBuzz",
        ],
      },
      {
        label: "Zero entries",
        args: [0],
        expected: [],
      },
      {
        label: "Single entry",
        args: [1],
        expected: [1],
      },
      {
        label: "Six entries",
        args: [6],
        expected: [1, 2, "Fizz", 4, "Buzz", "Fizz"],
      },
    ],
  },
  {
    id: "group-even-odd",
    title: "Separate even and odd values",
    category: "Arrays",
    difficulty: "Starter",
    concept: "Modulo · object results",
    description:
      "Complete groupEvenOdd(numbers). Return an object with even and odd arrays. Place every integer into the appropriate array, keeping its original order and duplicates. Zero and negative even integers belong in even. The input is an array of integers; do not change it. Include both properties even when their arrays are empty.",
    functionName: "groupEvenOdd",
    starterCode:
      "function groupEvenOdd(numbers) {\n  // Return { even: [...], odd: [...] } in input order.\n  return { even: [], odd: [] };\n}\n",
    referenceSolution:
      "function groupEvenOdd(numbers) {\n  const groups = { even: [], odd: [] };\n  for (const number of numbers) {\n    if (number % 2 === 0) groups.even.push(number);\n    else groups.odd.push(number);\n  }\n  return groups;\n}\n",
    hints: [
      "Create an object containing two empty arrays. A number is even when number % 2 === 0.",
      "Append each input to one of those arrays as you visit it. Use an else for odd numbers so negative odd remainders are handled too.",
    ],
    tests: [
      {
        label: "Mixed values",
        args: [[1, 2, 3, 4]],
        expected: {
          even: [2, 4],
          odd: [1, 3],
        },
      },
      {
        label: "Negative values and zero",
        args: [[-3, -2, 0, 1]],
        expected: {
          even: [-2, 0],
          odd: [-3, 1],
        },
      },
      {
        label: "Preserve duplicates",
        args: [[2, 2, 1, 1]],
        expected: {
          even: [2, 2],
          odd: [1, 1],
        },
      },
      {
        label: "Only odd values",
        args: [[5, 7]],
        expected: {
          even: [],
          odd: [5, 7],
        },
      },
      {
        label: "Empty input",
        args: [[]],
        expected: {
          even: [],
          odd: [],
        },
      },
    ],
  },
  {
    id: "longest-word",
    title: "Find the longest word",
    category: "Strings",
    difficulty: "Starter",
    concept: "String scanning · stable ties",
    description:
      "Complete longestWord(text). Split a trimmed string on whitespace and return the longest word. If several words have the same length, return the first one. Preserve original letter case. Inputs contain only ASCII letters and whitespace; return an empty string for empty or whitespace-only input.",
    functionName: "longestWord",
    starterCode:
      'function longestWord(text) {\n  // Keep the first word when lengths are equal.\n  return "";\n}\n',
    referenceSolution:
      'function longestWord(text) {\n  const clean = text.trim();\n  if (clean === "") return "";\n  let longest = "";\n  for (const word of clean.split(/\\s+/)) {\n    if (word.length > longest.length) longest = word;\n  }\n  return longest;\n}\n',
    hints: [
      "Trim first and handle the empty case. Keep a saved longest word as you visit each word.",
      "Replace your saved word only when a new word is strictly longer. Using >= would incorrectly replace the first word in a tie.",
    ],
    tests: [
      {
        label: "A clear winner",
        args: ["learn JavaScript daily"],
        expected: "JavaScript",
      },
      {
        label: "First tied word wins",
        args: ["cat dog owl"],
        expected: "cat",
      },
      {
        label: "Whitespace and original case",
        args: ["  Small\tBIGGER\nend "],
        expected: "BIGGER",
      },
      {
        label: "Whitespace only",
        args: [" \t\n "],
        expected: "",
      },
      {
        label: "Single word",
        args: ["developer"],
        expected: "developer",
      },
    ],
  },
  {
    id: "sum-object-values",
    title: "Total numeric object values",
    category: "Objects",
    difficulty: "Intermediate",
    concept: "Object values · type guards",
    description:
      "Complete sumNumericValues(record). Sum only own enumerable values whose type is number and which are finite. Ignore strings, booleans, null, arrays, and nested objects rather than converting them. Inputs are plain JSON-compatible objects with finite numeric values. Return 0 when no qualifying values exist. Do not change the object.",
    functionName: "sumNumericValues",
    starterCode:
      "function sumNumericValues(record) {\n  // Add finite number values without coercing other types.\n  return 0;\n}\n",
    referenceSolution:
      'function sumNumericValues(record) {\n  return Object.values(record).reduce((total, value) => {\n    return typeof value === "number" && Number.isFinite(value)\n      ? total + value\n      : total;\n  }, 0);\n}\n',
    hints: [
      "Object.values(record) gives you the object’s own enumerable values. Do not recursively inspect nested objects.",
      'Check typeof value === "number" and Number.isFinite(value) before adding. Start the total at 0.',
    ],
    tests: [
      {
        label: "Numeric values",
        args: [
          {
            one: 2,
            two: 4,
            three: 6,
          },
        ],
        expected: 12,
      },
      {
        label: "Ignore number-like strings",
        args: [
          {
            count: 5,
            label: "10",
            enabled: true,
            empty: null,
          },
        ],
        expected: 5,
      },
      {
        label: "Ignore nested values",
        args: [
          {
            nested: {
              count: 8,
            },
            list: [1, 2],
            actual: 3,
          },
        ],
        expected: 3,
      },
      {
        label: "Negative and decimal values",
        args: [
          {
            debt: -5,
            credit: 2.5,
          },
        ],
        expected: -2.5,
      },
      {
        label: "Empty object",
        args: [{}],
        expected: 0,
      },
    ],
  },
  {
    id: "zip-arrays",
    title: "Pair two arrays",
    category: "Arrays",
    difficulty: "Starter",
    concept: "Indexes · array construction",
    description:
      "Complete zipArrays(left, right). Return a new array of two-item arrays pairing values with the same index. Stop when the shorter input ends, ignoring unmatched items. Inputs contain JSON-compatible values. Preserve order and do not change either array. If either input is empty, return an empty array.",
    functionName: "zipArrays",
    starterCode:
      "function zipArrays(left, right) {\n  // Pair matching indexes, stopping at the shorter length.\n  return [];\n}\n",
    referenceSolution:
      "function zipArrays(left, right) {\n  const pairs = [];\n  const length = Math.min(left.length, right.length);\n  for (let index = 0; index < length; index += 1) {\n    pairs.push([left[index], right[index]]);\n  }\n  return pairs;\n}\n",
    hints: [
      "Your loop should stop at Math.min(left.length, right.length), so no pair contains an unmatched undefined value.",
      "For each index, append [left[index], right[index]] as a new two-item array.",
    ],
    tests: [
      {
        label: "Matching lengths",
        args: [
          [1, 2],
          ["a", "b"],
        ],
        expected: [
          [1, "a"],
          [2, "b"],
        ],
      },
      {
        label: "Left input is shorter",
        args: [[1], ["a", "b"]],
        expected: [[1, "a"]],
      },
      {
        label: "Right input is shorter",
        args: [[1, 2, 3], ["x"]],
        expected: [[1, "x"]],
      },
      {
        label: "Empty input",
        args: [[], ["a"]],
        expected: [],
      },
      {
        label: "Mixed JSON values",
        args: [
          [null, true],
          [
            {
              id: 1,
            },
            ["x"],
          ],
        ],
        expected: [
          [
            null,
            {
              id: 1,
            },
          ],
          [true, ["x"]],
        ],
      },
    ],
  },
  {
    id: "password-rules",
    title: "Check a password policy",
    category: "Strings",
    difficulty: "Intermediate",
    concept: "Validation · regular expressions",
    description:
      "Complete meetsPasswordRules(password). Return true only when an ASCII string has at least 8 characters, at least one lowercase letter a–z, at least one uppercase letter A–Z, at least one digit 0–9, and no whitespace of any kind. Symbols are allowed but not required. This is a practice validator, not a complete security policy or password-strength estimator.",
    functionName: "meetsPasswordRules",
    starterCode:
      "function meetsPasswordRules(password) {\n  // Check every rule. Do not trim away invalid whitespace.\n  return false;\n}\n",
    referenceSolution:
      "function meetsPasswordRules(password) {\n  return password.length >= 8\n    && /[a-z]/.test(password)\n    && /[A-Z]/.test(password)\n    && /[0-9]/.test(password)\n    && !/\\s/.test(password);\n}\n",
    hints: [
      "Each requirement needs its own true/false check. Combine the checks with && so every rule must pass.",
      "Use /[a-z]/, /[A-Z]/, and /[0-9]/ to find required characters. Reject /\\s/ anywhere; trimming would hide invalid outer whitespace.",
    ],
    tests: [
      {
        label: "Valid password",
        args: ["CodeLab8"],
        expected: true,
      },
      {
        label: "Symbols are optional",
        args: ["CodeLab8!"],
        expected: true,
      },
      {
        label: "Too short",
        args: ["Abc123"],
        expected: false,
      },
      {
        label: "Missing uppercase",
        args: ["codelab88"],
        expected: false,
      },
      {
        label: "Missing lowercase",
        args: ["CODELAB88"],
        expected: false,
      },
      {
        label: "Missing digit",
        args: ["CodeLabs"],
        expected: false,
      },
      {
        label: "Inner whitespace",
        args: ["Code Lab8"],
        expected: false,
      },
      {
        label: "Outer whitespace",
        args: [" CodeLab8"],
        expected: false,
      },
      {
        label: "Tab is whitespace",
        args: ["Code\tLab8"],
        expected: false,
      },
    ],
  },
  {
    id: "binary-search",
    title: "Search a sorted array",
    category: "Algorithms",
    difficulty: "Intermediate",
    concept: "Binary search · boundary updates",
    description:
      "Complete binarySearch(numbers, target). Return the index of target in a strictly increasing array of unique finite numbers, or -1 when it is absent. The input is already sorted ascending. Use binary search by narrowing the search bounds rather than scanning every element. Do not change the array. Empty input returns -1.",
    functionName: "binarySearch",
    starterCode:
      "function binarySearch(numbers, target) {\n  // Narrow the inclusive search interval around its midpoint.\n  return -1;\n}\n",
    referenceSolution:
      "function binarySearch(numbers, target) {\n  let left = 0;\n  let right = numbers.length - 1;\n  while (left <= right) {\n    const middle = Math.floor((left + right) / 2);\n    if (numbers[middle] === target) return middle;\n    if (numbers[middle] < target) left = middle + 1;\n    else right = middle - 1;\n  }\n  return -1;\n}\n",
    hints: [
      "Keep inclusive left and right indexes. Inspect Math.floor((left + right) / 2) and compare its value to the target.",
      "If the midpoint value is too small, move left to middle + 1; otherwise move right to middle - 1. The +1/-1 step ensures the interval shrinks and prevents an infinite loop.",
    ],
    tests: [
      {
        label: "Middle target",
        args: [[1, 3, 5, 7, 9], 5],
        expected: 2,
      },
      {
        label: "First element",
        args: [[-4, 0, 3, 8], -4],
        expected: 0,
      },
      {
        label: "Last element",
        args: [[2, 4, 6, 8], 8],
        expected: 3,
      },
      {
        label: "Absent between elements",
        args: [[1, 3, 5, 7], 4],
        expected: -1,
      },
      {
        label: "Empty array",
        args: [[], 10],
        expected: -1,
      },
      {
        label: "Single matching value",
        args: [[5], 5],
        expected: 0,
      },
      {
        label: "Outside the range",
        args: [[1, 2, 3], 9],
        expected: -1,
      },
    ],
  },
];

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type Lesson = {
  id: string;
  number: number;
  title: string;
  summary: string;
  duration: number;
  category: string;
  sections: {
    heading: string;
    paragraphs: string[];
    example?: string;
    snippet?: { language: string; code: string };
  }[];
  takeaway: string;
  quiz: QuizQuestion[];
};

export const courseTitle = "AI foundations";

export const lessons: Lesson[] = [
  {
    id: "what-is-ai",
    number: 1,
    title: "What is AI?",
    summary:
      "Understand what artificial intelligence can do, and where its limits begin.",
    duration: 4,
    category: "Foundations",
    sections: [
      {
        heading: "A useful starting point",
        paragraphs: [
          "Artificial intelligence is a broad field concerned with building computer systems that perform tasks such as recognizing patterns, understanding language, planning, and making predictions. AI is a collection of approaches, rather than one single invention.",
          "Some systems follow rules written by people. Others learn patterns from examples. A system can be impressive at a specific task without understanding the world in the way a person does.",
        ],
      },
      {
        heading: "Prediction and generation",
        paragraphs: [
          "A predictive system estimates an outcome, such as whether an email is spam. A generative system produces new content, such as text, images, or audio, using patterns learned during training.",
          "A language model generates text by repeatedly predicting likely next pieces of text in context. Fluent writing can be useful, but fluency does not guarantee that a statement is true.",
        ],
        example:
          "An email filter predicts whether a message belongs in spam. An AI writing assistant generates a draft reply. Both use AI, but their jobs and the ways you evaluate them differ.",
      },
      {
        heading: "Keep the task in focus",
        paragraphs: [
          "Ask what a tool is designed to do, what information it receives, and how you will check its result. A clear task is more useful than assuming that an AI tool is good at everything.",
          "For an important answer, verify facts with reliable sources. Keep human judgment involved when a mistake could affect someone’s health, finances, safety, or rights.",
        ],
      },
    ],
    takeaway:
      "AI systems can recognize, predict, and generate patterns. Their outputs still need an appropriate check.",
    quiz: [
      {
        id: "what-is-ai-1",
        question: "Which task is an example of generative AI?",
        options: [
          "Sorting existing emails by date",
          "Writing a new draft of a welcome email",
          "Adding two numbers with a calculator",
          "Opening a saved document",
        ],
        correctIndex: 1,
        explanation:
          "Generative AI produces new content. Drafting a new email is a generation task; sorting or opening existing material is not.",
      },
      {
        id: "what-is-ai-2",
        question:
          "An AI assistant gives a confident answer to an important factual question. What should you do?",
        options: [
          "Assume confidence proves accuracy",
          "Ask it to repeat the answer and accept it if the wording matches",
          "Check the claim against reliable sources",
          "Trust it only if the answer is long",
        ],
        correctIndex: 2,
        explanation:
          "Confident, fluent language can still contain mistakes. Independent verification provides better evidence than tone or repetition.",
      },
    ],
  },
  {
    id: "learning-from-data",
    number: 2,
    title: "Learning from data",
    summary:
      "Explore examples, labels, and the difference between learning and memorizing.",
    duration: 5,
    category: "Data",
    sections: [
      {
        heading: "Examples teach a pattern",
        paragraphs: [
          "Machine learning builds a model by finding patterns in data. In supervised learning, each training example includes an input and a target, often called a label. A house-price model might learn from descriptions of houses paired with their sale prices.",
          "A feature is a piece of information the model can use, such as floor area or number of bedrooms. The learning process adjusts the model so its predictions better match the training examples.",
        ],
        example:
          "To teach a model to recognize spam, you could provide messages labeled ‘spam’ or ‘not spam’. The labels describe the result you want the model to predict for a new message.",
      },
      {
        heading: "Check on unfamiliar examples",
        paragraphs: [
          "A model that remembers the training data may fail on new examples. This is called overfitting. The goal is generalization: useful performance on data the model has not already learned from.",
          "Separate training data from evaluation data. Use a validation set to guide model choices, and reserve a test set for a final assessment. Letting evaluation information influence training can make results look better than they really are.",
        ],
      },
      {
        heading: "Better data, better questions",
        paragraphs: [
          "Missing examples, incorrect labels, and unrepresentative samples can all cause problems. A model trained only on daytime photos may struggle with photos taken at night.",
          "Consider whose experiences the data represents and which situations are missing. More data is not automatically better if it repeats errors or excludes the people who will use the system.",
        ],
      },
    ],
    takeaway:
      "A useful model should perform well on new, representative examples, not just the examples used to train it.",
    quiz: [
      {
        id: "learning-from-data-1",
        question:
          "Why should a model be evaluated on examples it did not train on?",
        options: [
          "To check whether it can generalize to new cases",
          "To make sure it memorized every training example",
          "To avoid needing labels during training",
          "To guarantee that every future prediction is correct",
        ],
        correctIndex: 0,
        explanation:
          "Unseen examples help reveal whether the model learned patterns that transfer to new cases. They do not guarantee perfect future performance.",
      },
      {
        id: "learning-from-data-2",
        question:
          "A photo model works well in daylight but poorly at night. What is a useful first investigation?",
        options: [
          "Make the model’s name more descriptive",
          "Evaluate only the daytime examples",
          "Assume night photos cannot be classified",
          "Check whether the training data includes representative night photos",
        ],
        correctIndex: 3,
        explanation:
          "The training data may not represent the situations in which the model is used. Examining that gap is a useful first step.",
      },
    ],
  },
  {
    id: "inside-neural-networks",
    number: 3,
    title: "Inside neural networks",
    summary:
      "Meet the layers, weights, and feedback behind many modern AI tools.",
    duration: 6,
    category: "Models",
    sections: [
      {
        heading: "Layers of small calculations",
        paragraphs: [
          "A neural network is a model made of connected layers of mathematical operations. Each layer transforms its input into a new representation. The network’s adjustable numbers are called parameters; many of them are weights that control the strength of connections.",
          "The name was inspired by simplified ideas about biological neurons. A neural network is not a tiny human brain, and the name does not mean that it has feelings or consciousness.",
        ],
      },
      {
        heading: "Learning through feedback",
        paragraphs: [
          "During training, the network makes predictions and a loss function measures how far those predictions are from the desired results. An optimization method adjusts parameters to reduce that loss across training examples.",
          "The process repeats many times. An algorithm called backpropagation efficiently computes how parameter changes affect the loss. Lower training loss is useful, but evaluation on new data is still needed.",
        ],
        example:
          "For a handwritten-digit model, an image is the input and a digit is the target. If the model predicts ‘3’ for an image labeled ‘8’, training feedback helps adjust its parameters toward better predictions.",
      },
      {
        heading: "Training versus using a model",
        paragraphs: [
          "Training changes the model’s parameters. Inference means using a trained model to produce an output from a new input. Sending a prompt to an assistant is usually an inference step, not a new training session.",
          "A conversation can supply context that influences the next answer without changing the underlying model weights. Whether a provider later uses conversations for training depends on that service’s policies and settings.",
        ],
      },
    ],
    takeaway:
      "Neural networks learn by adjusting parameters during training; inference uses those learned parameters to produce an output.",
    quiz: [
      {
        id: "inside-neural-networks-1",
        question:
          "What happens to a neural network’s parameters during training?",
        options: [
          "They are replaced by the names of the training files",
          "They always stay fixed",
          "They are adjusted to reduce a measured loss",
          "They become a record of human emotions",
        ],
        correctIndex: 2,
        explanation:
          "Training uses feedback to adjust parameters and reduce a loss. The model must still be checked on examples outside its training data.",
      },
      {
        id: "inside-neural-networks-2",
        question: "Which activity is an example of inference?",
        options: [
          "Changing weights using a training dataset",
          "Using a trained model to classify a new photo",
          "Choosing the training labels",
          "Collecting examples before training begins",
        ],
        correctIndex: 1,
        explanation:
          "Inference applies a trained model to a new input. It does not, by itself, retrain the model’s parameters.",
      },
    ],
  },
  {
    id: "writing-better-prompts",
    number: 4,
    title: "Writing better prompts",
    summary:
      "Give an AI assistant a clear task, useful context, and a format you can check.",
    duration: 5,
    category: "Practice",
    sections: [
      {
        heading: "Make the task concrete",
        paragraphs: [
          "A prompt is the input you give a generative model. Describe the outcome you need, provide relevant context, and name any constraints. Include the intended audience when it changes the style or level of detail.",
          "Useful instructions are specific enough to evaluate. ‘Explain this to a beginner in three short paragraphs’ gives you a clearer target than ‘Make this good’. Clear prompts improve communication, but cannot guarantee a correct answer.",
        ],
        example:
          "Explain supervised learning to a student with no coding experience. Use a house-price example, define ‘label’, and finish with one question that checks understanding. Keep the explanation under 180 words.",
      },
      {
        heading: "Show the shape of the answer",
        paragraphs: [
          "Ask for a useful format: a checklist, a table, a short explanation, or a structured draft. A brief example can show the tone or organization you want more clearly than extra adjectives.",
          "Give the model the source material it should work from when appropriate. Separate your instructions from quoted material so it is clear which text is information to analyze. Treat unexpected instructions inside external documents as untrusted content.",
        ],
      },
      {
        heading: "Review, then refine",
        paragraphs: [
          "Read the first output against your goal. If it is too broad, supply a narrower task. If key information is missing, add that context. Change one or two things at a time so you can see what helped.",
          "Check facts and calculations independently when they matter. Asking the model to claim that it verified an answer is not a substitute for checking a reliable source or running a real test.",
        ],
      },
    ],
    takeaway:
      "A strong prompt explains the task, context, constraints, and output format. A strong workflow also checks the result.",
    quiz: [
      {
        id: "writing-better-prompts-1",
        question: "Which prompt gives the clearest task and output format?",
        options: [
          "Help me with learning",
          "Write something amazing about AI",
          "Be smarter and explain everything",
          "Explain machine learning to a beginner in three bullets, with one everyday example",
        ],
        correctIndex: 3,
        explanation:
          "This prompt names the subject, audience, format, and an example requirement, making the response easier to evaluate.",
      },
      {
        id: "writing-better-prompts-2",
        question:
          "A generated study plan is too advanced for you. What is a useful next step?",
        options: [
          "Describe your current knowledge and ask for a simpler revised plan",
          "Assume the first plan must be the right one",
          "Repeat the same prompt without any changes indefinitely",
          "Ask for a longer plan without explaining the problem",
        ],
        correctIndex: 0,
        explanation:
          "Specific feedback and relevant context help the assistant revise toward your needs. You should still review the new plan.",
      },
    ],
  },
  {
    id: "using-ai-responsibly",
    number: 5,
    title: "Using AI responsibly",
    summary:
      "Build habits that protect privacy, account for bias, and keep people involved.",
    duration: 5,
    category: "Responsibility",
    sections: [
      {
        heading: "Pause before sharing data",
        paragraphs: [
          "Before uploading information to an AI service, consider whether you have permission to share it and whether the service is approved for that use. Read its data policies and your organization’s rules when they apply.",
          "Avoid sharing passwords, API keys, private customer details, confidential work, or sensitive personal records. Removing a name may not fully anonymize a document if other details can identify a person.",
        ],
        example:
          "To practice summarizing customer feedback, write a few fictional comments. Do not upload a real customer list or private support conversation to an unapproved service.",
      },
      {
        heading: "Look for uneven results",
        paragraphs: [
          "AI systems can reflect biases in their training data, design, or use. A result that sounds neutral may still treat some groups unfairly or overlook their needs.",
          "Ask who might be affected, test relevant cases, and look for differences in errors. A high average score can hide poor performance for a smaller group. Fixing unfairness requires understanding the context, not just removing one word.",
        ],
      },
      {
        heading: "Match oversight to the stakes",
        paragraphs: [
          "Brainstorming a fictional story and recommending a medical treatment have very different consequences. Use stronger checks, qualified review, and approved systems as the stakes increase.",
          "Be transparent about AI assistance when it matters to the audience or is required. Keep responsibility with people who can evaluate the outcome, correct errors, and explain decisions.",
        ],
      },
    ],
    takeaway:
      "Protect sensitive information, examine who may be affected, and use oversight that matches the consequences of a mistake.",
    quiz: [
      {
        id: "using-ai-responsibly-1",
        question:
          "What is a safer way to practice an AI customer-feedback summary?",
        options: [
          "Upload a private customer database to any available tool",
          "Use fictional feedback that contains no real customer information",
          "Include passwords so the model has more context",
          "Remove names but ignore all other identifying information",
        ],
        correctIndex: 1,
        explanation:
          "Fictional examples let you practice without disclosing customer information. Even documents with names removed can contain identifying details.",
      },
      {
        id: "using-ai-responsibly-2",
        question:
          "Why can a strong overall accuracy score be insufficient when evaluating an AI system?",
        options: [
          "Accuracy never provides any useful information",
          "It proves the model has no bias",
          "It can hide worse performance for particular groups or situations",
          "It means human review is no longer needed",
        ],
        correctIndex: 2,
        explanation:
          "Average performance can conceal uneven errors. Evaluation should consider relevant groups, contexts, and the consequences of those errors.",
      },
    ],
  },
  {
    id: "your-first-ai-workflow",
    number: 6,
    title: "Your first AI workflow",
    summary:
      "Bring your skills together with a small, practical study-planning project.",
    duration: 7,
    category: "Project",
    sections: [
      {
        heading: "Choose a small, useful outcome",
        paragraphs: [
          "A workflow is a repeatable sequence of steps that turns an input into a useful result. Start with a low-stakes task you understand well enough to evaluate, such as creating a personal study plan from a short list of topics.",
          "Define success before you generate anything. Your plan might need three 20-minute sessions, beginner-friendly activities, and a quick review at the end of each session. Clear criteria make evaluation practical.",
        ],
      },
      {
        heading: "Draft with clear instructions",
        paragraphs: [
          "Collect the information you actually need: your current knowledge, available time, and learning goal. Remove sensitive details. Ask an approved AI tool for a first draft using these constraints.",
          "You can practice this exercise by writing and reviewing a draft yourself if you do not have access to an AI tool. This course does not send your text to an external AI service.",
        ],
        example:
          "Create a three-day beginner study plan for understanding AI. I have 20 minutes each day and have finished an introductory course. Give each day one goal, one activity, and one self-check question. Use only the topics I list: data, neural networks, and prompts.",
      },
      {
        heading: "Check, improve, and save the process",
        paragraphs: [
          "Check whether the draft fits your time, covers the requested topics, and includes activities you can actually do. Verify unfamiliar claims or suggested resources before relying on them. Revise any step that is unclear or unrealistic.",
          "Save the useful prompt, your checklist, and the final plan. Next time, change the inputs and repeat the same checks. The value comes from a dependable process with human review, rather than a single impressive answer.",
        ],
      },
    ],
    takeaway:
      "Define success, provide safe inputs, draft, verify, and refine. Save the process so you can use it again.",
    quiz: [
      {
        id: "your-first-ai-workflow-1",
        question:
          "What should you do before asking an AI tool to draft a study plan?",
        options: [
          "Define the goal, time limits, and criteria for a useful plan",
          "Accept any output as long as it looks polished",
          "Share as much personal information as possible",
          "Assume you will not need to review the result",
        ],
        correctIndex: 0,
        explanation:
          "Defining success and constraints first helps you write a useful prompt and judge whether the resulting plan meets your needs.",
      },
      {
        id: "your-first-ai-workflow-2",
        question: "Which sequence describes a dependable AI-assisted workflow?",
        options: [
          "Generate, publish immediately, ignore feedback",
          "Collect private data, generate, assume accuracy",
          "Keep changing the task without checking any outputs",
          "Define success, prepare safe inputs, draft, check, and refine",
        ],
        correctIndex: 3,
        explanation:
          "A repeatable workflow combines clear goals and safe inputs with verification and improvement. Human review remains part of the process.",
      },
    ],
  },
];

export const codingLessons: Lesson[] = [
  {
    id: "js-variables-values",
    number: 1,
    title: "Variables & values",
    summary:
      "Give data a name, choose a type, and make your first state change.",
    duration: 5,
    category: "JavaScript basics",
    sections: [
      {
        heading: "Names make a program readable",
        paragraphs: [
          "A variable connects a name to a value. JavaScript values include numbers, strings, booleans, objects, null, and undefined. Use descriptive names such as completedLessons so another developer can understand the idea without guessing.",
          "Declare a variable with const when you do not plan to reassign it. Use let when the binding needs a new value later. Both are scoped to the block in which you declare them.",
        ],
        snippet: {
          language: "javascript",
          code: 'const learner = "Ada";\nlet completedLessons = 0;\ncompletedLessons += 1;\nconsole.log(`${learner} completed ${completedLessons} lesson.`);',
        },
      },
      {
        heading: "Types describe the value",
        paragraphs: [
          'The number 42 and the string "42" are different values. JavaScript determines a value’s type at runtime. The typeof operator helps inspect common primitive types, such as number, string, and boolean.',
          'An unassigned variable has the value undefined. Use null when you intentionally want to represent no value. JavaScript has a historical quirk: typeof null returns "object", even though null is a primitive value.',
        ],
        example:
          "A quiz score can be a number, a display name a string, and an isComplete flag a boolean. Keeping these meanings clear helps prevent accidental calculations on text.",
      },
      {
        heading: "A constant binding can hold a mutable object",
        paragraphs: [
          "const prevents reassignment of the variable itself. It does not freeze an object or array stored in that variable. You may update an object’s properties unless the object is separately protected.",
        ],
        snippet: {
          language: "javascript",
          code: 'const profile = { name: "Ada", level: 1 };\nprofile.level = 2; // Allowed: the object changes.\n// profile = {}; // Not allowed: the binding would change.',
        },
      },
    ],
    takeaway:
      "Start with const, use let when reassignment is necessary, and think about the type and meaning of each value.",
    quiz: [
      {
        id: "js-variables-values-1",
        question:
          "Which declaration fits a score that will be reassigned as a player earns points?",
        options: [
          "let score = 0;",
          "const score = 0;",
          "fixed score = 0;",
          "score const 0;",
        ],
        correctIndex: 0,
        explanation:
          "let allows the binding to receive a new value. const prevents reassignment, and the other two examples are not valid declarations.",
      },
      {
        id: "js-variables-values-2",
        question: "What does const prevent when the value is an object?",
        options: [
          "Reading the object’s properties",
          "Adding any property to the object",
          "Reassigning the variable to a different value",
          "Calling a function with the object",
        ],
        correctIndex: 2,
        explanation:
          "const protects the binding from reassignment. The object’s properties can still change unless additional protections are applied.",
      },
    ],
  },
  {
    id: "js-decisions-comparisons",
    number: 2,
    title: "Decisions & comparisons",
    summary:
      "Turn conditions into useful branches without surprising type conversions.",
    duration: 5,
    category: "Control flow",
    sections: [
      {
        heading: "Choose a path with if",
        paragraphs: [
          "An if statement runs a block when its condition is truthy. Add else for the other path, or else if to check another condition. Boolean expressions such as score >= 80 make these decisions explicit.",
          "Keep the most specific conditions before broader ones. Once a matching branch runs, the remaining branches in the same if/else chain are skipped.",
        ],
        snippet: {
          language: "javascript",
          code: 'const score = 85;\nif (score >= 80) {\n  console.log("Ready for the next challenge");\n} else {\n  console.log("Practice a little more");\n}',
        },
      },
      {
        heading: "Compare deliberately",
        paragraphs: [
          'Strict equality, ===, compares values without converting their types first. For example, 5 === "5" is false. Prefer === and !== when you want a clear comparison, and convert input deliberately when a conversion is needed.',
          "Use && for conditions that must both hold, || when either can hold, and ! to negate a value’s truthiness. Parentheses help make a complex condition easier to read.",
        ],
        example:
          "A lesson is ready to unlock when the previous lesson is complete AND the learner has access. That condition can be written as previousComplete && hasAccess.",
      },
      {
        heading: "Watch for falsy values",
        paragraphs: [
          "false, 0, an empty string, null, undefined, and NaN are falsy. Objects and arrays are truthy, including empty arrays. A fallback written with || replaces every falsy value, which may incorrectly replace a valid zero.",
          "The nullish coalescing operator, ??, uses its fallback only for null or undefined. Choose the operator that matches the meaning of your data.",
        ],
        snippet: {
          language: "javascript",
          code: "const points = 0;\nconsole.log(points || 10); // 10: zero is falsy.\nconsole.log(points ?? 10); // 0: zero is not nullish.",
        },
      },
    ],
    takeaway:
      "Write explicit conditions, prefer strict equality, and distinguish a missing value from a valid falsy value.",
    quiz: [
      {
        id: "js-decisions-comparisons-1",
        question: 'What is the result of 5 === "5"?',
        options: [
          "true, because the text contains a number",
          "false, because the types differ",
          'The string "true"',
          "A syntax error",
        ],
        correctIndex: 1,
        explanation:
          "Strict equality does not coerce the operands to a common type. A number and a string are not strictly equal.",
      },
      {
        id: "js-decisions-comparisons-2",
        question:
          "Which expression preserves a valid score of 0 and falls back only for null or undefined?",
        options: ["score || 10", "score && 10", "!score", "score ?? 10"],
        correctIndex: 3,
        explanation:
          "?? falls back only for nullish values. || also replaces zero, empty strings, and other falsy values.",
      },
    ],
  },
  {
    id: "js-functions",
    number: 3,
    title: "Functions that do one thing",
    summary:
      "Package a small idea into reusable code with inputs and a clear result.",
    duration: 6,
    category: "Functions",
    sections: [
      {
        heading: "Inputs in, a result out",
        paragraphs: [
          "A function groups instructions under a name. Parameters name its inputs, while arguments are the values supplied when it is called. return sends a value back to the caller and ends the current function call.",
          "Choose a name that explains the job, such as calculateTotal. A small function with one clear responsibility is usually easier to test and reuse than one that also changes the page, saves data, and sends messages.",
        ],
        snippet: {
          language: "javascript",
          code: "function calculateTotal(price, quantity) {\n  return price * quantity;\n}\n\nconst total = calculateTotal(12, 3);\nconsole.log(total); // 36",
        },
      },
      {
        heading: "Logging is not returning",
        paragraphs: [
          "console.log displays information in a console. It does not send your function’s result to its caller. A function without an explicit return value evaluates to undefined when it finishes.",
          "Default parameters can give an input a sensible value when the argument is missing or undefined. A default does not automatically replace null or validate every other possible input.",
        ],
        example:
          "A calculateDiscount function should return a number so the checkout can use it. Printing the number is useful for debugging, but the checkout still needs the returned value.",
      },
      {
        heading: "Arrow functions express the same small idea",
        paragraphs: [
          "An arrow function is another way to write a function. A single expression can be returned implicitly. When you add curly braces for a block body, use return explicitly if you need a result.",
          "Arrow functions handle this differently from regular functions, so they are not interchangeable in every situation. For a simple calculation that does not use this, either style can communicate the same input-to-output relationship.",
        ],
        snippet: {
          language: "javascript",
          code: 'const double = (value) => value * 2;\nconst greet = (name = "developer") => {\n  return `Hello, ${name}!`;\n};\nconsole.log(double(4)); // 8',
        },
      },
    ],
    takeaway:
      "Give a function a clear job, make its inputs explicit, and return the value its caller needs.",
    quiz: [
      {
        id: "js-functions-1",
        question:
          "A function logs 10 but has no return statement. What value does the caller receive?",
        options: ["10", 'The string "10"', "undefined", "true"],
        correctIndex: 2,
        explanation:
          "Logging and returning are separate operations. A function that finishes without returning a value returns undefined.",
      },
      {
        id: "js-functions-2",
        question: "Which arrow function returns the square of its input?",
        options: [
          "const square = (n) => n * n;",
          "const square = (n) => { n * n; };",
          "const square = n * n;",
          "const square = (n) => console.log(n);",
        ],
        correctIndex: 0,
        explanation:
          "An expression-bodied arrow function returns that expression. A block body needs an explicit return to return the calculation.",
      },
    ],
  },
  {
    id: "js-arrays-iteration",
    number: 4,
    title: "Arrays & iteration",
    summary:
      "Transform a collection with map, filter, and a loop you can reason about.",
    duration: 6,
    category: "Collections",
    sections: [
      {
        heading: "Keep related values together",
        paragraphs: [
          "An array stores an ordered collection. Indexes start at zero, so items[0] reads the first value. The length property tells you how many slots the array contains.",
          "A for...of loop visits the values of an iterable such as an array. Use it when you want to perform a sequence of actions, accumulate a result, or stop early with break.",
        ],
        snippet: {
          language: "javascript",
          code: "const scores = [70, 90, 100];\nlet total = 0;\nfor (const score of scores) {\n  total += score;\n}\nconsole.log(total); // 260",
        },
      },
      {
        heading: "Transform with map and select with filter",
        paragraphs: [
          "map calls a function for each present element and builds a new array from its return values. filter builds a new array containing the elements whose callback returns a truthy value. A callback is simply a function passed to another function.",
          "These methods do not change the source array by themselves. Objects inside the array are still shared references, so a callback that changes an object can still mutate that object.",
        ],
        snippet: {
          language: "javascript",
          code: 'const scores = [40, 80, 95];\nconst passing = scores.filter((score) => score >= 60);\nconst labels = passing.map((score) => `${score}%`);\nconsole.log(labels); // ["80%", "95%"]',
        },
        example:
          "Filter a lesson list to the completed lessons, then map those lessons to the titles you want to display.",
      },
      {
        heading: "Know when a method mutates",
        paragraphs: [
          "push, pop, and sort change an existing array. That can be useful, but it may surprise other code holding the same array. Spread syntax creates a shallow copy when you need a new outer array before making changes.",
          "Choose map when each input should produce an output. Choose filter when only some inputs should remain. Choose a loop when the flow needs more control, rather than forcing every problem into one method.",
        ],
      },
    ],
    takeaway:
      "Use map to transform, filter to select, and pay attention to which operations change shared data.",
    quiz: [
      {
        id: "js-arrays-iteration-1",
        question:
          "Which method creates an array containing only values that pass a condition?",
        options: ["push", "map", "pop", "filter"],
        correctIndex: 3,
        explanation:
          "filter keeps the elements whose callback returns a truthy value. map transforms elements, while push and pop mutate the existing array.",
      },
      {
        id: "js-arrays-iteration-2",
        question: "What does [2, 3].map((n) => n * 2) produce?",
        options: ["[2, 3, 2, 3]", "[4, 6]", "10", "[2, 3]"],
        correctIndex: 1,
        explanation:
          "map calls the callback for each element and collects the returned values. Doubling 2 and 3 produces a new array containing 4 and 6.",
      },
    ],
  },
  {
    id: "js-objects-data",
    number: 5,
    title: "Objects & data",
    summary:
      "Model a real thing with properties and update it without losing the original.",
    duration: 6,
    category: "Data modeling",
    sections: [
      {
        heading: "Group facts under property names",
        paragraphs: [
          "An object groups related values as properties. Dot notation reads a known property name, while bracket notation can use a name stored in a variable. Objects help you represent a learner, a lesson, or the result of a challenge.",
          "A missing property normally evaluates to undefined. Optional chaining, ?., lets you access a property safely when the value before it might be null or undefined. It does not validate the data’s structure for you.",
        ],
        snippet: {
          language: "javascript",
          code: 'const lesson = { title: "Objects", minutes: 6 };\nconst key = "title";\nconsole.log(lesson.title); // "Objects"\nconsole.log(lesson[key]); // "Objects"\nconsole.log(lesson.author?.name); // undefined',
        },
      },
      {
        heading: "Extract and copy with care",
        paragraphs: [
          "Destructuring extracts properties into local variables. Object spread copies an object’s own enumerable properties into a new object. Properties written later override earlier properties with the same name.",
          "Spread creates a shallow copy. A nested object is still shared unless you copy that level too. This distinction matters when you update application state or keep a previous version for comparison.",
        ],
        snippet: {
          language: "javascript",
          code: 'const learner = { name: "Ada", completed: 2 };\nconst { name } = learner;\nconst updated = { ...learner, completed: 3 };\nconsole.log(name); // "Ada"\nconsole.log(learner.completed); // 2\nconsole.log(updated.completed); // 3',
        },
        example:
          "To display a learner’s next level without changing their current profile, create a new profile object with the updated level property.",
      },
      {
        heading: "JSON moves data across a boundary",
        paragraphs: [
          "JSON.stringify converts supported data into JSON text, and JSON.parse reads JSON text back into JavaScript values. JSON is useful for a browser storage entry or an HTTP response body.",
          "Not every JavaScript value survives a JSON round trip. Functions and undefined object properties are omitted, for example. Parsing invalid JSON throws an error, and valid JSON still needs validation before you trust its shape.",
        ],
      },
    ],
    takeaway:
      "Use objects to model related facts, treat spread as a shallow copy, and validate data when it crosses a boundary.",
    quiz: [
      {
        id: "js-objects-data-1",
        question:
          "How do you read a property whose name is stored in a variable called key?",
        options: [
          "profile.key always reads that dynamic property",
          "profile(key)",
          "profile[key]",
          "profile::key",
        ],
        correctIndex: 2,
        explanation:
          "Bracket notation evaluates the expression inside the brackets. profile.key reads the literal property named key instead.",
      },
      {
        id: "js-objects-data-2",
        question:
          "What does { ...original } do when original contains a nested object?",
        options: [
          "Deeply clones every nested value",
          "Freezes the original object",
          "Converts all properties to strings",
          "Creates a new outer object while sharing the nested object",
        ],
        correctIndex: 3,
        explanation:
          "Object spread is shallow. Nested object values are copied as references, so changing that nested object can affect both outer objects.",
      },
    ],
  },
  {
    id: "js-async-javascript",
    number: 6,
    title: "Async JavaScript",
    summary:
      "Work with promises, await a result, and handle failure as part of the flow.",
    duration: 7,
    category: "Asynchronous code",
    sections: [
      {
        heading: "A promise represents a future result",
        paragraphs: [
          "Some work, such as a network request, completes later. A promise represents an operation that can be pending, fulfilled with a value, or rejected with a reason. Attach handlers with then and catch, or use async and await to work with its result.",
          "An async function always returns a promise. await pauses that async function until the awaited value settles; it does not pause the entire JavaScript runtime or block the browser from handling other work.",
        ],
        snippet: {
          language: "javascript",
          code: 'async function loadGreeting() {\n  const message = await Promise.resolve("Hello, developer!");\n  return message;\n}\n\nloadGreeting().then((message) => console.log(message));',
        },
      },
      {
        heading: "Treat failure as an expected path",
        paragraphs: [
          "Use try/catch around an awaited operation when you can provide a meaningful recovery, fallback, or message. A rejected promise becomes an exception at its await expression. finally can clean up after success or failure.",
          "fetch rejects for problems such as network failures, but HTTP error statuses such as 404 do not automatically reject it. Check response.ok before treating the response as a successful result.",
        ],
        snippet: {
          language: "javascript",
          code: 'async function loadLessons() {\n  const response = await fetch("/api/lessons");\n  if (!response.ok) {\n    throw new Error(`Request failed: ${response.status}`);\n  }\n  return response.json();\n}',
        },
        example:
          "A lesson screen can show a loading state, replace it with data on success, and show a retry message on failure. The /api/lessons URL in the example represents an endpoint you would need to implement; this starter’s lesson data is local.",
      },
      {
        heading: "Wait together when the work is independent",
        paragraphs: [
          "Awaiting each independent operation before starting the next can waste time. Promise.all starts waiting for a group of promises together and returns their values in input order when all fulfill.",
          "Promise.all rejects if any input promise rejects. It does not cancel the other operations. Choose the error behavior your interface needs, and avoid starting work in parallel when one task depends on another’s result.",
        ],
      },
    ],
    takeaway:
      "Use promises for results that arrive later, handle rejection intentionally, and check HTTP status when working with fetch.",
    quiz: [
      {
        id: "js-async-javascript-1",
        question: "What does an async function return?",
        options: [
          "A promise, even when it returns a plain value",
          "Only undefined",
          "A value that blocks the whole browser",
          "A string containing its source code",
        ],
        correctIndex: 0,
        explanation:
          "An async function always returns a promise. A returned plain value fulfills that promise; a thrown error rejects it.",
      },
      {
        id: "js-async-javascript-2",
        question:
          "fetch receives an HTTP 404 response. What should your code check?",
        options: [
          "Nothing, because fetch rejects for every HTTP error",
          "response.ok or response.status",
          "Whether the response URL contains a dot",
          "Whether the browser has a dark theme",
        ],
        correctIndex: 1,
        explanation:
          "fetch does not reject solely because of an HTTP error status. Inspect response.ok or response.status and handle the error deliberately.",
      },
    ],
  },
];

export type LearningTrack = {
  id: string;
  title: string;
  description: string;
  language: string;
  lessons: Lesson[];
};

export const tracks: LearningTrack[] = [
  {
    id: "javascript",
    title: "JavaScript essentials",
    description:
      "Build a practical foundation in the language of the web, from your first variable to asynchronous code.",
    language: "JAVASCRIPT",
    lessons: codingLessons,
  },
  {
    id: "ai",
    title: "AI foundations",
    description:
      "Understand the ideas behind AI, write better prompts, and build a responsible workflow.",
    language: "AI LITERACY",
    lessons,
  },
];

export const allLessons: Lesson[] = [...codingLessons, ...lessons];

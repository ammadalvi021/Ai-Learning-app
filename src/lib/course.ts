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

export type ProjectFiles = {
  "index.html": string;
  "styles.css": string;
  "script.js": string;
};

export type GuidedProject = {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  checkpoints: {
    id: string;
    title: string;
    instruction: string;
    hint: string;
  }[];
  starterFiles: ProjectFiles;
  referenceFiles: ProjectFiles;
};

const baseStyles = `* { box-sizing: border-box; }
body {
  margin: 0;
  min-height: 100vh;
  padding: 32px 20px;
  background: #0e1118;
  color: #edf2fa;
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.6;
}
main { max-width: 720px; margin: 0 auto; }
a { color: #ffad75; }
button, input, select { font: inherit; }
button { cursor: pointer; }
button:focus-visible, a:focus-visible, input:focus-visible, select:focus-visible {
  outline: 3px solid #94ddff;
  outline-offset: 3px;
}
.eyebrow { color: #ffad75; font-size: 11px; letter-spacing: 2px; }
h1 { font-size: clamp(28px, 6vw, 42px); letter-spacing: -1px; line-height: 1.2; }
h2 { font-size: 22px; font-weight: 500; }
p { color: #aebbd0; }
.card { padding: 24px; border: 1px solid #334157; border-radius: 16px; background: #19202d; }
`;

const portfolioStyles = `${baseStyles}
header { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 48px; }
header strong { color: #ffad75; font-size: 22px; }
nav { display: flex; gap: 18px; }
nav a { color: #c9d6e8; text-decoration: none; font-size: 13px; }
.intro { padding: 36px 28px; border: 1px solid #ffad7545; border-radius: 18px; background: linear-gradient(135deg, #ffad7515, #19202d); }
.intro h1 { margin: 14px 0 20px; }
.intro p { max-width: 500px; }
section { margin: 40px 0; scroll-margin-top: 20px; }
.project-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
.project-card { border: 1px solid #334157; background: #19202d; border-radius: 12px; padding: 20px; }
.project-card > span { font-size: 24px; color: #ffad75; }
.project-card h3 { font-size: 15px; }
.project-card p { font-size: 12px; }
footer { color: #8d9db4; font-size: 12px; border-top: 1px solid #334157; margin-top: 40px; padding-top: 18px; }
@media (max-width: 560px) { .project-grid { grid-template-columns: 1fr; } header { margin-bottom: 28px; } .intro { padding: 25px 20px; } }
`;

const portfolioReference: ProjectFiles = {
  "index.html": `<main>
  <header>
    <strong>SR.</strong>
    <nav aria-label="Portfolio navigation">
      <a href="#projects">Projects</a>
      <a href="#about">About</a>
    </nav>
  </header>
  <section class="intro" aria-labelledby="intro-title">
    <span class="eyebrow">HELLO, WORLD.</span>
    <h1 id="intro-title">Sam Rivera</h1>
    <p>I build thoughtful interfaces for curious people. This is my first developer portfolio, made one small project at a time.</p>
  </section>
  <section id="projects" aria-labelledby="projects-title">
    <h2 id="projects-title">Selected projects</h2>
    <div class="project-grid">
      <article class="project-card"><span>01 /</span><h3>Focus tracker</h3><p>A simple timer that turns big plans into small focused sessions.</p></article>
      <article class="project-card"><span>02 /</span><h3>Reading list</h3><p>A home for the books, articles, and ideas I want to explore next.</p></article>
      <article class="project-card"><span>03 /</span><h3>Weather desk</h3><p>A clear, accessible dashboard built with sample city weather.</p></article>
    </div>
  </section>
  <section id="about" aria-labelledby="about-title">
    <h2 id="about-title">Always learning.</h2>
    <p>I am practicing JavaScript, semantic HTML, and responsive CSS. My next goal is to build something useful for a friend.</p>
  </section>
  <footer>Built with curiosity · <span id="year"></span></footer>
</main>`,
  "styles.css": portfolioStyles,
  "script.js": `// A small enhancement: the portfolio still works without JavaScript.
document.querySelector('#year').textContent = String(new Date().getFullYear());
`,
};

const taskStyles = `${baseStyles}
main { max-width: 620px; }
header { margin-bottom: 28px; }
header h1 { margin: 10px 0 14px; }
form { display: flex; gap: 10px; margin: 24px 0; }
input[type="text"] { width: 100%; min-width: 0; border: 1px solid #42516b; border-radius: 8px; background: #101621; color: #edf2fa; padding: 12px 14px; }
button { padding: 10px 16px; border: 0; border-radius: 8px; background: #ffad75; color: #171411; font-weight: 600; }
ul { padding: 0; margin: 0; list-style: none; display: grid; gap: 10px; }
li { display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 14px 15px; border: 1px solid #334157; border-radius: 9px; background: #101621; }
li label { display: flex; align-items: center; gap: 10px; overflow-wrap: anywhere; }
li input[type="checkbox"] { width: 17px; height: 17px; accent-color: #9ee0a8; flex-shrink: 0; }
li.completed .task-label { color: #8295af; text-decoration: line-through; }
.delete-task { font-size: 11px; padding: 6px 9px; background: #ff9a9a12; border: 1px solid #ff9a9a35; color: #ffb0b0; }
.meta { display: flex; align-items: center; justify-content: space-between; gap: 10px; color: #9babbe; font-size: 12px; margin-top: 20px; }
#empty-state { text-align: center; padding: 25px 0; font-size: 13px; }
@media (max-width: 400px) { .card { padding: 18px; } form { flex-wrap: wrap; } form button { width: 100%; } }
`;

const taskHtml = `<main>
  <header>
    <span class="eyebrow">SMALL TASKS. REAL MOMENTUM.</span>
    <h1>Task tracker</h1>
    <p>Make a plan, mark your progress, and make room for the next idea.</p>
  </header>
  <section class="card" aria-label="Task workspace">
    <form id="task-form">
      <label for="task-input" class="sr-only">New task</label>
      <input id="task-input" type="text" placeholder="What will you build today?" maxlength="120" required />
      <button type="submit">Add task</button>
    </form>
    <ul id="task-list" aria-label="Tasks"></ul>
    <p id="empty-state">Your next small win starts with a task.</p>
    <div class="meta"><span id="task-count" aria-live="polite">0 tasks</span><span>One thing at a time.</span></div>
  </section>
</main>`;

const taskReference: ProjectFiles = {
  "index.html": taskHtml,
  "styles.css": `${taskStyles}
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
`,
  "script.js": `const form = document.querySelector('#task-form');
const input = document.querySelector('#task-input');
const list = document.querySelector('#task-list');
const emptyState = document.querySelector('#empty-state');
const count = document.querySelector('#task-count');

function updateSummary() {
  const total = list.children.length;
  const complete = list.querySelectorAll('.completed').length;
  count.textContent = total + (total === 1 ? ' task' : ' tasks') + ' · ' + complete + ' complete';
  emptyState.hidden = total > 0;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (text === '') return;

  const item = document.createElement('li');
  const label = document.createElement('label');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.setAttribute('aria-label', 'Complete ' + text);
  const taskLabel = document.createElement('span');
  taskLabel.className = 'task-label';
  taskLabel.textContent = text;
  label.append(checkbox, taskLabel);

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.className = 'delete-task';
  removeButton.textContent = 'Delete';
  removeButton.setAttribute('aria-label', 'Delete ' + text);
  item.append(label, removeButton);
  list.append(item);
  input.value = '';
  input.focus();

  checkbox.addEventListener('change', () => {
    item.classList.toggle('completed', checkbox.checked);
    updateSummary();
  });
  removeButton.addEventListener('click', () => {
    item.remove();
    updateSummary();
  });
  updateSummary();
});

updateSummary();
`,
};

const weatherStyles = `${baseStyles}
main { max-width: 600px; }
header { margin-bottom: 30px; }
header h1 { margin: 10px 0 14px; }
.sample-badge { display: inline-block; border: 1px solid #7bd7ff55; background: #7bd7ff0a; border-radius: 6px; color: #94ddff; padding: 5px 9px; font-size: 11px; }
.controls { display: flex; align-items: end; gap: 14px; justify-content: space-between; }
.controls label { display: block; color: #b7c6da; font-size: 12px; margin-bottom: 7px; }
select { padding: 10px 30px 10px 12px; border: 1px solid #42516b; border-radius: 8px; background: #101621; color: #edf2fa; min-width: 165px; }
button { border: 1px solid #7bd7ff55; background: #7bd7ff12; color: #94ddff; border-radius: 8px; padding: 10px 16px; font-weight: 600; }
.weather-reading { margin: 35px 0 20px; text-align: center; padding: 28px 0; background: radial-gradient(ellipse, #7bd7ff0d, transparent 70%); }
.weather-symbol { color: #ffcf81; font-size: 45px; line-height: 1; }
#temperature { display: block; font-size: clamp(48px, 12vw, 72px); letter-spacing: -3px; margin-top: 8px; color: #edf2fa; }
#weather-summary { color: #b7c6da; font-size: 17px; margin: 4px 0; }
#location-name { color: #94ddff; font-size: 13px; }
.weather-footnote { border-top: 1px solid #334157; color: #8c9eb6; font-size: 11px; padding-top: 18px; text-align: center; }
@media (max-width: 360px) { .card { padding: 17px; } select { min-width: 140px; } }
`;

const weatherHtml = `<main>
  <header>
    <span class="eyebrow">A CLEARER OUTLOOK.</span>
    <h1>Weather desk</h1>
    <p>A small dashboard for learning about data, state, and the DOM.</p>
    <span class="sample-badge">Sample weather data · not a live forecast</span>
  </header>
  <section class="card" aria-label="Weather dashboard">
    <div class="controls">
      <div><label for="city-select">City</label><select id="city-select"><option value="Lisbon">Lisbon</option><option value="Tokyo">Tokyo</option><option value="Reykjavik">Reykjavik</option></select></div>
      <button type="button" id="unit-toggle" aria-label="Switch temperature units">°F</button>
    </div>
    <div class="weather-reading" aria-live="polite">
      <span class="weather-symbol" aria-hidden="true">☀</span>
      <output id="temperature">22°C</output>
      <p id="weather-summary">Sunny</p>
      <span id="location-name">Lisbon</span>
    </div>
    <div class="weather-footnote">Built-in examples. No location access, API key, or network request.</div>
  </section>
</main>`;

const weatherReference: ProjectFiles = {
  "index.html": weatherHtml,
  "styles.css": weatherStyles,
  "script.js": `// This fixed sample dataset is for practicing UI behavior, not forecasting.
const weather = {
  Lisbon: { celsius: 22, summary: 'Sunny', symbol: '☀' },
  Tokyo: { celsius: 18, summary: 'Cloudy', symbol: '☁' },
  Reykjavik: { celsius: 6, summary: 'Windy', symbol: '≋' },
};
const citySelect = document.querySelector('#city-select');
const unitToggle = document.querySelector('#unit-toggle');
let fahrenheit = false;

function renderWeather() {
  const city = citySelect.value;
  const reading = weather[city];
  const temperature = fahrenheit ? Math.round(reading.celsius * 9 / 5 + 32) : reading.celsius;
  document.querySelector('#temperature').textContent = temperature + (fahrenheit ? '°F' : '°C');
  document.querySelector('#weather-summary').textContent = reading.summary;
  document.querySelector('#location-name').textContent = city;
  document.querySelector('.weather-symbol').textContent = reading.symbol;
  unitToggle.textContent = fahrenheit ? '°C' : '°F';
}
citySelect.addEventListener('change', renderWeather);
unitToggle.addEventListener('click', () => {
  fahrenheit = !fahrenheit;
  renderWeather();
});
renderWeather();
`,
};

export const projects: GuidedProject[] = [
  {
    id: "developer-portfolio",
    title: "Developer portfolio",
    description:
      "Give your work a home with semantic HTML, a responsive card grid, and clear navigation.",
    level: "HTML + CSS",
    duration: "30–45 min",
    checkpoints: [
      {
        id: "portfolio-introduction",
        title: "Introduce yourself",
        instruction:
          "Replace the placeholder in the main h1 with your name or developer identity. Keep one clear top-level heading.",
        hint: 'Edit the text inside <h1 id="intro-title"> in index.html. Use meaningful text rather than leaving TODO or Your name.',
      },
      {
        id: "portfolio-projects",
        title: "Show three projects",
        instruction:
          "Add at least three .project-card articles, each with a project title and description, inside the projects section.",
        hint: 'Duplicate the starter article, give each card a different h3 and p, and keep class="project-card" so the shared grid styles apply.',
      },
      {
        id: "portfolio-navigation",
        title: "Connect the navigation",
        instruction:
          'Make the Projects navigation link point to the existing section with id="projects".',
        hint: 'An in-page link uses href="#projects". Its target must exist, and the link needs readable text.',
      },
    ],
    starterFiles: {
      "index.html": `<main>
  <header><strong>DEV.</strong><nav aria-label="Portfolio navigation"><a href="#">Projects</a></nav></header>
  <section class="intro"><span class="eyebrow">HELLO, WORLD.</span><h1 id="intro-title">TODO: your name</h1><p>Write a short introduction about the work you want to create.</p></section>
  <section id="projects"><h2>Selected projects</h2><div class="project-grid">
    <article class="project-card"><span>01 /</span><h3>My first project</h3><p>Describe what you built and what you learned.</p></article>
    <!-- TODO: Add two more project cards with titles and descriptions. -->
  </div></section>
  <footer>Built with curiosity.</footer>
</main>`,
      "styles.css": portfolioStyles,
      "script.js":
        "// This portfolio can work with HTML and CSS alone.\n// Optional: add a small JavaScript enhancement after the checkpoints pass.\n",
    },
    referenceFiles: portfolioReference,
  },
  {
    id: "task-tracker",
    title: "Task tracker",
    description:
      "Build an interactive task list with forms, DOM updates, and completed states.",
    level: "JavaScript + DOM",
    duration: "40–60 min",
    checkpoints: [
      {
        id: "tasks-form",
        title: "Create an accessible task form",
        instruction:
          'Keep a form with id="task-form", a labeled text input id="task-input", a submit button, and a list id="task-list".',
        hint: "The starter already includes this structure. Preserve the IDs and a label that points to task-input while you work on its behavior.",
      },
      {
        id: "tasks-add",
        title: "Add a task",
        instruction:
          "Listen for form submission, stop page navigation, and append a new li containing the typed task. Trim outer whitespace and ignore blank tasks.",
        hint: "Use form.addEventListener('submit', ...), event.preventDefault(), input.value.trim(), document.createElement(), and list.append(). Prefer textContent for user text.",
      },
      {
        id: "tasks-complete-delete",
        title: "Complete and delete tasks",
        instruction:
          'Each new task needs a checkbox that toggles class="completed" on its li, plus a Delete button that removes that li.',
        hint: "Listen for the checkbox change event, then item.classList.toggle('completed', checkbox.checked). Give the Delete button type=\"button\" and call item.remove() on click.",
      },
    ],
    starterFiles: {
      "index.html": taskHtml,
      "styles.css": `${taskStyles}
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
`,
      "script.js": `const form = document.querySelector('#task-form');
const input = document.querySelector('#task-input');
const list = document.querySelector('#task-list');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  // TODO: Read and trim the task text. Ignore blank tasks.
  // TODO: Append an li with a checkbox, task label, and Delete button.
  // TODO: Wire up checkbox changes and deletion.
});
`,
    },
    referenceFiles: taskReference,
  },
  {
    id: "weather-dashboard",
    title: "Weather dashboard",
    description:
      "Turn a sample dataset into an interactive city dashboard with temperature conversion.",
    level: "JavaScript + data",
    duration: "40–60 min",
    checkpoints: [
      {
        id: "weather-city",
        title: "Change the city",
        instruction:
          "When the city selector changes to Tokyo, display 18°C and Cloudy from the built-in sample dataset.",
        hint: "Add a change listener to #city-select. Read weather[citySelect.value], then update #temperature and #weather-summary with textContent.",
      },
      {
        id: "weather-units",
        title: "Convert temperature units",
        instruction:
          "Make #unit-toggle switch between Celsius and Fahrenheit. Tokyo should show 64°F after conversion, then 18°C when switched back.",
        hint: "Keep a boolean for the selected unit. Compute Fahrenheit with Math.round(celsius * 9 / 5 + 32), then update the output and next-unit button text.",
      },
      {
        id: "weather-location",
        title: "Render another sample location",
        instruction:
          "Selecting Reykjavik should show 6°C, Windy, and Reykjavik as the location. Keep the sample-data label visible so this is never confused with a live forecast.",
        hint: "Use one render function for every city. Update #location-name as well as temperature and summary. Do not add a fetch call; all data is already available locally.",
      },
    ],
    starterFiles: {
      "index.html": weatherHtml,
      "styles.css": weatherStyles,
      "script.js": `// Sample data for learning: these are not live weather readings.
const weather = {
  Lisbon: { celsius: 22, summary: 'Sunny', symbol: '☀' },
  Tokyo: { celsius: 18, summary: 'Cloudy', symbol: '☁' },
  Reykjavik: { celsius: 6, summary: 'Windy', symbol: '≋' },
};
const citySelect = document.querySelector('#city-select');
const unitToggle = document.querySelector('#unit-toggle');
let fahrenheit = false;

// TODO: Write renderWeather() to update temperature, summary, and location.
// TODO: Listen for city changes and unit-toggle clicks.
// TODO: Call renderWeather() to paint the initial state.
`,
    },
    referenceFiles: weatherReference,
  },
];

<div align="center">
  <h1>Nobel Prize Explorer</h1>
  
  <p>
    A responsive Nobel Prize exploration platform powered by SPARQL and enriched with DBpedia/Wikidata, featuring plug-in statistics and a REST/GraphQL API.
  </p>

<!-- Badges -->
<p>
  <a href="https://github.com/olarubianca6/NobelExp/forks">
    <img src="https://img.shields.io/github/forks/Louis3797/awesome-readme-template" alt="forks" />
  </a>
  <a href="https://github.com/olarubianca6/NobelExp/issues">
    <img src="https://img.shields.io/github/issues/Louis3797/awesome-readme-template" alt="open issues" />
  </a>
</p>
   
<h4>
    <a href="https://github.com/olarubianca6/NobelExp">Documentation</a>
  <span> · </span>
    <a href="https://github.com/olarubianca6/NobelExp/issues">Report Bug</a>
  <span> · </span>
    <a href="https://github.com/olarubianca6/NobelExp/issues">Request Feature</a>
  </h4>
</div>

<br />

<!-- Table of Contents -->
# :notebook_with_decorative_cover: Table of Contents

- [About the Project](#star2-about-the-project)
  * [Screenshots](#camera-screenshots)
  * [Tech Stack](#space_invader-tech-stack)
  * [Features](#dart-features)
  * [Environment Variables](#key-environment-variables)
- [Getting Started](#toolbox-getting-started)
  * [Prerequisites](#bangbang-prerequisites)
  * [Installation](#gear-installation)
  * [Run Locally](#running-run-locally)
  * [Deployment](#triangular_flag_on_post-deployment)
- [Usage](#eyes-usage)
- [Roadmap](#compass-roadmap)

- [Contact](#handshake-contact)


  

<!-- About the Project -->
## :star2: About the Project
  <p>
    Using the SPARQL endpoint provided by the Nobel Prize organization, together with additional knowledge aggregated from DBpedia and Wikidata, we developed a modular, responsive web system that presents rich information about Nobel prizes, laureates, and institutions across selected domains, time periods, and other user-defined filters. The platform also exposes relevant relationships between entities (e.g., links between laureates, institutions, prizes, and associated topics). In addition, by adopting a plug-in-based architecture, the system provides a range of statistics about Nobel awards—such as recipient demographics (age, gender, background), category-level insights (chemistry, physics, physiology or medicine, etc.), geographic distribution, university-related indicators, and analyses of awardees’ collaborations and accomplishments. The solution includes a dedicated SPARQL endpoint and a REST/GraphQL API layer that delivers requested data efficiently through asynchronous processing.
  </p>


<!-- TechStack -->
### :space_invader: Tech Stack

<details>
  <summary>Client</summary>
  <ul>
    <li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript">JavaScript</a></li>
    <li><a href="https://react.dev/">React</a></li>
    <li><a href="https://tailwindcss.com/">Tailwind CSS</a></li>
    <li><a href="https://zustand-demo.pmnd.rs/">Zustand</a></li>
  </ul>
</details>

<details>
  <summary>Server</summary>
  <ul>
    <li><a href="https://www.python.org/">Python</a></li>
    <li><a href="https://flask.palletsprojects.com/">Flask</a></li>
    <li><a href="https://flask-login.readthedocs.io/">Flask-Login</a></li>
    <li><a href="https://data.nobelprize.org/sparql">Nobel Prize SPARQL Endpoint</a></li>
    <li><a href="https://mailtrap.io/">Mailtrap</a> (email testing)</li>
  </ul>
</details>

<details>
<summary>Database</summary>
  <ul>
    <li><a href="https://www.sqlite.org/">SQLite</a></li>
  </ul>
</details>

<!-- Features -->
### :dart: Features

- **SPARQL-powered Nobel explorer:** Browse Nobel prizes and laureates using the Nobel Prize SPARQL endpoint, with responsive UI, category/year filtering, and paginated results.
- **Entity details + relationships:** Dedicated pages/cards for prizes and people, showing linked relations between laureates, prizes and categories (with RDF/SPARQL-based data integration).
- **Statistics & insights:** A statistics area (plug-in friendly) that aggregates interesting metrics about Nobel awards (e.g., distributions by category, time period, geography, and recipient demographics where available).


<!-- Env Variables -->
### :key: Environment Variables

To run this project, create a `.env` file based on the provided `.env.example` and fill in the required values.


<!-- Getting Started -->
## :toolbox: Getting Started

<!-- Prerequisites -->
### :bangbang: Prerequisites

- Node.js (LTS) and npm installed

<!-- Installation -->
### :gear: Installation

Clone the project

```bash
git clone https://github.com/olarubianca6/NobelExp.git
````

Go to the project directory

```bash
cd NobelExp
```

Install dependencies

```bash
npm install
```

<!-- Run Locally -->

### :running: Run Locally

Start the client (frontend)

```bash
npm run dev
```

Start the server (backend) in a separate terminal (if applicable)

```bash
npm run server
```

<!-- Deployment -->

### :triangular_flag_on_post: Deployment

```bash
npm run build
npm run start
```


<!-- Usage -->
## :eyes: Usage

Use this space to tell a little more about your project and how it can be used. Show additional screenshots, code samples, demos or link to other resources.


```javascript
import Component from 'my-project'

function App() {
  return <Component />
}
```

<!-- Roadmap -->
## :compass: Roadmap

* [x] Integrate Nobel Prize SPARQL endpoint for querying prizes, laureates, and institutions
* [x] Implement responsive UI with filters (category/year) and pagination
* [x] Add entity views (cards/details) with basic relations between prizes and laureates
* [x] Implement authentication flow (register/login/logout) with email support (Mailtrap)
* [x] Add saved favorites per prizes
* [ ] Add User Profile page
* [ ] Extend statistics dashboard (demographics, geography, category trends)

<!-- Contact -->
## :handshake: Contact

Bojescu Bianca  - bianca.bojescu@gmail.com
Olaru Bianca 

Project Link: [https://github.com/olarubianca6/NobelExp.git](https://github.com/olarubianca6/NobelExp.git)
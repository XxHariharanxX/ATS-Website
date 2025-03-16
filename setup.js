const fs = require('fs');
const path = require('path');

// Define project structure
const structure = {
  'mern-ats-resume-checker': {
    client: {
      public: {},
      src: {
        components: {},
        pages: {},
        services: {},
        context: {},
        utils: {},
        'App.js': '',
        'index.js': '',
      },
      'package.json': '',
      'README.md': '',
    },
    server: {
      config: {},
      controllers: {},
      models: {},
      routes: {},
      services: {
        'resumeParser.js': '',
        'keywordMatcher.js': '',
        'scoreCalculator.js': '',
      },
      utils: {},
      'app.js': '',
      'server.js': '',
      'package.json': '',
      'README.md': '',
    },
    '.gitignore': '',
    'package.json': '',
    'README.md': '',
  },
};

// Function to create directories and files
function createStructure(basePath, obj) {
  Object.entries(obj).forEach(([key, value]) => {
    const newPath = path.join(basePath, key);
    if (typeof value === 'object') {
      fs.mkdirSync(newPath, { recursive: true });
      createStructure(newPath, value);
    } else {
      fs.writeFileSync(newPath, value, 'utf8');
    }
  });
}

// Run the script
const root = path.join(__dirname);
createStructure(root, structure);

console.log('Project structure created successfully!');

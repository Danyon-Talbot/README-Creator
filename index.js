const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

inquirer
    .prompt([
        {
            type: 'input',
            message: "Name this file for storage",
            name: 'filename'
        },
        {
            type: 'input',
            message: 'Project Title:',
            name: 'title',
        },
        {
            type: 'input',
            message: 'Project Description: ',
            name: 'description',
        },
        {
            type: 'input',
            message: 'What was your motivation?',
            name: 'motivation',
        },
        {
            type: 'input',
            message: 'Why did you build this project?',
            name: 'reason',
        },
        {
            type: 'input',
            message: 'What problem does this solve?',
            name: 'problem',
        },
        {
            type: 'input',
            message: 'What have you learned from this project?',
            name: 'learned',
        },
        {
            type: 'input',
            message: 'Installation',
            name: 'installation',
        },
        {
            type: 'input',
            message: 'Usage',
            name: 'usage',
        },
        {
            type: 'input',
            message: 'Credits',
            name: 'credits',
        }
    ]) .then(data => {
        const createREADME = `# ${data.title}

## Description

* ${data.description}

### What was my motivation?

* ${data.motivation}

### Why did you build this project?

* ${data.reason}

### What problem does this solve?

* ${data.problem}

### What have I learned from this project?

*${data.learned}

## Installation:

* ${data.installation}

## Usage:

* ${data.usage}

## Credits:

* ${data.credits}
        `;
        const saveFolder = './generated-readmes';
        const fileName = `${data.filename.toLowerCase().split(' ').join('')}.md`;

        if (!fs.existsSync(saveFolder)) {
            fs.mkdirSync(saveFolder);
        }

        const filePath = path.join(saveFolder, fileName);

        fs.writeFile(filePath, createREADME, (err) =>
        err ? console.error(err) : console.log('Success!'));
    });
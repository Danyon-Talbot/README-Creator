const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const data = {
        credits: [],
        installation: [],
        screenShots: []
        };

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
            message: 'Usage',
            name: 'usage',
        },
        {
            type: 'list',
            message: 'Do you wish to add a screenshot?',
            name: 'screenshotConfirm',
            choices: ['Yes', 'No'],
            validate: function (value) {
                if (value !== 'Yes' && value !== 'No') {
                    return 'Please select either "Yes" or "No"';
                }
                return true;
            },
        },
        {
            type: 'list',
            message: 'Does this project require any installations?',
            name: 'installConfirm',
            choices: ['Yes', 'No'],
            validate: function (value) {
                if (value !== 'Yes' && value !== 'No') {
                    return 'Please select either "Yes" or "No"';
                }
                return true;
            },
        },
        {
            type: 'list',
            message: 'Do you have any Credits to add?',
            name: 'creditConfirm',
            choices: ['Yes', 'No'],
            validate: function (value) {
                if (value !== 'Yes' && value !== 'No') {
                    return 'Please select either "Yes" or "No"';
                }
                return true;
            },
        }
    ])
    .then(addScreenShot => {
        Object.assign(data, addScreenShot);
        // If the user selected "Yes" to add screenshots, it calls the prompt to add screenshots
        if (data.screenshotConfirm === "Yes" && data.installConfirm === "Yes" && data.creditConfirm === "Yes") {
            promptAddScreenShot(data);
        } else if (data.screenshotConfirm === "No" && data.installConfirm === "Yes"){
            // If user skipped adding a screenshot but wants to add installation steps, calls function to prompt for installation steps
            promptInstallationSteps(data);
        } else if (data.installConfirm === "No" && data.screenshotConfirm === "No" && data.creditConfirm === "Yes") {
            // If user skipped screenshot and installation steps but said yes to credits, skips to function to prompt for credit information
            promptCreditsInfo(data);
        } else {
           saveREADME(data);
        }
    })

    function promptAddScreenShot() {
        inquirer
            .prompt({
                type: 'input',
                message: 'Input name of Image:',
                name: 'screenshotName',
            })
            .then((imageData) => {
                data.screenShots.push(imageData.screenshotName);
                promptInstallationSteps();
            });
    }
    
//prompts the user to add each step necessary for installation.
function promptInstallationSteps(data) {
    inquirer
        .prompt({
            type: 'input',
            message: 'Please add an installation step (Enter "exit" to exit):',
            name: 'installStep',
        })
        .then((installData) => {
            // If the user originally selected or proceeded to input "NO", this saves the file at this point.
            if (installData.installStep.toLowerCase() === 'exit') {
                promptCreditsInfo(data);
            } else {
                // If the user did not originally select "NO", and has not inputed "NO" it continues to prompt for more steps.
                data.installation.push(installData.installStep);
                promptInstallationSteps(data);
            }
        });
}

// Prompts the user to add the name of the Credit.
function promptCreditsInfo(data) {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'Add Name of Credit (Not URL. Type "exit" to exit)', // If the user types "exit" the file is saved and exits.
                name: 'creditName',
            }
        ])
        .then((creditData) => {
            if (creditData.creditName.toLowerCase() === "exit") { // Exits the program.
                saveREADME(data);
            } else {
                data.credits.push(creditData.creditName); // Pushes entered data to credits
                promptCreditsURL(data);
            }
        });
}


// Prompts the user to add a URL to the Credit.
function promptCreditsURL(data) {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'Add Credit URL',
                name: 'creditURL'
            }
        ])
        .then((creditData) => {
            data.credits.push(creditData.creditURL); // Pushes entered data to credits
            promptCreditsInfo(data);
        });
}


// This function takes and assembles the inputed data into the necessary positions.
function saveREADME(data) {

    const credits = [];
    for (let i = 0; i < data.credits.length; i += 2) {
        const name = data.credits[i];
        const url = data.credits[i + 1];
        if (name && url) {
            credits.push(`* [${name}](${url})`);
        }
    }

// The literal string positions the elements exactly where they need to be on the page.
// NOTE: Adding an image is entirely based on if the images are located in the ../Assets/images folder.
// Potentially will add URL links to images as an alternative.
const createREADME = `# ${data.title}

## Description

* ${data.description}

### What was my motivation?

* ${data.motivation}

### Why did I build this project?

* ${data.reason}

### What problem does this solve?

* ${data.problem}

### What have I learned from this project?

* ${data.learned}

## Website Page:

${data.screenShots.map(filename => `![Screenshot](../Assets/images/${filename})`).join('\n')}

## Installation:

${data.installation.length > 0 ? data.installation.map(step => `* ${step}`).join('\n') : 'No installations required.'}

## Usage:

* ${data.usage}

## Credits:

${credits.length > 0 ? credits.join('\n') : 'No credits provided.'}
        `;
        // Defines the path for the save folder.
        const saveFolder = './generated-readmes';
        // takes the name input and appends the ".md" file type for a markdown file.
        const fileName = `${data.filename.toLowerCase().split(' ').join('')}.md`;

        // Checks if the file exists and creates it if it doesn't.
        if (!fs.existsSync(saveFolder)) {
            fs.mkdirSync(saveFolder);
        }

        // Sets the desired path name to save the folder to.
        const filePath = path.join(saveFolder, fileName);

        // Writes to the filepath and sets the file content using the generated structure.
        fs.writeFile(filePath, createREADME, (err) =>
        err ? console.error(err) : console.log('Success!'));

    }


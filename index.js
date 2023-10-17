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
            type: 'input',
            message: 'Usage',
            name: 'usage',
        },
        {
            type: 'list',
            message: 'Does you have any Credits to add?',
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
    .then(data => {
        // If the user selected "Yes" to add required installation steps, calls function to add installation steps.
        if (data.installConfirm === "Yes") {
            data.installation = [];
            promptInstallationSteps(data);
        } else {
            // If the user did not select "Yes", this saves the file as is.
            saveREADME(data);
        }
    })

//prompts the user to add each step necessary for installation.
function promptInstallationSteps(data) {
    inquirer
        .prompt({
            type: 'input',
            message: 'Please add an installation step (Enter "NO" to exit):',
            name: 'installStep',
        })
        .then((installData) => {
            // If the user originally selected or proceeded to input "NO", this saves the file at this point.
            if (installData.installStep.toLowerCase() === 'no') {

                saveCreditsInfo(data); // !!! THIS WAS CHANGED TO CALL A FUNCTION TO ADD CREDITS. PREVIOUSLY saveREADME() !!!

            } else {
                // If the user did not originally select "NO", and has not inputed "NO" it continues to prompt for more steps.
                data.installation.push(installData.installStep);
                promptInstallationSteps(data);
            }
        })
}

// Checks if the user chose "Yes" to add Credits.
function saveCreditsInfo(data) {
    if (data.creditConfirm === "Yes") {
        // Creates a data container and calls the function to prompt the user.
        data.credits = [];
        promptCreditsInfo(data);
    } else {
        //Saves the file if no credits have been added.
        saveREADME(data);
    }

}

// Prompts the user to add the name of the Credit.
function promptCreditsInfo(data) {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'Add Name of Credit (Not URL. Type "exit" to exit', // If the user types "exit" the file is saved and exits.
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

* ${data.learned}

## Installation:

${data.installation.length > 0 ? data.installation.map(step => `* ${step}`).join('\n') : 'No installation steps provided.'}

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


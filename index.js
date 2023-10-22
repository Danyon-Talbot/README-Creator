const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const data = {
        credits: [],
        installation: [],
        screenShots: [],
        test: [],
        githubURL: '',
        };

inquirer
    .prompt([
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
            type: 'input',
            message: 'Add Contribution Guidelines:',
            name: 'contributions',
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
        },
        {
            type: 'list',
            message: 'Add User Testing Options?',
            name: 'testingConfirm',
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
        // If the user selected "Yes" to add screenshots, it calls the prompt to add screenshots.
        if (data.screenshotConfirm === "Yes") {
            promptAddScreenShot(data);
        } else if (data.installConfirm === "Yes"){
            // If user skipped adding a screenshot but wants to add installation steps, calls function to prompt for installation steps.
            promptInstallationSteps(data);
        } else if (data.creditConfirm === "Yes") {
            // If user skipped screenshot and installation steps but said yes to credits, skips to function to prompt for credit information.
            promptCreditsInfo(data);
        } else if (data.testingConfirm === "Yes") {
            // If user skipped all previous steps, calls to add testing instructions.
            promptTestInstructions(data);
        } else {
            // If user skipped all previous steps, calls to add GitHub Profile URL.
            fetchGitHubURL(data);
        }
    })




// NOTE: Adding an image is entirely based on if the images are located in the ../Assets/images folder.
// Potentially will add URL links to images as an alternative.
function promptAddScreenShot(data) {
    inquirer
        .prompt({
            type: 'input',
            message: 'Input ScreenShot file name:',
            name: 'screenshotName',
        })
        .then((imageData) => {
            data.screenShots.push(imageData.screenshotName);
            if (data.installConfirm === "Yes") {
                promptInstallationSteps(data);
            } else if (data.installConfirm === "No" && data.creditConfirm === "Yes") {
                promptCreditsInfo(data);
            } else {
                saveREADME(data)
            }
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
            // If the user originally selected "No" or proceeded to input "exit", this saves the file at this point.
            if (installData.installStep.toLowerCase() === 'exit') {
                if (data.creditConfirm === "No") {
                    saveREADME(data);
                } else {
                    promptCreditsInfo(data);
                }
            } else {
                // If the user did not originally select "NO", and has not inputed "exit" it continues to prompt for more steps.
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
                promptTestInstructions(data);
            } else {
                data.credits.push(creditData.creditName); // Pushes entered data to credits.
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
            data.credits.push(creditData.creditURL); // Pushes entered data to credits.
            promptCreditsInfo(data);
        });
}

function promptTestInstructions(data) {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'Add Test Instructions(Not URL. Type "exit" to exit)', // If the user types "exit" the file is saved and exits.
                name: 'testName',
            }
        ])
        .then((testData) => {
            if (testData.testName.toLowerCase() === "exit") { // Exits the program.
                fetchGitHubURL(data);
            } else {
                data.test.push(testData.testName); // Pushes entered data to test.
                promptTestInstructions(data);
            }
        });
}


// Calls the GitHub REST API to pull the username and return the URL for the user's profile.
async function fetchGitHubURL(data) {
    try {
      const token = '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';
  
        // Use Inquirer to prompt for GitHub Profile
        const githubProfileInput = await inquirer.prompt({
            type: 'input',
            message: 'Add Your GitHub Profile:',
            name: 'githubProfile',
        });

        // Assigns the user input to a variable
        const username = githubProfileInput.githubProfile;
        const apiUrl = `https://api.github.com/users/${username}`;
        
        // Calls the API using the variable and authorises it.
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                Authorization: `token ${token}`,
                'Content-Type': 'application/json',
            },
        });

        // Checks for response from the API
        if (response.ok) {
            const userData = await response.json();

            // On successful response, it pulls the URL and assigns it to a variable
            if (userData.message !== 'Not Found') {
                data.githubURL = userData.html_url;
                // Displays the URL in the console as confirmation
                console.log('GitHub URL:', data.githubURL);
                saveREADME(data);
            } else {
                // If username is not found, prompts the user and returns to input
                console.log("GitHub Username Not Found!");
                return;
            }
        } else {
            //Notes if the API call failed.
            console.log("Error fetching GitHub data:", response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
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

## Table of Contents
- [Description](#description)
- [Website Page](#website-page)
- [Installation](#installation)
- [Usage](#usage)
- [Credits](#credits)
- [Contributions](#contributions)
- [Testing](#testing)
- [Questions](#questions)

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

## Contributions:

* ${data.contributions}

## Testing:

${data.test.length > 0 ? data.test.map(test => `* ${test}`).join('\n') : 'Tests To Be Added.'}

## Questions

#### My GitHub Profile:
* [GitHub Profile](${data.githubURL})

#### Additional Questions?

* If you have any addtional questions, please reach out to me here: ${data.personalEmail}

        `;
        // Defines the path for the save folder.
        const saveFolder = './generated-readmes';
        // takes the name input and appends the ".md" file type for a markdown file.
        const fileName = `${data.title.toUpperCase().split(' ').join('')}.md`;

        // Checks if the file exists and creates it if it doesn't.
        if (!fs.existsSync(saveFolder)) {
            fs.mkdirSync(saveFolder);
        }

        // Sets the desired path name to save the folder to.
        const filePath = path.join(saveFolder, fileName);

        // Writes to the filepath and sets the file content using the generated structure.
        const writeFilePromise = new Promise((resolve, reject) => {
            fs.writeFile(filePath, createREADME, (err) =>
            err ? console.error(err) : console.log('SAVED!'));
        })
        return writeFilePromise;
    }
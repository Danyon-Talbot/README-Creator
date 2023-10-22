const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const data = {
        credits: [],
        installation: [],
        screenShots: [],
        test: [],
        usage: [],
        githubProfile: [],
        githubURL: '',
        personalEmail: '',
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
            promptAddUsage(data);
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
                promptAddUsage(data)
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
                    promptAddUsage(data);
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
                promptAddUsage(data);
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

function promptAddUsage(data) {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'Add How to Use Steps: (Type "exit" to exit):', // If the user types "exit" the file is saved and exits.
                name: 'usageName',
            }
        ])
        .then((usageData) => {
            if (usageData.usageName.toLowerCase() === "exit") { // Exits the program.
              promptAddLicense(data);
            } else {
                data.usage.push(usageData.usageName); // Pushes entered data to usage.
                promptAddUsage(data);
            }
        });
}

function promptAddLicense(data) {
    const licenseChoices = ['GNU General Public License v3.0', 'MIT License'];

    inquirer
        .prompt([
            {
                type: 'list',
                message: 'Select License:',
                name: 'license',
                choices: licenseChoices,
            }
        ])
        .then((licenseData) => {
            // Set the license property in the data object
            data.license = licenseData.license;

            // Generate the license badge based on the selected license
            const licenseBadges = {
                'GNU General Public License v3.0': 'https://img.shields.io/badge/License-GPLv3-blue.svg',
                'MIT License': 'https://img.shields.io/badge/License-MIT-yellow.svg',
            };

            data.licenseBadge = licenseData.license in licenseBadges ? `![License](${licenseBadges[licenseData.license]})` : '';

            // Continue with other functions depending on selected options
            if (data.testingConfirm === "Yes") {
                promptTestInstructions(data);
            } else {
                // Exit here and call the next function
                fetchGitHubURL(data);
            }
        });
}



function promptTestInstructions(data) {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'Add Test Instructions(Type "exit" to exit):', // If the user types "exit" the file is saved and exits.
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
        // Use Inquirer to prompt for GitHub Profile
        const githubProfileInput = await inquirer.prompt({
            type: 'input',
            message: 'Add Your GitHub Profile:',
            name: 'githubProfile',
        });

        // Assigns the user input to a variable
        data.githubProfile = githubProfileInput.githubProfile;
        const username = data.githubProfile;
        const apiUrl = `https://api.github.com/users/${username}`;
        
        // Calls the API using the variable and authorises it.
        const response = await fetch(apiUrl);

        // Checks for response from the API
        if (response.ok) {
            const userData = await response.json();

            // On successful response, it pulls the URL and assigns it to a variable
            if (userData.message !== 'Not Found') {
                data.githubURL = userData.html_url;
                // Displays the URL in the console as confirmation
                console.log('GitHub URL:', data.githubURL);
                promptPersonalEmail(data);
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

async function promptPersonalEmail(data) {
    const emailPrompt = await inquirer.prompt([
        {
            type: 'input',
            message: 'Enter contact email:',
            name: 'personalEmail',
            validate: function (value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value) ? true : 'Please enter a valid email address';

            }   
        }
    ]);
    data.personalEmail = emailPrompt.personalEmail;
    saveREADME(data);
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

    const licenseBadge = data.licenseBadge;

    // License notice based on the selected license
    const licenseNotice = data.license === 'GNU General Public License v3.0'
        ? 'This application is covered by the [GNU General Public License v3.0](https://opensource.org/licenses/GPL-3.0).'
        : data.license === 'MIT License'
        ? 'This application is covered by the [MIT License](https://opensource.org/licenses/MIT).'
        : '';

// The literal string positions the elements exactly where they need to be on the page.
// The literal string positions the elements exactly where they need to be on the page.
const createREADME = `# ${data.title}

## Table of Contents
- [Description](#description)
- [License](#license)
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

## License:

${data.licenseBadge}

${licenseNotice}

## Website Page:

${data.screenShots.map(filename => `![Screenshot](../Assets/images/${filename})`).join('\n')}

## Installation:

${data.installation.length > 0 ? data.installation.map(step => `* ${step}`).join('\n') : 'No installations required.'}

## Usage:

${data.usage.length > 0 ? data.usage.map(item => `* ${item}`).join('\n') : 'No usage information provided.'}

## Credits:

${credits.length > 0 ? credits.join('\n') : 'No credits provided.'}

## Contributions:

* ${data.contributions}

## Testing:

${data.test.length > 0 ? data.test.map(test => `* ${test}`).join('\n') : 'Tests To Be Added.'}

## Questions

#### My GitHub Profile:
* [${data.githubProfile}](${data.githubURL})

#### Additional Questions?

* If you have any additional questions, please reach out to me here: ${data.personalEmail}

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
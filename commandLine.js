const {
    exec
} = require("child_process");
const prompt = require('prompt-sync')();
const fs = require('fs');

getFile();


async function getFile() {
    let goodFile = false;
    let inputName, input, inputExtension
    while (!goodFile) {
        input = prompt('Type .tex file you would like to convert to HTML: ');
        inputName = input.slice(0, -4);
        inputExtension = input.split('.').pop();
        if (inputExtension == 'tex') {
            await convertTex(inputName).then(() => {
                goodFile = true;
                printOutput(inputName);
            }).catch(error => {
                console.error(error);
            });
        } else {
            console.log('Incorrect filename...try again.\n');
        }
    }
}


function convertTex(inputName) {
    return new Promise((resolve, reject) => {
        exec(`pandoc ${inputName}.tex -f latex -t html -s -o ${inputName}.html --mathjax`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                reject(error.message);
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                reject(stderr);
            }
            // console.log(`stdout: ${stdout}`);
            resolve(stdout);
        });
    });
}

async function printOutput(inputName) {
    const data = fs.readFileSync(`${inputName}.html`, 'utf8');
    const re = /<body>([\s\S]*)<\/body>/;
    const match = data.match(re);

    const output = match[1];
    fs.writeFileSync(`${inputName}.html`, output);
    console.log(`Copy the code in ${inputName}.html`);
    // console.log(data);
    // console.log(inputName);
}
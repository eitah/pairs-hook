#!/usr/bin/env node

// run the commit till a post commit hook
const inquirer = require('inquirer');
const shell = require('shelljs');
const chalk = require('chalk');

function getPair() {
    const foo = shell.exec('git about | grep "git user"', { silent: true }) || '';
    return chalk.cyan(foo.split(':')[1].trim());
}

async function isNotCommitAmend() {
    const gitDiff = await shell.exec('git diff --cached');
    const isNotAmend = gitDiff.trim() === '';
    console.error('isNotAmend', isNotAmend);
}

isNotCommitAmend();

let originalPair, currentPair, lastHash, currentHash;
currentPair = originalPair = getPair();
if (originalPair.split(' ').includes('and')) {
    currentPair = `pair ${currentPair}`;
}

let shouldICommitPrompt = {
    type: 'confirm',
    name: 'shouldICommit',
    message: `Are you sure you want to commit as ${currentPair}?`,
};

let initialsInput = {
    type: 'input',
    name: 'initials',
    message: 'What initial(s) would you like to use?',
    validate(value = '') {
        const initials = value.split(' ').filter(i => i.length === 2); // checks initials are exactly 2 characters long
        const pass = initials.length === 1 || initials.length === 2; // if there is 1 or 2 sets of initials
        if (pass) {
            console.error('\n');
            return true
        } else {
            console.log('\nSorry please enter valid initials.');
        }
    },
};

async function executeHook() {
    inquirer.prompt(shouldICommitPrompt)
        .then((answer) => {
            if (answer.shouldICommit) {
                console.error('Great!');
                shell.exit(0); // Success
            }
            inquirer.prompt(initialsInput)
                .then((input) => {
                    shell.exec(`git pair ${input.initials}`);
                    currentPair = getPair();
                    let modifier = (currentPair !== originalPair) ? 'set to' : 'remains';
                    shell.echo(`\nGit pair ${modifier} ${currentPair}\n`);
                })
                .then(() =>{
                    inquirer.prompt({
                        type: 'confirm',
                        name: 'confirmPair',
                        message: `Proceed with pair ${currentPair}?`,
                    })
                        .then((answer) => {
                            if (answer.confirmPair) {
                                const commitCommand = 'git commit --amend --reset-author --no-edit -n';
                                shell.echo(chalk.cyan(`${commitCommand}\n`));
                                shell.exec(commitCommand);
                                shell.exit(0); // Success
                            } else {
                                console.log('That\'s ok. Execute', chalk.cyan('npm run pairs-hook'), 'to try again.')
                            }
                        })
                })
        });

}

executeHook();
#!/usr/bin/env node

// run the commit till a post commit hook
const inquirer = require('inquirer');
const shell = require('shelljs');
const chalk = require('chalk');

function getPair() {
    const foo = shell.exec('git about | grep "git user"', { silent: true }) || '';
    return chalk.cyan(foo.split(':')[1].trim());
}

let pair = getPair();
if (pair.split(' ').includes('and')) {
    pair = `pair ${pair}`;
}

// happy path
inquirer.prompt([
    {
        type: 'confirm',
        name: 'shouldICommit',
        message: `Are you sure you want to commit as ${pair}?`,
    },
])
    .then((answer) => {
        if (answer.shouldICommit) {
            shell.exit(0); // Success
        }
    })
    .then(() => {
        inquirer.prompt([
            {
                type: 'input',
                name: 'pair',
                message: 'What initial(s) would you like to use?',
                validate(value = '') {
                    const initials = value.split(' ').filter(i => i.length === 2); // checks initials are exactly 2 characters long
                    const pass = initials.length === 1 || initials.length === 2; // if there is 1 or 2 sets of initials
                    if (pass) {
                        console.error('\n');
                        shell.exec(`git pair ${value}`);
                        shell.echo(`\nGreat, ready to commit as ${getPair()}\n`);
                        const directions = chalk.cyan('Please copy the below into your command line');
                        shell.echo(directions);
                        shell.echo('\ngit commit --amend --reset-author --no-edit -n\n');
                        shell.exit(0); // Success
                    } else {
                        console.log('\nSorry please enter a valid pair.');
                    }
                },
            },
        ]);
    });

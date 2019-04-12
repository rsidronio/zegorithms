#!/usr/bin/env node
const program = require('commander');
const { simpleParse, apply } = require('./romero');

program 
    .version('1.0.0')
    .description('parser simples');

program
    .command('simpleParse <input>')
    .alias('p')
    .description('calcula a entrada <string> e retorna um inteiro')
    .action((input) => {
      console.log(simpleParse(input));
    });

program
    .command('apply <a> <b> <op> ')
    .alias('a')
    .description('aplica um dado operador em dada duas entradas')
    .action((a, b, op) => {
      console.log(apply(a,b,op));
    });

program.parse(process.argv);

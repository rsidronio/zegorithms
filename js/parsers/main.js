#!/usr/bin/env node
const program = require('commander');
const { parse, simpleParse, apply, applyCompute } = require('./romero');

program 
  .version('1.0.2')
  .description('romero parsers');

program
  .command('parse <input>')
  .alias('p')
  .description('dada uma equação <string> retorna sua forma simplicada para fácil cálculo')
  .action((input) => {
    console.log(parse(input));
  });

program
  .command('simpleParse <input>')
  .alias('s')
  .description('calcula a entrada <string> e retorna um float')
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


program
  .command('compute <simpl>')
  .alias('c')
  .description('dada uma lista na forma simplicada retorna o resultado desta equação')
  .action((simpl) => {
    console.log(applyCompute(simpl));
  });

program.parse(process.argv);

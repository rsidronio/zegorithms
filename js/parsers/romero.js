    
/**
 * E -> (E)
 * 
 * E -> E O E
 * 
 * E -> N
 * 
 * N -> {0-9}+
 * 
 * O -> + | - | * | /
 * 
 * @param {string} input E
 * @returns {number} N
 * @author zeduado <jets(a)cin.ufpe.br> 
 */
const parse = (input) => {
    input = input.trim();
    let stack = [];
    let simplified = [];

    for(let i = 0; i < input.length; i++) {
        let curr = input[i];
        if(isNumber(curr))
            simplified.push(curr);
        else if (isOperator(curr))
            reduceOperator(curr, stack, simplified);
        else if(isOpen(curr))
            stack.push(curr);
        else if(isClose(curr))
            reduce(stack, simplified);
        else if(!isWhiteSpace(curr))
            throw Error("token invalido");
    }

    simplified = simplified.concat(stack);
    return compute(simplified);
}

/**
 * E -> ( E O E )
 * 
 * E -> N
 * 
 * O -> + | - | * | /
 * 
 * N -> {0-9}+
 * 
 * @param {string} input E
 * @returns {number} N
 * @author zeduado <jets(a)cin.ufpe.br>
 */
const simpleParse = (input) => {
    input = input.trim();
    let stack = [];

    for(let i = 0; i < input.length; i++) {
        let curr = input[i];
        if (isClose(curr)) {
            stack.push(curr);
            stack.push(simpleReduce(stack));
        } else if (isNumber(curr)) {
            let complete = input.floatAt(i);
            stack.push(complete.get);
            i = complete.lastIndex;
        } else if (isOperator(curr) || isOpen(curr)) {
            stack.push(curr);
        } else if (!isWhiteSpace(curr))
            throw Error("token invalido");

        console.log(i, stack);
    }

    if (stack.length == 1 ) return stack[0];
    else throw Error("alguma coisa aconteceu de errado");
}

/**
 * auxiliar
 * @param {Array<string>} stack 
 * @param {Array<string>} simplified  
 */
function reduce(stack, simplified) {
    while(stack.top() && !isOpen(stack.top())) {
        simplified.push(stack.pop());
    }
    stack.pop();
}
/**
 * auxiliar
 * @param {Array<string>} stack
 * @param {Array<string>} simplified 
 */
function reduceOperator(next, stack, simplified) {
    while(stack.top() && isOperator(stack.top())
        && ((next == "+" || next == "-") && (stack.top() == "*" || stack.top("/")))) {
            simplified.push(stack.pop());
    }
    stack.push(next);
}

/**
 * 
 * @param {Array<string>} stack elementos no padrão (A op B)
 * @returns {number}  resultado da operação aritmética com pilha atualizada
 */
function simpleReduce(stack) {
    let curr = stack.pop();
    let b = stack.pop();
    let op = stack.pop();
    let a = stack.pop();
    stack.pop();
    
    if(!isNumber(a) || !isNumber(b) || !isOperator(op) || !isClose(curr))
        throw Error("gramática errada");
    else
        return apply(a, b, op);   
}


/**
 * config e métodos auxiliares
 *
 */
Array.prototype.top = function() { 
    return this[this.length-1]; 
}
Array.prototype.head = function() { 
    return this[0]; 
}
Array.prototype.next = function() {
    return this[++this.current];
};
Array.prototype.prev = function() {
    return this[--this.current];
};
String.prototype.intAt = function(index) {
    let num = "", string = this;
    for(i = index; !isNaN(string[i]); i++)
        num = num.concat(string[i]);
    return { get: parseInt(num), lastIndex: i-1 };
}
String.prototype.floatAt = function(index) {
    let num = ""; string = this;
    for(i = index; !isNaN(string[i]) || string[i] == '.'; i++)
        num = num.concat(string[i]);
    if(isNaN(num)) throw Error("número inválido");
    return { get: parseFloat(num), lastIndex: i-1 };
}
function isOperator(value) {
    return ['+', '-', '*', '/'].includes(value);
}
function isNumber(value) {
    return !isWhiteSpace(value) && !isNaN(value);
}
function isComma(value) {
    return value == '.' || value == ',';
}
function isOpen(value) {
    return value == '(';
}
function isClose(value) {
    return value == ')';
}
function isWhiteSpace(value) {
    return value === " ";
}
function isEnd(value) {
    return value == undefined;
}
/**
 * 
 * @param {number} a operando A
 * @param {number} b operando B
 * @param {string} op operador aritmético + - * ou /
 * @returns {number} resultado da operação aritmética
 */
const apply = function(a, b, op) {
    a = parseFloat(a);
    b = parseFloat(b);
    switch(op) {
        case '+':
            return a+b;
            break;
        case '-':
            return a-b;
            break;
        case '*':
            return a*b;
            break;
        case '/':
            if(b != 0) return a/b;
            else throw Error("não pode dividir por zero");
            break;
        default:
            throw Error("operador não suportado");
            break;
    }
}

/**
 * essa função só serve como tratamento da entrada via terminal quando enviado como string 
 * @param {string} input string em forma de lista simplificada de uma dada equação
 * @returns {number} resultado da equação
 */
const applyCompute = function(input) {
    input = input.split(",").map(token => token.trim());
    input[0] = (input.head()[0] == "[" ? input.head().slice(1,input.head().length) : input.head());
    input[input.length-1] = (input.top()[input.top().length-1] == "]" ? input.top().slice(0, input.top().length-2) : input.top());
    input = input.map(token => token = token.replace(/'/g, "")) .map(token => token.trim());
    return compute(input);
}

/**
 * 
 * @param {Array<string>} simp forma simplificada da equação
 * @returns {number} resultado da equação
 */
function compute(simp) {
    let aux = [];
    while(simp.length != 0) {
        if(isOperator(simp.head())) {
            let b = aux.pop();
            let a = aux.pop();
            let op = simp.shift();
            aux.push(apply(a,b,op));
        } else {
            aux.push(simp.shift());
        }
    }
    if (aux.length == 1 ) return aux[0];
    else throw Error("alguma coisa aconteceu de errado");
}

// exports
module.exports = { parse, simpleParse, apply, applyCompute };
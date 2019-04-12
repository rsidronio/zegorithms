    

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

    Array.prototype.top = function() { 
        return this[this.length-1]; 
    }
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

    /*
        function simpleReduce(stack) {
        if(isClose(stack.top()))
            stack.pop();
        let b = stack.pop();
        let op = stack.pop();
        let a = stack.pop();
        let result = apply(a, b, op);
        
        if(isOpen(stack.top()))
            stack.pop();
        else {
            stack.push(result);
            return simpleReduce(stack);
        }
        
        if(!isNumber(a) || !isNumber(b) || !isOperator(op))
            throw Error("gramática errada");
        else
            return result;   
    }
    */

module.exports = { simpleParse, apply };
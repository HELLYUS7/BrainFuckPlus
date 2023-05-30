const btRun = document.getElementById('btRun');
const memory = document.getElementById('memory');
const codeEditor = document.getElementById('codeEditor');
const consoleOutput = document.querySelectorAll('#consoleOutput');
const delayInput = document.getElementById('delayInput');

class Interpreter {
    constructor() {
        this.tokens = { 'loops': {}, 'numbers': {}, 'func': {} };
        this.code = '';
        this.delayPerCycle = 0;
    }

    addMemoryCell() {
        memory.innerHTML += `<span class="memoryCell" id="${i}">00</span>`;
    }

    getCode() {
        this.code = codeEditor.value;
    }

    mapCode() {
        this.getCode();
        let simpleForwardLoops = [];
        let simpleBackwardLoops = [];
        let targetReturn = 0;
        let cursorCounter = 0;
        let opcode = '';

        while(cursorCounter <= this.code.length) {
            opcode = this.code[cursorCounter];
            if(opcode === '[') {
                simpleForwardLoops.push(cursorCounter);
            }else if(opcode === ']') {
                targetReturn = simpleForwardLoops.pop();
                simpleBackwardLoops[targetReturn] = cursorCounter;
                simpleBackwardLoops[cursorCounter] = targetReturn;
            }
            cursorCounter++;
        }
        console.log(simpleForwardLoops, simpleBackwardLoops);
        return simpleBackwardLoops;
    }

    execute() {
        let simpleLoopsInOut = this.mapCode();
        let cursorCounter = 0;
        let adressMemory = 0;
        let inputUser = '';
        let opcode = '';
        let buffer = '';
        let memory = [0];

        consoleOutput.forEach((value) => value.innerHTML = '');

        const deleteAllMemoryCells = () => {
            const memoryCells = document.querySelectorAll('.memoryCell');
            memoryCells.forEach((value) => {
                value.remove();
            });
            this.addMemoryCell();
        }

        deleteAllMemoryCells();

        function changeBackgroundOfMemoryCell(index, color) {
            const memoryCells = document.querySelectorAll('.memoryCell');
            memoryCells.forEach((value, i) => {
                if(i == index) {
                    value.style.backgroundColor = color;
                }else{
                    value.style.backgroundColor = 'transparent';
                }
            });
        }

        function changeDataOfMemoryCell(index, data) {
            const memoryCells = document.querySelectorAll('.memoryCell');
            memoryCells.forEach((value, i) => {
                if(i == index) {
                    value.innerHTML = data;
                }
        });
        }
        
        function printCaractereInConsole(caractere){
            consoleOutput.forEach((value) => value.innerHTML += caractere);
        }

        const interval = setInterval(() =>{
            if(cursorCounter == this.code.length) clearInterval(interval);
            console.log(memory);
            opcode = this.code[cursorCounter];
            switch(opcode){
                case '>':
                    adressMemory++;
                    if(adressMemory >= memory.length){
                        memory.push(0);
                        this.addMemoryCell();
                    }
                    changeBackgroundOfMemoryCell(adressMemory,'purple')
                break;
                case '<':
                    adressMemory--;
                    changeBackgroundOfMemoryCell(adressMemory,'purple')
                break;
                case '+':
                    memory[adressMemory]++;
                    changeDataOfMemoryCell(adressMemory, memory[adressMemory]);
                break;
                case '-':
                    memory[adressMemory]--;
                    changeDataOfMemoryCell(adressMemory, memory[adressMemory]);
                break;
                case '[':
                    console.log('In Looop')
                    if(memory[adressMemory] == 0) {
                        cursorCounter = simpleLoopsInOut[cursorCounter];
                    }
                break;
                case ']':
                    if(memory[adressMemory] != 0) {
                        cursorCounter = simpleLoopsInOut[cursorCounter];
                    }
                break;
                case ',':
                    inputUser = prompt('Entrada de caractere para ASCII:');
                    memory[adressMemory] = inputUser.charCodeAt(0);
                    changeDataOfMemoryCell(adressMemory, memory[adressMemory]);
                break;
                case '.':
                    printCaractereInConsole(String.fromCharCode(memory[adressMemory]));
                break;
                case '~':
                    buffer += String.fromCharCode(memory[adressMemory]);
                break;
            }
            cursorCounter++;
        },this.delayPerCycle);
    }
}

let interpreter = new Interpreter();
delayInput.addEventListener('input', () => interpreter.delayPerCycle = parseInt(delayInput.value));
btRun.addEventListener('click', () => interpreter.execute());
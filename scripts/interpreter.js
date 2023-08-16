// Código feito por Gabriel Pereira. Versão 2.0

const btRun = document.getElementById('btRun');
const btCompile = document.getElementById('btCompile');
const btStepByStep = document.getElementById('btStepByStep');
const memory = document.getElementById('memory');
const codeEditor = document.getElementById('codeEditor');
const consoleOutput = document.querySelectorAll('#consoleOutput');
const ramSizeInput = document.getElementById('ramSizeInput');
const delayInput = document.getElementById('delayInput');
const keyboardInput = document.querySelector('.keyboardInput');

class Interpreter{
    constructor(){
        this.metaData = {}
        this.memory = [0];
        this.code = '';
        this.pointerCode = 0;
        this.ramSize = 255;
        this.stackPointer = 0;
        this.condicionalPointer = 0;
        this.adress = 0;
        this.delayPerCycle = 0;
        this.compiledProgram = false;
        this.programRunning = false;
        this.terminalNumericMode = false;
    }

    deleteAllMemoryCells(){
        const memoryCells = document.querySelectorAll('.memoryCell');
            memoryCells.forEach((value) => {
                value.remove();
            });
        
    }

    addMemoryCell() {
        memory.innerHTML += `<span class="memoryCell" id="${i}">000</span>`;
    }

    buildRam(){
        this.memory = [];
        for(let i=0;i<this.ramSize;i++){
            this.addMemoryCell();
            this.memory[i] = 0;
        }
    }

    getCode() {
        this.code = codeEditor.value;
    }

    changeDataOfMemoryCell(index, data) {
        const memoryCells = document.querySelectorAll('.memoryCell');
        memoryCells.forEach((value, i) => {
            if (i == index) {
                value.innerHTML = data;
                this.memory[index] = data;
            }
        });
    }

    changeBackgroundOfMemoryCell(index, color) {
        const memoryCells = document.querySelectorAll('.memoryCell');
        memoryCells.forEach((value, i) => {
            if (i == index) {
                value.style.backgroundColor = color;
                
            } else {
                value.style.backgroundColor = 'transparent';
            }
        });
    }


    printInTerminal(text){
        consoleOutput.forEach((value)=>value.innerHTML = text);
    }

    printOutputProgramInTerminal(text){
        consoleOutput.forEach((value)=>value.innerHTML += text);
        
    }

    compileProgram(){
        this.getCode();
        this.pointerCode = 0;
        let simpleLoopsIn = [];
        let stackLoopsIn = [];
        let condicionalsTest = [];
        let opcode = '';
        if(this.code.length >= this.ramSize){
            this.compiledProgram = false;
            this.printInTerminal(`Erro: Memória Insuficiente!\nTamanho da memória: ${this.ramSize} bytes\nTamanho do código: ${this.code.length+1} bytes`);
        }else{
            this.deleteAllMemoryCells();
            this.buildRam();
            while(this.pointerCode < this.code.length){
                opcode = this.code[this.pointerCode];
                this.changeDataOfMemoryCell(this.pointerCode, opcode.charCodeAt(0));
                
                switch(opcode){
                    case '[':
                        simpleLoopsIn.push(this.pointerCode);
                        break;

                    case ']':
                        let targetReturnSimpleLoop = simpleLoopsIn.pop();
                        this.metaData[this.pointerCode] = targetReturnSimpleLoop;
                        this.metaData[targetReturnSimpleLoop] = this.pointerCode;
                        break;

                    case '(':
                        stackLoopsIn.push(this.pointerCode);
                        break;

                    case ')':
                        let targetReturnStackLoop = stackLoopsIn.pop();
                        this.metaData[this.pointerCode] = targetReturnStackLoop;
                        this.metaData[targetReturnStackLoop] = this.pointerCode;
                        break;

                    case '?':
                        condicionalsTest.push(this.pointerCode);
                        break;
                    
                    case '|':
                        let targetReturnCondicionals = condicionalsTest.pop();
                        this.metaData[this.pointerCode] = targetReturnCondicionals;
                        this.metaData[targetReturnCondicionals] = this.pointerCode;
                        break;
                }
                this.pointerCode++;
            }
            this.adress = this.pointerCode;
            this.stackPointer = this.memory.length - 1;
            this.condicionalPointer = this.stackPointer;
            this.changeBackgroundOfMemoryCell(this.adress, 'purple');
            this.compiledProgram = true;
            this.printInTerminal('');
            this.printInTerminal(`Compilação feita com sucesso!\nVocê tem ${this.ramSize - this.code.length} bytes livres...`)
            }
        }

        delay(microseconds) {
        return new Promise(resolve => {
            const start = performance.now();
            const delayLoop = () => {
            const elapsedTime = performance.now() - start;
            if (elapsedTime >= microseconds) {
                resolve();
            } else {
                requestAnimationFrame(delayLoop);
            }
            };
            requestAnimationFrame(delayLoop);
        });
        }
          
          

          async getInput() {
            if(keyboardInput.value !== ''){
                return keyboardInput.value;
            }
            return new Promise(resolve => {
              const onInput = () => {
                if (keyboardInput.value !== '') {
                  keyboardInput.removeEventListener('input', onInput);
                  resolve(keyboardInput.value);
                }
              };
              keyboardInput.addEventListener('input', onInput);
            });
        }
        
        async executeProgramCycle(){
            let opcode = String.fromCharCode(this.memory[this.pointerCode]);
            switch (opcode){
                case '>':
                    //Vai para a próxima célula da memória
                    if((this.adress + 1) < this.ramSize){
                        this.adress++;
                        //console.log(this.adress);
                        this.changeBackgroundOfMemoryCell(this.adress, 'purple');
                    }else{
                        this.printOutputProgramInTerminal('\nErro: Estouro de memória!');
                        return true;
                    }
                    break;

                case '<':
                    //Volta para a célula anterior na memória
                    this.adress--;
                    this.changeBackgroundOfMemoryCell(this.adress, 'purple');
                    break;

                case '+':
                    //Soma 1 à célula atual
                    this.memory[this.adress]++;
                    this.changeDataOfMemoryCell(this.adress, this.memory[this.adress]);
                    break;

                case '-':
                    //Subtriai 1 da célula atual
                    this.memory[this.adress]--;
                    this.changeDataOfMemoryCell(this.adress, this.memory[this.adress]);
                    break;

                case '[':
                    //Loop simples da linguagem
                    if(this.memory[this.adress] == 0){
                        this.pointerCode = this.metaData[this.pointerCode];
                    }
                    break;

                case ']':
                    //Loop simples da linguagem
                    if(this.memory[this.adress] != 0){
                        this.pointerCode = this.metaData[this.pointerCode];
                    }
                    break;

                case ',':
                    //Pega um caractere do buffer de caracteres
                    let inputValue = await this.getInput();
                    if (inputValue.length > 0) {
                        this.memory[this.adress] = inputValue.charCodeAt(0);
                        this.changeDataOfMemoryCell(this.adress, this.memory[this.adress]);
                        let keyboardInput = document.querySelector('.keyboardInput');
                        keyboardInput.value = inputValue.slice(1); // Remove o primeiro caractere do input
                    }
                    break;

                case '.':
                    //Plota o valor da célula atual no terminal em formato ASCII ou numérico
                    if(this.terminalNumericMode){
                        this.printOutputProgramInTerminal(this.memory[this.adress]);
                    }else{
                        this.printOutputProgramInTerminal(String.fromCharCode(this.memory[this.adress]));
                    }
                    break;

                case '!':
                    //Zera o valor da célula atual
                    this.memory[this.adress] = 0;
                    this.changeDataOfMemoryCell(this.adress, this.memory[this.adress]);
                    break;

                case '$':
                    //Copia o valor da célula atual para o ponteiro
                    this.pointerCode = this.memory[this.adress];
                    break;

                case '#':
                    //Copia o valor atual do ponteiro para a célula atual
                    this.memory[this.adress] += this.pointerCode;
                    this.changeDataOfMemoryCell(this.adress, this.memory[this.adress]);
                    break;

                case '*':
                    //Multiplica o valor da célula atual por 2
                    this.memory[this.adress] *= 2;
                    this.changeDataOfMemoryCell(this.adress, this.memory[this.adress]);
                    break;

                case '/':
                    //Divide o valor da célula atual por 2
                    this.memory[this.adress] /= 2;
                    this.changeDataOfMemoryCell(this.adress, this.memory[this.adress]);
                    break;

                case '^':
                    //Eleva o valor da célula atual ao quadrado
                    this.memory[this.adress] **= 2;
                    this.changeDataOfMemoryCell(this.adress, this.memory[this.adress]);
                    break;

                case '{':
                    //Faz o pop do valor da célula atual na pilha do tipo LIFO
                    if(this.stackPointer < this.memory.length - 1){
                        console.log('Batman Quadrado');
                        this.stackPointer++;
                    }
                    this.memory[this.adress] = this.memory[this.stackPointer];
                    this.changeDataOfMemoryCell(this.stackPointer, '00');
                    this.changeDataOfMemoryCell(this.adress, this.memory[this.adress]);
                    break;

                case '}':
                    //Faz o push do valor da célula atual na pilha do tipo LIFO
                    this.memory[this.stackPointer] = this.memory[this.adress];
                    this.changeDataOfMemoryCell(this.stackPointer, this.memory[this.stackPointer]);
                    this.stackPointer--;
                    break;

                case '(':
                    if(this.memory[this.stackPointer + 1] == 0){
                        this.pointerCode = this.metaData[this.pointerCode];
                    }
                    break;
                
                case ')':
                    if(this.memory[this.stackPointer + 1] != 0){
                        this.pointerCode = this.metaData[this.pointerCode];
                    }
                    break;

                case '~':
                    this.condicionalPointer = (this.memory.length - 1) - this.memory[this.adress];
                    break;
                
                case '?':
                    if(this.memory[this.condicionalPointer] != this.memory[this.adress]){
                        this.pointerCode = this.metaData[this.pointerCode];  
                    }
                    break;
                
                case 'i':
                    //Ativa o modo de impressão numérico no terminal
                    this.terminalNumericMode = true;
                    break;

                case 'c':
                    //Ativa o modo de impressão ASCII no terminal
                    this.terminalNumericMode = false;
                    break;
            }
            
            
        }

        async executeProgramLoop(){
            this.printInTerminal('');
            this.pointerCode = 0;
            while(this.pointerCode < this.code.length && this.programRunning){
                if(await this.executeProgramCycle()){
                    break;
                }
                this.pointerCode++;
                await this.delay(this.delayPerCycle);
            }
            this.programRunning = false;
            btRun.innerHTML = 'Run';
            this.printOutputProgramInTerminal('\nFim do programa...');
        }

        runProgram(){
            if(this.programRunning){
                this.programRunning = false;
            }else{
                this.programRunning = true;
                this.executeProgramLoop();
                btRun.innerHTML = 'Stop';
            }

        }

        executeProgramStepByStep(){
            if(this.pointerCode <= this.code.length){
                this.executeProgramCycle();
            }else{
                this.pointerCode = 0;
            }
            this.pointerCode++;
        }
    }


/*

##################### Esta é a versão antiga do interpretador :) #####################


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

        while (cursorCounter <= this.code.length) {
            opcode = this.code[cursorCounter];
            if (opcode === '[') {
                simpleForwardLoops.push(cursorCounter);
            } else if (opcode === ']') {
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
                if (i == index) {
                    value.style.backgroundColor = color;
                } else {
                    value.style.backgroundColor = 'transparent';
                }
            });
        }

        function changeDataOfMemoryCell(index, data) {
            const memoryCells = document.querySelectorAll('.memoryCell');
            memoryCells.forEach((value, i) => {
                if (i == index) {
                    value.innerHTML = data;
                }
            });
        }

        function printCaractereInConsole(caractere) {
            consoleOutput.forEach((value) => value.innerHTML += caractere);
        }

        const interval = setInterval(() => {
            if (cursorCounter == this.code.length) clearInterval(interval);
            console.log(memory);
            opcode = this.code[cursorCounter];
            switch (opcode) {
                case '>':
                    adressMemory++;
                    if (adressMemory >= memory.length) {
                        memory.push(0);
                        this.addMemoryCell();
                    }
                    changeBackgroundOfMemoryCell(adressMemory, 'purple')
                    break;
                case '<':
                    adressMemory--;
                    changeBackgroundOfMemoryCell(adressMemory, 'purple')
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
                    if (memory[adressMemory] == 0) {
                        cursorCounter = simpleLoopsInOut[cursorCounter];
                    }
                    break;
                case ']':
                    if (memory[adressMemory] != 0) {
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
        }, this.delayPerCycle);
    }
}
*/
let interpreter = new Interpreter();
ramSizeInput.addEventListener('input', () => interpreter.ramSize = parseInt(ramSizeInput.value));
delayInput.addEventListener('input', () => interpreter.delayPerCycle = parseInt(delayInput.value));
btCompile.addEventListener('click', () => interpreter.compileProgram());
btRun.addEventListener('click', () => interpreter.runProgram());
btStepByStep.addEventListener('click', () => interpreter.executeProgramStepByStep());

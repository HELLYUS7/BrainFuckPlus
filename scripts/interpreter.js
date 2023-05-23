const btRun = document.getElementById('btRun');
const codeEditor = document.getElementById('codeEditor');

class Interpreter {
    tokens = { 'loops': {}, 'numbers': {}, 'func': {} };
    code = new String();
    Interpreter() { }

    getCode() {
        this.code = codeEditor.value;
    }

    mapCode() {
        this.getCode();
        console.log(this.code);
    }

    execute() {
        this.mapCode();
    }
}

interpreter = new Interpreter();
btRun.addEventListener('click', () => interpreter.execute());
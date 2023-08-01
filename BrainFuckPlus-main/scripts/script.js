function adjustDivHeight() {
    const windowHeight = window.innerHeight;
    const div = document.querySelector('.ide');
    div.style.height = (windowHeight - 60) + 'px';
}
adjustDivHeight();
window.addEventListener('resize', adjustDivHeight);

function buildMemory(lenght = 0) {
    const memory = document.getElementById('memory');
    for (i = 0; i <= lenght; i++) {
        memory.innerHTML += `<span class="memoryCell" id="${i}">00</span>`;
    }
}
buildMemory();
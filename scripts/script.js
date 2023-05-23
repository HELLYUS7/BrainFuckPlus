function adjustDivHeight() {
    const windowHeight = window.innerHeight;
    const div = document.querySelector('.ide');
    div.style.height = (windowHeight - 60) + 'px';
}
adjustDivHeight();
window.addEventListener('resize', adjustDivHeight);
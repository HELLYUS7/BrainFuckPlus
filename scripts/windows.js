class DaggrableWindow {
    constructor(element) {
        this.windowElement = element;
        this.isDragging = false;
        this.initialX = 0;
        this.initialY = 0;

        this.setupDragging();
    }

    setupDragging() {
        const windowTitleBar = this.windowElement.querySelector('.header-windows');
        windowTitleBar.addEventListener('mousedown', (event) => this.startDrag(event));
        document.addEventListener('mousemove', (event) => this.drag(event));
        document.addEventListener('mouseup', (event) => this.stopDrag(event));
    }

    startDrag(event) {
        if (event.button === 0) {
            this.isDragging = true;
            this.initialX = event.clientX - this.windowElement.offsetLeft;
            this.initialY = event.clientY - this.windowElement.offsetTop;
        }
    }

    drag(event) {
        if (this.isDragging) {
            const newX = event.clientX - this.initialX;
            const newY = event.clientY - this.initialY;
            this.windowElement.style.left = newX + 'px';
            this.windowElement.style.top = newY + 'px';
        }
    }

    stopDrag(event) {
        this.isDragging = false;
    }
}

const window1 = new DaggrableWindow(document.getElementById('console-window'));

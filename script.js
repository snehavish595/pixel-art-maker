const canvas = document.getElementById('canvas');
const colorPicker = document.getElementById('colorPicker');
const gridSizeSlider = document.getElementById('gridSize');
const sizeValueDisplay = document.getElementById('sizeValue');
const clearBtn = document.getElementById('clearBtn');
const downloadBtn = document.getElementById('downloadBtn');
const coloredCountDisplay = document.getElementById('coloredCount');
const totalCountDisplay = document.getElementById('totalCount');
const drawModeBtn = document.getElementById('drawModeBtn');
const eraseModeBtn = document.getElementById('eraseModeBtn');
const swatches = document.querySelectorAll('.swatch');

// NEW: Theme Selector Element
const themeToggleBtn = document.getElementById('themeToggleBtn');

let isDrawing = false;
let currentMode = 'draw'; 

// Initialize default grid size
createGrid(16);

function createGrid(size) {
    canvas.innerHTML = ''; 
    canvas.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    canvas.style.gridTemplateRows = `repeat(${size}, 1fr)`;
    totalCountDisplay.textContent = size * size;

    for (let i = 0; i < size * size; i++) {
        const pixel = document.createElement('div');
        pixel.classList.add('pixel');
        pixel.style.backgroundColor = '#ffffff';

        const paintPixel = () => {
            if (currentMode === 'draw') {
                pixel.style.backgroundColor = colorPicker.value;
            } else {
                pixel.style.backgroundColor = '#ffffff'; 
            }
            updatePixelStats();
        };

        pixel.addEventListener('mousedown', (e) => {
            isDrawing = true;
            paintPixel();
        });

        pixel.addEventListener('mouseover', () => {
            if (isDrawing) {
                paintPixel();
            }
        });

        canvas.appendChild(pixel);
    }
    
    updatePixelStats();
}

window.addEventListener('mouseup', () => {
    isDrawing = false;
});

// NEW: Light/Dark Theme Switching Logic
themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
});

swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
        colorPicker.value = swatch.getAttribute('data-color');
        currentMode = 'draw';
        drawModeBtn.classList.add('active');
        eraseModeBtn.classList.remove('active');
    });
});

drawModeBtn.addEventListener('click', () => {
    currentMode = 'draw';
    drawModeBtn.classList.add('active');
    eraseModeBtn.classList.remove('active');
});

eraseModeBtn.addEventListener('click', () => {
    currentMode = 'erase';
    eraseModeBtn.classList.add('active');
    drawModeBtn.classList.remove('active');
});

function updatePixelStats() {
    const pixels = document.querySelectorAll('.pixel');
    let coloredCount = 0;

    pixels.forEach(pixel => {
        if (pixel.style.backgroundColor !== 'rgb(255, 255, 255)' && pixel.style.backgroundColor !== '#ffffff') {
            coloredCount++;
        }
    });

    coloredCountDisplay.textContent = coloredCount;
}

gridSizeSlider.addEventListener('input', (e) => {
    const size = e.target.value;
    sizeValueDisplay.textContent = `${size} x ${size}`;
    createGrid(size);
});

clearBtn.addEventListener('click', () => {
    const pixels = document.querySelectorAll('.pixel');
    pixels.forEach(pixel => pixel.style.backgroundColor = '#ffffff');
    updatePixelStats();
});

downloadBtn.addEventListener('click', () => {
    const size = parseInt(gridSizeSlider.value);
    const pixels = document.querySelectorAll('.pixel');
    
    const virtualCanvas = document.createElement('canvas');
    const ctx = virtualCanvas.getContext('2d');
    
    const exportSize = 512;
    virtualCanvas.width = exportSize;
    virtualCanvas.height = exportSize;
    
    const pixelScale = exportSize / size;

    pixels.forEach((pixel, index) => {
        const x = (index % size) * pixelScale;
        const y = Math.floor(index / size) * pixelScale;
        
        ctx.fillStyle = pixel.style.backgroundColor || '#ffffff';
        ctx.fillRect(x, y, pixelScale, pixelScale);
    });

    const link = document.createElement('a');
    link.download = 'pixel-art.png';
    link.href = virtualCanvas.toDataURL('image/png');
    link.click();
});
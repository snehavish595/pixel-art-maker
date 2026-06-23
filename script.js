const canvas = document.getElementById('canvas');
const colorPicker = document.getElementById('colorPicker');
const gridSizeSlider = document.getElementById('gridSize');
const sizeValueDisplay = document.getElementById('sizeValue');
const clearBtn = document.getElementById('clearBtn');
const downloadBtn = document.getElementById('downloadBtn');

// NEW: Pixel Counter Elements
const coloredCountDisplay = document.getElementById('coloredCount');
const totalCountDisplay = document.getElementById('totalCount');

let isDrawing = false;

// Initialize default grid size
createGrid(16);

function createGrid(size) {
    canvas.innerHTML = ''; 
    canvas.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    canvas.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    // Set maximum grid capacity context text
    totalCountDisplay.textContent = size * size;

    for (let i = 0; i < size * size; i++) {
        const pixel = document.createElement('div');
        pixel.classList.add('pixel');
        pixel.style.backgroundColor = '#ffffff';

        pixel.addEventListener('mousedown', (e) => {
            isDrawing = true;
            pixel.style.backgroundColor = colorPicker.value;
            updatePixelStats(); // Recalculate stats on action
        });

        pixel.addEventListener('mouseover', () => {
            if (isDrawing) {
                pixel.style.backgroundColor = colorPicker.value;
                updatePixelStats(); // Recalculate stats on drag
            }
        });

        canvas.appendChild(pixel);
    }
    
    updatePixelStats(); // Reset counter display back to 0 on new grid generation
}

window.addEventListener('mouseup', () => {
    isDrawing = false;
});

// NEW FUNCTIONALITY: Calculate painted boxes versus blank pixels
function updatePixelStats() {
    const pixels = document.querySelectorAll('.pixel');
    let coloredCount = 0;

    pixels.forEach(pixel => {
        // If a pixel background is anything other than standard white, count it
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
    updatePixelStats(); // Clear text count back down to 0
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
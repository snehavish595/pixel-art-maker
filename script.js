const canvas = document.getElementById('canvas');
const colorPicker = document.getElementById('colorPicker');
const gridSizeSlider = document.getElementById('gridSize');
const sizeValueDisplay = document.getElementById('sizeValue');
const clearBtn = document.getElementById('clearBtn');
const downloadBtn = document.getElementById('downloadBtn');

let isDrawing = false;

// Initialize default grid size
createGrid(16);

function createGrid(size) {
    canvas.innerHTML = ''; 
    canvas.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    canvas.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    for (let i = 0; i < size * size; i++) {
        const pixel = document.createElement('div');
        pixel.classList.add('pixel');
        // Set explicit background color attribute so our exporter can read it safely
        pixel.style.backgroundColor = '#ffffff';

        pixel.addEventListener('mousedown', (e) => {
            isDrawing = true;
            pixel.style.backgroundColor = colorPicker.value;
        });

        pixel.addEventListener('mouseover', () => {
            if (isDrawing) {
                pixel.style.backgroundColor = colorPicker.value;
            }
        });

        canvas.appendChild(pixel);
    }
}

window.addEventListener('mouseup', () => {
    isDrawing = false;
});

gridSizeSlider.addEventListener('input', (e) => {
    const size = e.target.value;
    sizeValueDisplay.textContent = `${size} x ${size}`;
    createGrid(size);
});

clearBtn.addEventListener('click', () => {
    const pixels = document.querySelectorAll('.pixel');
    pixels.forEach(pixel => pixel.style.backgroundColor = '#ffffff');
});

// NEW FUNCTIONALITY: Download Art Logic
downloadBtn.addEventListener('click', () => {
    const size = parseInt(gridSizeSlider.value);
    const pixels = document.querySelectorAll('.pixel');
    
    // Create an internal, invisible virtual HTML5 canvas for processing
    const virtualCanvas = document.createElement('canvas');
    const ctx = virtualCanvas.getContext('2d');
    
    // Scale up the download file size so it looks sharp (e.g. 512x512 pixels)
    const exportSize = 512;
    virtualCanvas.width = exportSize;
    virtualCanvas.height = exportSize;
    
    const pixelScale = exportSize / size;

    // Read colors from our webpage grid and paint them onto our image file canvas
    pixels.forEach((pixel, index) => {
        const x = (index % size) * pixelScale;
        const y = Math.floor(index / size) * pixelScale;
        
        ctx.fillStyle = pixel.style.backgroundColor || '#ffffff';
        ctx.fillRect(x, y, pixelScale, pixelScale);
    });

    // Generate a temporary hidden link and click it automatically to prompt browser download
    const link = document.createElement('a');
    link.download = 'pixel-art.png';
    link.href = virtualCanvas.toDataURL('image/png');
    link.click();
});
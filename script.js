const canvas = document.getElementById('canvas');
const colorPicker = document.getElementById('colorPicker');
const gridSizeSlider = document.getElementById('gridSize');
const sizeValueDisplay = document.getElementById('sizeValue');
const clearBtn = document.getElementById('clearBtn');

let isDrawing = false;

// Initialize the default 16x16 grid
createGrid(16);

// Function to generate the grid dynamically
function createGrid(size) {
    canvas.innerHTML = ''; // Clear previous grid
    
    // Set CSS Grid template columns and rows dynamically
    canvas.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    canvas.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    for (let i = 0; i < size * size; i++) {
        const pixel = document.createElement('div');
        pixel.classList.add('pixel');

        // Event listener for a single click
        pixel.addEventListener('mousedown', () => {
            isDrawing = true;
            pixel.style.backgroundColor = colorPicker.value;
        });

        // Event listener for dragging/drawing while holding click
        pixel.addEventListener('mouseover', () => {
            if (isDrawing) {
                pixel.style.backgroundColor = colorPicker.value;
            }
        });

        canvas.appendChild(pixel);
    }
}

// Global mouseup event to stop drawing when user lets go of the mouse click
window.addEventListener('mouseup', () => {
    isDrawing = false;
});

// Update grid size dynamically when moving the slider
gridSizeSlider.addEventListener('input', (e) => {
    const size = e.target.value;
    sizeValueDisplay.textContent = `${size} x ${size}`;
    createGrid(size);
});

// Clear canvas functionality (resets all pixels to white)
clearBtn.addEventListener('click', () => {
    const pixels = document.querySelectorAll('.pixel');
    pixels.forEach(pixel => pixel.style.backgroundColor = '#ffffff');
});
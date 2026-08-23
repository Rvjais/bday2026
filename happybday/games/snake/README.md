# Snake Game - Mobile & Desktop Compatible

A responsive Snake game that works on both mobile and desktop devices with custom image support!

## Features

### 🎮 Cross-Platform Controls
- **Desktop**: Use arrow keys (↑ ↓ ← →) to control the snake
- **Mobile**: On-screen touch buttons appear automatically on smaller screens

### 🖼️ Custom Image Support
Replace the snake and food with your own images!

#### How to Use Images:

1. **Prepare Your Images**:
   - Place your image files in the `img/` folder
   - For circular snake segments, use circular PNG images with transparency
   - Recommended image size: 50x50 to 100x100 pixels

2. **Configure in Code** (js/index.js, lines 1-17):
```javascript
const imageConfig = {
    useImages: true,  // Set to true to enable images

    snakeHead: 'img/snake-head.png',  // Path to snake head image
    snakeBody: 'img/snake-body.png',  // Path to snake body image
    food: 'img/food.png'              // Path to food image
};
```

3. **Image Examples**:
   - Snake head: Use a circular image with eyes/face
   - Snake body: Use a simple circular image or scale pattern
   - Food: Use apple, cherry, or any food item image

### 📱 Responsive Design
- Automatically adapts to screen size
- Mobile controls only visible on screens < 768px wide
- Optimized touch targets for mobile devices

### 🎯 Difficulty Levels
- **Easy**: Slower snake speed
- **Medium**: Moderate speed (default)
- **Hard**: Faster snake speed

## File Structure
```
SnakeGame/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # Styling with responsive design
├── js/
│   └── index.js        # Game logic with image support
├── img/                # Place your custom images here
│   ├── bg.jpg          # Background image
│   ├── snake-head.png  # (Add your snake head image)
│   ├── snake-body.png  # (Add your snake body image)
│   └── food.png        # (Add your food image)
└── music/              # Game sounds
```

## Quick Start

1. **Default Mode (No Images)**:
   - Just open `index.html` in your browser
   - Snake uses colored blocks

2. **With Custom Images**:
   - Add your images to the `img/` folder
   - Edit `js/index.js` lines 6-16
   - Set `useImages: true`
   - Update image paths to match your files
   - Refresh the browser

## Tips for Best Results

- Use PNG images with transparency for circular snake segments
- Keep image file sizes small (< 100KB) for better performance
- Use consistent image sizes for all snake body segments
- Test on both mobile and desktop for best experience

## Controls

### Desktop
- **Arrow Keys**: Move the snake
- **Difficulty Buttons**: Change game speed

### Mobile
- **Touch Buttons**: Four directional buttons at the bottom
- **Difficulty Buttons**: Tap to change speed

## Browser Compatibility
- Chrome (Recommended)
- Firefox
- Safari
- Edge

## Credits
Created by Veer - Enhanced with mobile support and image customization

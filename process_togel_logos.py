#!/usr/bin/env python3
"""
Process Togel logos:
- Singapore: Change black/gray text to white, remove white background
- Taiwan: Remove white background (keep red text)
- Sidney: Change gray text to white, remove white background
"""

from PIL import Image
import numpy as np
from collections import deque

def flood_fill_transparent(img_array, alpha, start_x, start_y, tolerance=30):
    """Flood fill from a starting point, making pixels transparent."""
    h, w = img_array.shape[:2]
    visited = np.zeros((h, w), dtype=bool)
    queue = deque([(start_x, start_y)])
    
    # Get the starting color
    start_color = img_array[start_y, start_x, :3]
    
    while queue:
        x, y = queue.popleft()
        
        if x < 0 or x >= w or y < 0 or y >= h:
            continue
        if visited[y, x]:
            continue
        if alpha[y, x] == 0:
            continue
            
        # Check if pixel is similar to start color (white/near-white)
        pixel_color = img_array[y, x, :3]
        diff = np.abs(pixel_color.astype(int) - start_color.astype(int))
        
        if np.all(diff < tolerance):
            visited[y, x] = True
            alpha[y, x] = 0  # Make transparent
            
            # Add neighbors
            queue.extend([(x+1, y), (x-1, y), (x, y+1), (x, y-1)])
    
    return alpha

def process_singapore_logo(input_path, output_path):
    """Process Singapore Pools logo - change POOLS (black/gray) to white, remove bg."""
    img = Image.open(input_path).convert('RGBA')
    img_array = np.array(img)
    
    h, w = img_array.shape[:2]
    
    # Create alpha channel
    alpha = img_array[:, :, 3].copy()
    
    # Flood fill from corners to remove white background
    for start_x, start_y in [(0, 0), (w-1, 0), (0, h-1), (w-1, h-1)]:
        alpha = flood_fill_transparent(img_array, alpha, start_x, start_y, tolerance=40)
    
    # Also flood fill from edges
    for x in range(0, w, 10):
        alpha = flood_fill_transparent(img_array, alpha, x, 0, tolerance=40)
        alpha = flood_fill_transparent(img_array, alpha, x, h-1, tolerance=40)
    for y in range(0, h, 10):
        alpha = flood_fill_transparent(img_array, alpha, 0, y, tolerance=40)
        alpha = flood_fill_transparent(img_array, alpha, w-1, y, tolerance=40)
    
    # Change dark pixels (black/gray text "POOLS") to white
    # Keep blue pixels (SINGAPORE and the S logo)
    for y in range(h):
        for x in range(w):
            if alpha[y, x] > 0:  # Only process non-transparent pixels
                r, g, b = img_array[y, x, :3]
                
                # Check if pixel is dark (black/gray) - not blue
                # Blue has high B value relative to R
                is_blue = b > 150 and b > r + 30
                is_dark = r < 120 and g < 120 and b < 120
                
                if is_dark and not is_blue:
                    # Change to white
                    img_array[y, x, 0] = 255  # R
                    img_array[y, x, 1] = 255  # G
                    img_array[y, x, 2] = 255  # B
    
    img_array[:, :, 3] = alpha
    result = Image.fromarray(img_array)
    result.save(output_path)
    print(f"Processed Singapore logo saved to {output_path}")

def process_taiwan_logo(input_path, output_path):
    """Process Taiwan Lottery logo - remove white background, keep red text and flag."""
    img = Image.open(input_path).convert('RGBA')
    img_array = np.array(img)
    
    h, w = img_array.shape[:2]
    
    # Create alpha channel
    alpha = img_array[:, :, 3].copy()
    
    # Flood fill from corners and edges to remove white background
    for start_x, start_y in [(0, 0), (w-1, 0), (0, h-1), (w-1, h-1)]:
        alpha = flood_fill_transparent(img_array, alpha, start_x, start_y, tolerance=35)
    
    # Flood fill from edges
    for x in range(0, w, 5):
        alpha = flood_fill_transparent(img_array, alpha, x, 0, tolerance=35)
        alpha = flood_fill_transparent(img_array, alpha, x, h-1, tolerance=35)
    for y in range(0, h, 5):
        alpha = flood_fill_transparent(img_array, alpha, 0, y, tolerance=35)
        alpha = flood_fill_transparent(img_array, alpha, w-1, y, tolerance=35)
    
    img_array[:, :, 3] = alpha
    result = Image.fromarray(img_array)
    result.save(output_path)
    print(f"Processed Taiwan logo saved to {output_path}")

def process_sidney_logo(input_path, output_path):
    """Process Sidney/Sydney Pools logo - change gray text to white, remove bg."""
    img = Image.open(input_path).convert('RGBA')
    img_array = np.array(img)
    
    h, w = img_array.shape[:2]
    
    # Create alpha channel
    alpha = img_array[:, :, 3].copy()
    
    # Flood fill from corners to remove white/light background
    for start_x, start_y in [(0, 0), (w-1, 0), (0, h-1), (w-1, h-1)]:
        alpha = flood_fill_transparent(img_array, alpha, start_x, start_y, tolerance=25)
    
    # Flood fill from edges
    for x in range(0, w, 5):
        alpha = flood_fill_transparent(img_array, alpha, x, 0, tolerance=25)
        alpha = flood_fill_transparent(img_array, alpha, x, h-1, tolerance=25)
    for y in range(0, h, 5):
        alpha = flood_fill_transparent(img_array, alpha, 0, y, tolerance=25)
        alpha = flood_fill_transparent(img_array, alpha, w-1, y, tolerance=25)
    
    # Change gray text "SYDNEY POOLS" to white
    for y in range(h):
        for x in range(w):
            if alpha[y, x] > 0:  # Only process non-transparent pixels
                r, g, b = img_array[y, x, :3]
                
                # Check if pixel is gray (text at bottom)
                # Gray pixels have similar R, G, B values and are dark
                is_gray = abs(int(r) - int(g)) < 30 and abs(int(g) - int(b)) < 30 and r < 180
                
                # Don't change orange/yellow pixels (the main logo)
                is_orange = r > 180 and g > 100 and g < 200 and b < 100
                is_yellow = r > 200 and g > 200 and b < 150
                
                if is_gray and not is_orange and not is_yellow:
                    # Change to white
                    img_array[y, x, 0] = 255  # R
                    img_array[y, x, 1] = 255  # G
                    img_array[y, x, 2] = 255  # B
    
    img_array[:, :, 3] = alpha
    result = Image.fromarray(img_array)
    result.save(output_path)
    print(f"Processed Sidney logo saved to {output_path}")

if __name__ == '__main__':
    import os
    
    base_path = '/Users/kotrel/Documents/MyProject/test-SM101/src/assets2'
    
    # Process Singapore
    process_singapore_logo(
        os.path.join(base_path, 'singapore.jpeg'),
        os.path.join(base_path, 'singapore-processed.png')
    )
    
    # Process Taiwan
    process_taiwan_logo(
        os.path.join(base_path, 'taiwan.png'),
        os.path.join(base_path, 'taiwan-processed.png')
    )
    
    # Process Sidney
    process_sidney_logo(
        os.path.join(base_path, 'sidney.jpeg'),
        os.path.join(base_path, 'sidney-processed.png')
    )
    
    print("\nAll logos processed!")

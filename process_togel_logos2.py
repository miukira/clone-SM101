#!/usr/bin/env python3
"""
Process Togel logos - remove white bg and change dark text to white
"""

from PIL import Image
import numpy as np
from collections import deque

def flood_fill_transparent(img_array, alpha, start_x, start_y, tolerance=30):
    """Flood fill from a starting point, making pixels transparent."""
    h, w = img_array.shape[:2]
    visited = np.zeros((h, w), dtype=bool)
    queue = deque([(start_x, start_y)])
    
    start_color = img_array[start_y, start_x, :3]
    
    while queue:
        x, y = queue.popleft()
        
        if x < 0 or x >= w or y < 0 or y >= h:
            continue
        if visited[y, x]:
            continue
        if alpha[y, x] == 0:
            continue
            
        pixel_color = img_array[y, x, :3]
        diff = np.abs(pixel_color.astype(int) - start_color.astype(int))
        
        if np.all(diff < tolerance):
            visited[y, x] = True
            alpha[y, x] = 0
            queue.extend([(x+1, y), (x-1, y), (x, y+1), (x, y-1)])
    
    return alpha

def process_logo(input_path, output_path, change_dark_to_white=True, dark_threshold=150):
    """Process logo - remove white bg and optionally change dark text to white."""
    img = Image.open(input_path).convert('RGBA')
    img_array = np.array(img)
    
    h, w = img_array.shape[:2]
    alpha = img_array[:, :, 3].copy()
    
    # Flood fill from corners and edges to remove white background
    for start_x, start_y in [(0, 0), (w-1, 0), (0, h-1), (w-1, h-1)]:
        alpha = flood_fill_transparent(img_array, alpha, start_x, start_y, tolerance=40)
    
    for x in range(0, w, 5):
        alpha = flood_fill_transparent(img_array, alpha, x, 0, tolerance=40)
        alpha = flood_fill_transparent(img_array, alpha, x, h-1, tolerance=40)
    for y in range(0, h, 5):
        alpha = flood_fill_transparent(img_array, alpha, 0, y, tolerance=40)
        alpha = flood_fill_transparent(img_array, alpha, w-1, y, tolerance=40)
    
    if change_dark_to_white:
        # Change dark/gray pixels to white
        for y in range(h):
            for x in range(w):
                if alpha[y, x] > 0:
                    r, g, b = int(img_array[y, x, 0]), int(img_array[y, x, 1]), int(img_array[y, x, 2])
                    
                    # Check if pixel is dark/gray (not colorful)
                    is_gray = abs(r - g) < 40 and abs(g - b) < 40
                    is_dark = r < dark_threshold and g < dark_threshold and b < dark_threshold
                    
                    # Skip blue pixels (Singapore logo)
                    is_blue = b > 150 and b > r + 20
                    # Skip red pixels (Taiwan LOTTERY text)
                    is_red = r > 180 and r > g + 50 and r > b + 50
                    # Skip orange/yellow pixels (Sidney logo)
                    is_orange = r > 180 and g > 80 and g < 200 and b < 100
                    is_yellow = r > 200 and g > 180 and b < 150
                    
                    if is_dark and is_gray and not is_blue and not is_red and not is_orange and not is_yellow:
                        img_array[y, x, 0] = 255
                        img_array[y, x, 1] = 255
                        img_array[y, x, 2] = 255
    
    img_array[:, :, 3] = alpha
    result = Image.fromarray(img_array)
    result.save(output_path)
    print(f"Processed: {output_path}")

if __name__ == '__main__':
    import os
    
    base_path = '/Users/kotrel/Documents/MyProject/test-SM101/src/assets2'
    
    # Process Singapore - change POOLS (dark gray) to white
    process_logo(
        os.path.join(base_path, 'erasebg-transformed (7).png'),
        os.path.join(base_path, 'singapore-final.png'),
        change_dark_to_white=True,
        dark_threshold=130
    )
    
    # Process Taiwan - just remove white bg (LOTTERY is red, keep it)
    process_logo(
        os.path.join(base_path, 'taiwan.png'),
        os.path.join(base_path, 'taiwan-final.png'),
        change_dark_to_white=False
    )
    
    # Process Sidney - change gray text to white
    process_logo(
        os.path.join(base_path, 'sidney.png'),
        os.path.join(base_path, 'sidney-final.png'),
        change_dark_to_white=True,
        dark_threshold=160
    )
    
    print("\nAll logos processed!")

#!/usr/bin/env python3
"""
Process Singapore logo - change all text (SINGAPORE and POOLS) to white
"""

from PIL import Image
import numpy as np

def process_singapore_logo(input_path, output_path):
    """Change all dark/colored text to white, keep the S logo blue."""
    img = Image.open(input_path).convert('RGBA')
    img_array = np.array(img)
    
    h, w = img_array.shape[:2]
    
    for y in range(h):
        for x in range(w):
            if img_array[y, x, 3] > 0:  # Only process non-transparent pixels
                r, g, b = int(img_array[y, x, 0]), int(img_array[y, x, 1]), int(img_array[y, x, 2])
                
                # Check if pixel is part of the blue S logo (keep it blue)
                is_bright_blue = b > 180 and b > r + 50
                
                # Check if pixel is dark gray/black (POOLS text) or blue text (SINGAPORE)
                is_dark = r < 150 and g < 150 and b < 200
                
                # Change text to white but keep the bright blue S logo
                if is_dark and not is_bright_blue:
                    img_array[y, x, 0] = 255  # R
                    img_array[y, x, 1] = 255  # G
                    img_array[y, x, 2] = 255  # B
    
    result = Image.fromarray(img_array)
    result.save(output_path)
    print(f"Processed: {output_path}")

if __name__ == '__main__':
    base_path = '/Users/kotrel/Documents/MyProject/test-SM101/src/assets2'
    
    process_singapore_logo(
        f'{base_path}/erasebg-transformed (7).png',
        f'{base_path}/singapore-white.png'
    )
    
    print("Done!")

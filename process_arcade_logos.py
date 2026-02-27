from PIL import Image
import os

assets_dir = '/Users/kotrel/Documents/MyProject/test-SM101/src/assets2'

def remove_white_background(input_path, output_path, threshold=240):
    """Remove white/light background from image"""
    img = Image.open(input_path).convert('RGBA')
    pixels = img.load()
    width, height = img.size
    
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            # Check if pixel is white or very light
            if r > threshold and g > threshold and b > threshold:
                pixels[x, y] = (r, g, b, 0)  # Make transparent
    
    img.save(output_path, 'PNG')
    print(f"Processed: {output_path}")

# Process Aviatrix logo (arclog1.png)
remove_white_background(
    os.path.join(assets_dir, 'arclog1.png'),
    os.path.join(assets_dir, 'arclog1-processed.png'),
    threshold=245
)

# Process King Midas logo (arclog2.jpeg)
remove_white_background(
    os.path.join(assets_dir, 'arclog2.jpeg'),
    os.path.join(assets_dir, 'arclog2-processed.png'),
    threshold=245
)

# Process SBOBET logo (arclog3.png)
remove_white_background(
    os.path.join(assets_dir, 'arclog3.png'),
    os.path.join(assets_dir, 'arclog3-processed.png'),
    threshold=245
)

print("Done processing arcade logos!")

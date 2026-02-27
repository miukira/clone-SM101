from PIL import Image
import os

assets_dir = '/Users/kotrel/Documents/MyProject/test-SM101/src/assets2'

def remove_bg_flood_fill(input_path, output_path):
    """Remove background using flood fill from edges - preserves white text inside"""
    img = Image.open(input_path).convert('RGBA')
    pixels = img.load()
    width, height = img.size
    
    # Track visited pixels
    visited = set()
    
    # Flood fill from edges - only remove white/light pixels connected to edge
    def is_light(r, g, b):
        return r > 240 and g > 240 and b > 240
    
    def flood_fill(start_x, start_y):
        stack = [(start_x, start_y)]
        while stack:
            x, y = stack.pop()
            if (x, y) in visited:
                continue
            if x < 0 or x >= width or y < 0 or y >= height:
                continue
            
            r, g, b, a = pixels[x, y]
            if not is_light(r, g, b):
                continue
                
            visited.add((x, y))
            pixels[x, y] = (r, g, b, 0)  # Make transparent
            
            # Add neighbors
            stack.extend([(x+1, y), (x-1, y), (x, y+1), (x, y-1)])
    
    # Start flood fill from all edges
    for x in range(width):
        flood_fill(x, 0)
        flood_fill(x, height - 1)
    for y in range(height):
        flood_fill(0, y)
        flood_fill(width - 1, y)
    
    img.save(output_path, 'PNG')
    print(f"Processed: {output_path}")

# Process Aviatrix logo - flood fill from edges
remove_bg_flood_fill(
    os.path.join(assets_dir, 'arclog1.png'),
    os.path.join(assets_dir, 'arclog1-processed.png')
)

# Process King Midas logo - flood fill from edges
remove_bg_flood_fill(
    os.path.join(assets_dir, 'arclog2.jpeg'),
    os.path.join(assets_dir, 'arclog2-processed.png')
)

# Process SBOBET logo - flood fill from edges
remove_bg_flood_fill(
    os.path.join(assets_dir, 'arclog3.png'),
    os.path.join(assets_dir, 'arclog3-processed.png')
)

print("Done! White text inside logos preserved.")

from PIL import Image

def convert_black_to_white(input_path, output_path):
    """Convert black/dark text to white while preserving other colors"""
    
    img = Image.open(input_path).convert("RGBA")
    pixels = img.load()
    w, h = img.size
    
    for x in range(w):
        for y in range(h):
            r, g, b, a = pixels[x, y]
            
            # Skip transparent pixels
            if a < 10:
                continue
            
            # Check if pixel is dark (black or near-black text)
            brightness = (r + g + b) / 3
            
            if brightness < 80:  # Dark pixel - likely black text
                # Convert to white
                pixels[x, y] = (255, 255, 255, a)
            elif brightness < 120:
                # Medium dark - make it lighter gray/white
                factor = 255 / max(brightness, 1)
                new_val = min(255, int(brightness * factor * 0.9))
                pixels[x, y] = (new_val, new_val, new_val, a)
    
    img.save(output_path, "PNG")
    print(f"Converted: {input_path} -> {output_path}")

# Process WM Casino logo
convert_black_to_white(
    'src/assets2/erasebg-transformed (1).png',
    'src/assets2/kasino2-processed.png'
)

# Process Gameplay Interactive logo
convert_black_to_white(
    'src/assets2/erasebg-transformed (3).png',
    'src/assets2/kasino14-processed.png'
)

print("Done!")

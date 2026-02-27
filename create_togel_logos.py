from PIL import Image, ImageDraw, ImageFont
import os

def create_gold_text_logo(text, output_path, width=400, height=100):
    """Create a gold metallic text logo with transparent background"""
    # Create transparent image
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Try to find a bold font
    font_size = 60
    font = None
    font_paths = [
        '/System/Library/Fonts/Supplemental/Arial Bold.ttf',
        '/System/Library/Fonts/Supplemental/Impact.ttf',
        '/System/Library/Fonts/Helvetica.ttc',
        '/Library/Fonts/Arial Bold.ttf',
    ]
    
    for fp in font_paths:
        if os.path.exists(fp):
            try:
                font = ImageFont.truetype(fp, font_size)
                break
            except:
                continue
    
    if font is None:
        font = ImageFont.load_default()
    
    # Get text bounding box
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    # Center the text
    x = (width - text_width) // 2
    y = (height - text_height) // 2 - bbox[1]
    
    # Create gold gradient effect by drawing multiple layers
    # Dark gold shadow
    draw.text((x+2, y+2), text, font=font, fill=(139, 101, 8, 200))
    
    # Main gold color with gradient simulation
    # Bottom layer - darker gold
    draw.text((x, y+1), text, font=font, fill=(184, 134, 11, 255))
    
    # Middle layer - medium gold  
    draw.text((x, y), text, font=font, fill=(218, 165, 32, 255))
    
    # Top highlight - bright gold/yellow
    # Create a subtle highlight effect
    highlight_img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    highlight_draw = ImageDraw.Draw(highlight_img)
    highlight_draw.text((x, y-1), text, font=font, fill=(255, 215, 0, 150))
    
    # Composite
    img = Image.alpha_composite(img, highlight_img)
    
    # Crop to content with padding
    # Find actual content bounds
    pixels = img.load()
    min_x, min_y, max_x, max_y = width, height, 0, 0
    for py in range(height):
        for px in range(width):
            if pixels[px, py][3] > 0:
                min_x = min(min_x, px)
                min_y = min(min_y, py)
                max_x = max(max_x, px)
                max_y = max(max_y, py)
    
    # Add padding
    padding = 10
    min_x = max(0, min_x - padding)
    min_y = max(0, min_y - padding)
    max_x = min(width, max_x + padding)
    max_y = min(height, max_y + padding)
    
    # Crop
    img = img.crop((min_x, min_y, max_x, max_y))
    
    img.save(output_path, 'PNG')
    print(f"Created: {output_path}")

def create_styled_gold_logo(text, output_path):
    """Create a more stylized gold logo similar to the SYDNEY reference"""
    width, height = 500, 120
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Try to find Impact or similar bold font
    font_size = 72
    font = None
    font_paths = [
        '/System/Library/Fonts/Supplemental/Impact.ttf',
        '/System/Library/Fonts/Supplemental/Arial Bold.ttf',
        '/System/Library/Fonts/Supplemental/Helvetica Bold.ttf',
        '/Library/Fonts/Arial Bold.ttf',
    ]
    
    for fp in font_paths:
        if os.path.exists(fp):
            try:
                font = ImageFont.truetype(fp, font_size)
                break
            except:
                continue
    
    if font is None:
        font = ImageFont.load_default()
    
    # Get text size
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    x = (width - text_width) // 2
    y = (height - text_height) // 2 - bbox[1]
    
    # Create layered gold effect
    # Layer 1: Dark outline/shadow
    for ox in range(-3, 4):
        for oy in range(-3, 4):
            if ox != 0 or oy != 0:
                draw.text((x+ox, y+oy), text, font=font, fill=(101, 67, 33, 100))
    
    # Layer 2: Dark gold base
    draw.text((x+1, y+2), text, font=font, fill=(139, 90, 43, 255))
    
    # Layer 3: Medium gold
    draw.text((x, y+1), text, font=font, fill=(184, 134, 11, 255))
    
    # Layer 4: Bright gold main
    draw.text((x, y), text, font=font, fill=(218, 165, 32, 255))
    
    # Layer 5: Top highlight (simulate 3D metallic)
    # Draw partial highlight on top portion
    highlight_img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    highlight_draw = ImageDraw.Draw(highlight_img)
    highlight_draw.text((x, y), text, font=font, fill=(255, 223, 0, 180))
    
    # Mask the highlight to only show on top half
    highlight_pixels = highlight_img.load()
    for py in range(height):
        for px in range(width):
            if py > y + text_height // 2:
                # Fade out in bottom half
                r, g, b, a = highlight_pixels[px, py]
                fade = max(0, 1 - (py - (y + text_height // 2)) / (text_height // 2))
                highlight_pixels[px, py] = (r, g, b, int(a * fade * 0.5))
    
    img = Image.alpha_composite(img, highlight_img)
    
    # Crop to content
    pixels = img.load()
    min_x, min_y, max_x, max_y = width, height, 0, 0
    for py in range(height):
        for px in range(width):
            if pixels[px, py][3] > 0:
                min_x = min(min_x, px)
                min_y = min(min_y, py)
                max_x = max(max_x, px)
                max_y = max(max_y, py)
    
    padding = 5
    min_x = max(0, min_x - padding)
    min_y = max(0, min_y - padding)
    max_x = min(width, max_x + padding)
    max_y = min(height, max_y + padding)
    
    img = img.crop((min_x, min_y, max_x, max_y))
    img.save(output_path, 'PNG')
    print(f"Created: {output_path}")

# Create logos for each togel market
logos = [
    ('SINGAPORE', 'src/assets2/logo-singapore.png'),
    ('KAMBOJA', 'src/assets2/logo-kamboja.png'),
    ('TAIWAN', 'src/assets2/logo-taiwan.png'),
    ('HONGKONG', 'src/assets2/logo-hongkong.png'),
    ('SIDNEY', 'src/assets2/logo-sidney.png'),
]

for text, path in logos:
    create_styled_gold_logo(text, path)

print("\nAll logos created!")

import json
import re
import sys
import os

import sys
import os
import types

# Create dummy parent modules
mock_reportlab = types.ModuleType('reportlab')
sys.modules['reportlab'] = mock_reportlab

mock_lib = types.ModuleType('reportlab.lib')
sys.modules['reportlab.lib'] = mock_lib
mock_reportlab.lib = mock_lib

# Nest page-sizes
mock_pagesizes = types.ModuleType('reportlab.lib.pagesizes')
sys.modules['reportlab.lib.pagesizes'] = mock_pagesizes
mock_lib.pagesizes = mock_pagesizes
mock_pagesizes.A4 = (595.27, 841.89)

# Nest colors
class MockColor:
    def __init__(self, *args, **kwargs): pass
mock_colors = types.ModuleType('reportlab.lib.colors')
sys.modules['reportlab.lib.colors'] = mock_colors
mock_lib.colors = mock_colors
mock_colors.HexColor = MockColor
mock_colors.white = MockColor()

# Nest styles
class MockStyle:
    def __init__(self, *args, **kwargs): pass
class MockStyleDict(dict):
    def __getitem__(self, key):
        return MockStyle()
mock_styles = types.ModuleType('reportlab.lib.styles')
sys.modules['reportlab.lib.styles'] = mock_styles
mock_lib.styles = mock_styles
mock_styles.getSampleStyleSheet = lambda: MockStyleDict()
mock_styles.ParagraphStyle = MockStyle

# Nest units
mock_units = types.ModuleType('reportlab.lib.units')
sys.modules['reportlab.lib.units'] = mock_units
mock_lib.units = mock_units
mock_units.mm = 1.0
mock_units.cm = 10.0

# Nest enums
mock_enums = types.ModuleType('reportlab.lib.enums')
sys.modules['reportlab.lib.enums'] = mock_enums
mock_lib.enums = mock_enums
mock_enums.TA_CENTER = 1
mock_enums.TA_LEFT = 0
mock_enums.TA_JUSTIFY = 4

# Nest platypus under reportlab
mock_platypus = types.ModuleType('reportlab.platypus')
sys.modules['reportlab.platypus'] = mock_platypus
mock_reportlab.platypus = mock_platypus

class MockDocTemplate:
    def __init__(self, *args, **kwargs): pass
    def build(self, *args, **kwargs): pass

class MockFlowable:
    def __init__(self, *args, **kwargs): pass

class MockTable(MockFlowable):
    def setStyle(self, *args, **kwargs): pass

mock_platypus.SimpleDocTemplate = MockDocTemplate
mock_platypus.Paragraph = MockFlowable
mock_platypus.Spacer = MockFlowable
mock_platypus.HRFlowable = MockFlowable
mock_platypus.Table = MockTable
mock_platypus.TableStyle = MockFlowable
mock_platypus.PageBreak = MockFlowable
mock_platypus.KeepTogether = MockFlowable
mock_platypus.BaseDocTemplate = MockDocTemplate
mock_platypus.Frame = MockFlowable
mock_platypus.PageTemplate = MockFlowable

# Mock os.path.getsize to prevent FileNotFoundError since PDF is not actually created
import os
os.path.getsize = lambda path: 1024 * 1024  # 1MB dummy size

# Ensure we can import from the root directory
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

try:
    from deities_archive import ALL_DEITIES
except ImportError as e:
    print(f"Error importing ALL_DEITIES: {e}")
    sys.exit(1)

def parse_coords(coord_str):
    if not coord_str or not isinstance(coord_str, str):
        return None
    # Look for patterns like "32.45° N, 76.53° E" or "32.45 N, 76.53 E"
    # Match decimal numbers followed by degree symbol/space and N/S/E/W
    matches = re.findall(r'(\d+\.?\d*)\s*°?\s*([NESWnesw])', coord_str)
    if len(matches) >= 2:
        lat_val = float(matches[0][0])
        lat_dir = matches[0][1].upper()
        lng_val = float(matches[1][0])
        lng_dir = matches[1][1].upper()
        
        lat = -lat_val if lat_dir == 'S' else lat_val
        lng = -lng_val if lng_dir == 'W' else lng_val
        return {"lat": lat, "lng": lng}
    return None

def main():
    converted = []
    for d in ALL_DEITIES:
        # Create a clean slug from name
        name = d.get("name", "")
        slug = name.lower().replace(" ", "-").replace("(", "").replace(")", "").replace("/", "-").replace("&", "and")
        slug = re.sub(r'[^a-z0-9\-]', '', slug)
        slug = re.sub(r'\-+', '-', slug).strip('-')

        # Parse coordinates
        coords = parse_coords(d.get("coordinates", ""))
        
        # Build description by combining history, architecture, and rituals if needed
        description_parts = []
        if d.get("history"):
            description_parts.append(d.get("history"))
        if d.get("architecture"):
            description_parts.append(f"Architecture: {d.get('architecture')}")
        if d.get("rituals"):
            description_parts.append(f"Rituals & Traditions: {d.get('rituals')}")
        
        description = "\n\n".join(description_parts) if description_parts else "[To be contributed by local community]"

        # Travel guide mapping
        travel_info = d.get("travel", {})
        transport = None
        if isinstance(travel_info, dict) and travel_info:
            transport = {
                "air": travel_info.get("airport") or travel_info.get("air"),
                "rail": travel_info.get("railway") or travel_info.get("rail"),
                "road": travel_info.get("road"),
                "trek": travel_info.get("trek") or travel_info.get("local") or travel_info.get("note")
            }
            # Remove keys with None values
            transport = {k: v for k, v in transport.items() if v}
            if not transport:
                transport = None

        item = {
            "id": d.get("entry_id") or f"{d.get('district', 'GEN')[:3].upper()}-{slug[:10].upper()}",
            "slug": slug,
            "name": name,
            "district": d.get("district"),
            "village": d.get("village") or d.get("location") or "",
            "state": "Himachal Pradesh",
            "category": "deity",
            "description": description,
            "origin_story": d.get("cultural_role") or d.get("key_inscription") or "",
            "gur_name": d.get("gur"),
            "kardar_name": d.get("kardar") or d.get("pujari"),
            "festivals": d.get("festivals"),
            "images": []
        }
        
        if coords:
            item["coordinates"] = coords
        if transport:
            item["transport"] = transport

        converted.append(item)

    # Output JSON file
    output_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../src/data/deities.json'))
    
    # Let's read existing deities first to preserve existing data or merge if there are duplicate IDs
    existing_deities = []
    if os.path.exists(output_path):
        try:
            with open(output_path, 'r', encoding='utf-8') as f:
                existing_deities = json.load(f)
        except Exception as e:
            print(f"Warning: could not read existing deities.json: {e}")

    # Build a lookup of existing deities by name/slug to preserve base64 images if they exist
    existing_by_slug = {d.get("slug"): d for d in existing_deities if d.get("slug")}
    existing_by_id = {d.get("id"): d for d in existing_deities if d.get("id")}

    for item in converted:
        # Check if we have an existing record to preserve images
        match = existing_by_id.get(item["id"]) or existing_by_slug.get(item["slug"])
        if match and match.get("images"):
            item["images"] = match["images"]

    # Also keep any existing deities that are NOT in the new list
    new_ids = {d["id"] for d in converted}
    merged_deities = converted.copy()
    for d in existing_deities:
        if d.get("id") not in new_ids:
            merged_deities.append(d)

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(merged_deities, f, indent=2, ensure_ascii=False)

    print(f"Successfully merged {len(converted)} deities from archive into {output_path} (Total database size: {len(merged_deities)} deities).")

if __name__ == '__main__':
    main()

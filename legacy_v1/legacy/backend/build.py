#!/usr/bin/env python3
"""
HIM-GATHA Python SSG
Reads TSV databases and generates index.html from index_template.html.
Equivalent to ssg.c but runs without compilation.
"""

import os, json

BACKEND = os.path.dirname(os.path.abspath(__file__))
ROOT    = os.path.dirname(BACKEND)

DEITY_FIELDS = ['id','name','district','village','history','image',
                'video','map','links','gurName','travelGuide','devKhel','oracleRecords',
                'kardar','pujari','bhandari','bajantris','chharidhar']

def read_tsv(path):
    rows = []
    with open(path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.rstrip('\n\r')
            if line.strip():
                rows.append(line.split('\t'))
    return rows

def load_deities():
    rows = read_tsv(os.path.join(BACKEND, 'kuldev_db.tsv'))
    deities = []
    for row in rows:
        d = {DEITY_FIELDS[i]: row[i] if i < len(row) else '' for i in range(len(DEITY_FIELDS))}
        deities.append(d)
    return deities

def load_slides():
    path = os.path.join(BACKEND, 'hero_slides.tsv')
    if not os.path.exists(path):
        return []
    rows = read_tsv(path)
    return [{'id': r[0], 'title': r[1], 'subtitle': r[2], 'imageUrl': r[3], 'deityId': r[4]}
            for r in rows if len(r) >= 5]

def load_events():
    path = os.path.join(BACKEND, 'events.tsv')
    if not os.path.exists(path):
        return []
    rows = read_tsv(path)
    return [{'deityId': r[0], 'eventName': r[1], 'date': r[2], 'description': r[3], 'location': r[4], 'map': r[5] if len(r)>5 else ''}
            for r in rows if len(r) >= 5]

def slides_html(slides):
    parts = []
    for i, s in enumerate(slides):
        cls = 'active' if i == 0 else ''
        parts.append(
            f'<div class="hero-slide {cls}" style="background-image:linear-gradient(to bottom,rgba(0,0,0,0.4),var(--bg-primary)),url(\'{s["imageUrl"]}\');">'
            f'<div class="absolute inset-0 flex items-center justify-center text-center p-6">'
            f'<div class="max-w-4xl space-y-6">'
            f'<h2 class="text-5xl md:text-7xl font-bold serif text-white leading-tight">{s["title"]}</h2>'
            f'<p class="text-white/60 text-lg md:text-xl font-light max-w-2xl mx-auto">{s["subtitle"]}</p>'
            f'<div class="pt-8 flex justify-center gap-4">'
            f'<button onclick="viewDetail(\'{s["deityId"]}\')" class="bg-amber-500 text-black px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-amber-400 transition-all">Explore Deity</button>'
            f'</div></div></div></div>'
        )
    return '\n'.join(parts)

def dots_html(slides):
    return '\n'.join(
        f'<div class="dot {"active" if i==0 else ""}" onclick="goToSlide({i})"></div>'
        for i in range(len(slides))
    )

def card_html(deities):
    parts = []
    for i, d in enumerate(deities):
        has_img = d['image'] and d['image'] not in ('', 'temple.png')
        img = (f'<img src="{d["image"]}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">'
               if has_img else
               '<div class="w-full h-full bg-gradient-to-br from-charcoal-800 to-black flex items-center justify-center"><span class="text-6xl text-white/5">🔱</span></div>')
        map_a = (f'<a href="{d["map"]}" target="_blank" class="text-white/40 hover:text-amber-400 transition-colors"><i class="fas fa-map-marker-alt"></i></a>'
                 if d['map'] else '')
        vid_a = (f'<a href="{d["video"]}" target="_blank" class="text-white/40 hover:text-red-500 transition-colors"><i class="fab fa-youtube"></i></a>'
                 if d['video'] else '')
        hist = d['history'][:250].replace('<', '&lt;').replace('>', '&gt;')
        delay = (i % 10) * 50
        parts.append(
            f'<div class="glass-card rounded-2xl overflow-hidden flex flex-col group relative cursor-pointer animate-fade-in-up" style="animation-delay:{delay}ms;" onclick="viewDetail(\'{d["id"]}\')">'
            f'<div class="h-56 bg-charcoal-900 flex items-center justify-center overflow-hidden relative">'
            f'{img}'
            f'<div class="absolute inset-0 bg-amber-500/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>'
            f'<div class="absolute top-4 left-4 z-10"><span class="text-[9px] font-bold text-amber-900 bg-amber-400 px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">{d["district"]}</span></div>'
            f'<div class="absolute top-4 right-4 z-10 flex gap-2">'
            f'<button onclick="event.stopPropagation();editEntry(\'{d["id"]}\')" class="w-8 h-8 rounded-full bg-black/50 text-white/60 hover:text-amber-400 flex items-center justify-center text-xs transition-all"><i class="fas fa-pen"></i></button>'
            f'<button onclick="event.stopPropagation();deleteEntry(\'{d["id"]}\')" class="w-8 h-8 rounded-full bg-black/50 text-white/60 hover:text-red-400 flex items-center justify-center text-xs transition-all"><i class="fas fa-trash"></i></button>'
            f'</div>'
            f'</div>'
            f'<div class="p-6 flex-1 flex flex-col relative z-10 -mt-6">'
            f'<div class="bg-charcoal-800 border border-white/5 p-4 rounded-xl flex-1 flex flex-col shadow-xl">'
            f'<div class="flex justify-between items-center mb-3">'
            f'<span class="text-[10px] font-mono text-amber-500/60 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">ID: {d["id"]}</span>'
            f'<div class="flex gap-2">{map_a}{vid_a}</div>'
            f'</div>'
            f'<h3 class="text-xl font-bold serif text-white mb-1 leading-tight group-hover:text-amber-400 transition-colors">{d["name"]}</h3>'
            f'<p class="text-[10px] font-medium text-white/50 uppercase tracking-widest mb-4 flex items-center gap-1.5"><i class="fas fa-location-dot text-amber-600"></i> {d["village"]}</p>'
            f'<p class="text-xs text-white/60 line-clamp-3 leading-relaxed font-light mt-auto border-t border-white/5 pt-4">{hist}</p>'
            f'</div></div></div>'
        )
    return '\n'.join(parts)

def deities_json(deities):
    return 'const initialDeities = ' + json.dumps(deities, ensure_ascii=False) + ';'

def events_json(events):
    return 'const initialEvents = ' + json.dumps(events, ensure_ascii=False) + ';'

def slides_json(slides):
    return 'const initialSlides = ' + json.dumps(slides, ensure_ascii=False) + ';'

def build():
    deities = load_deities()
    slides  = load_slides()
    events  = load_events()

    tpl_path = os.path.join(ROOT, 'index_template.html')
    out_path = os.path.join(ROOT, 'index.html')

    with open(tpl_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    output = []
    i = 0
    while i < len(lines):
        line = lines[i]

        if '<!-- SSR_HERO_START -->' in line:
            output.append(slides_html(slides) + '\n')
            i += 1
            while i < len(lines) and '<!-- SSR_HERO_END -->' not in lines[i]:
                i += 1

        elif '<!-- SSR_HERO_DOTS -->' in line:
            output.append(dots_html(slides) + '\n')

        elif '<!-- SSR_DEITIES_START -->' in line:
            output.append(card_html(deities) + '\n')
            i += 1
            while i < len(lines) and '<!-- SSR_DEITIES_END -->' not in lines[i]:
                i += 1

        elif 'SSR_DEITIES_JSON_START' in line:
            output.append('        ' + deities_json(deities) + '\n')
            output.append('        ' + events_json(events) + '\n')
            output.append('        ' + slides_json(slides) + '\n')
            i += 1
            while i < len(lines) and 'SSR_DEITIES_JSON_END' not in lines[i]:
                i += 1

        else:
            output.append(line)

        i += 1

    with open(out_path, 'w', encoding='utf-8') as f:
        f.writelines(output)

    print(f"[HIM-GATHA BUILD COMPLETE]")
    print(f"  Deities : {len(deities)}")
    print(f"  Slides  : {len(slides)}")
    print(f"  Output  : {out_path}")

if __name__ == '__main__':
    build()

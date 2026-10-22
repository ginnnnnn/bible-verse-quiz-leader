"""Fetch the passages used by this project from Bible Gateway's CUV text.

Only the reference snapshot is written. App content is never overwritten here.
The HTML's inter-character layout whitespace and verse-number markers are removed;
all Chinese characters, punctuation and parenthetical notes are preserved.
"""
import concurrent.futures
import hashlib
import json
import re
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import urlopen

ROOT = Path(__file__).resolve().parents[1]
BOOKS = {
    '創世記': ('Genesis', 'Gen'), '創世紀': ('Genesis', 'Gen'),
    '申命記': ('Deuteronomy', 'Deut'), '約書亞記': ('Joshua', 'Josh'),
    '約伯記': ('Job', 'Job'), '詩篇': ('Psalm', 'Ps'),
    '箴言': ('Proverbs', 'Prov'), '傳道書': ('Ecclesiastes', 'Eccl'),
    '以賽亞書': ('Isaiah', 'Isa'), '瑪拉基書': ('Malachi', 'Mal'),
    '馬太福音': ('Matthew', 'Matt'), '馬可福音': ('Mark', 'Mark'),
    '路加福音': ('Luke', 'Luke'), '約翰福音': ('John', 'John'),
    '羅馬書': ('Romans', 'Rom'), '哥林多前書': ('1 Corinthians', '1Cor'),
    '哥林多後書': ('2 Corinthians', '2Cor'), '加拉太書': ('Galatians', 'Gal'),
    '以弗所書': ('Ephesians', 'Eph'), '腓立比書': ('Philippians', 'Phil'),
    '歌羅西書': ('Colossians', 'Col'), '提摩太前書': ('1 Timothy', '1Tim'),
    '提摩太後書': ('2 Timothy', '2Tim'), '希伯來書': ('Hebrews', 'Heb'),
    '雅各書': ('James', 'Jas'), '彼得前書': ('1 Peter', '1Pet'),
}

class VerseParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []
        self.verses = {}

    def handle_starttag(self, tag, attrs):
        if tag in {'br', 'hr', 'img', 'input', 'meta', 'link', 'source', 'wbr'}:
            return
        attrs = dict(attrs)
        classes = attrs.get('class', '').split()
        verse_key = None
        if tag == 'span' and 'text' in classes:
            verse_key = next((c for c in classes if re.fullmatch(r'[1-3]?[A-Za-z]+-\d+-\d+', c)), None)
        excluded = tag == 'sup' or any(c in classes for c in ['footnote', 'crossreference', 'versenum', 'chapternum'])
        self.stack.append((tag, verse_key, excluded))

    def handle_endtag(self, tag):
        for index in range(len(self.stack) - 1, -1, -1):
            if self.stack[index][0] == tag:
                self.stack = self.stack[:index]
                break

    def handle_data(self, data):
        if any(excluded for _, _, excluded in self.stack):
            return
        key = next((key for _, key, _ in reversed(self.stack) if key), None)
        if key:
            self.verses[key] = self.verses.get(key, '') + data

    def result(self):
        return {key: re.sub(r'\s+', '', value) for key, value in self.verses.items()}


def parse_reference(reference):
    match = re.fullmatch(r'(.+?)\s*(\d+):(\d+)(?:-(\d+))?', reference.strip())
    if not match:
        return None
    book, chapter, first, last = match.groups()
    english, code = BOOKS[book]
    book = '創世記' if book == '創世紀' else book
    chapter, first, last = int(chapter), int(first), int(last or first)
    normalized = f'{book} {chapter}:{first}' + (f'-{last}' if first != last else '')
    return normalized, english, code, chapter, first, last


def fetch_passage(item):
    reference, english, code, chapter, first, last = item
    passage = f'{english} {chapter}:{first}' + (f'-{last}' if first != last else '')
    url = 'https://www.biblegateway.com/passage/?' + urlencode({'search': passage, 'version': 'CUV'})
    with urlopen(url, timeout=30) as response:
        html = response.read().decode('utf-8')
    parser = VerseParser()
    parser.feed(html)
    parsed = parser.result()
    expected_keys = [f'{code}-{chapter}-{verse}' for verse in range(first, last + 1)]
    if set(parsed) != set(expected_keys):
        raise ValueError(f'{reference}: expected {expected_keys}, received {list(parsed)}')
    verses = [{'number': verse, 'text': parsed[f'{code}-{chapter}-{verse}']} for verse in range(first, last + 1)]
    if any(not v['text'] or re.search(r'[A-Za-z<>]', v['text']) for v in verses):
        raise ValueError(f'{reference}: invalid or empty parsed verse')
    text = ''.join(v['text'] for v in verses)
    print(f'FETCHED {reference} ({len(verses)} 節)', flush=True)
    return reference, {'url': url, 'verses': verses, 'text': text, 'sha256': hashlib.sha256(text.encode()).hexdigest()}


def main():
    passages = {}
    for filename in ['studentScriptures.json', 'scriptures.json']:
        for card in json.loads((ROOT / 'src/data' / filename).read_text()):
            reference = card['reference']
            item = parse_reference(reference['zh'] if isinstance(reference, dict) else reference)
            if item:
                passages[item[0]] = item
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
        fetched = dict(executor.map(fetch_passage, passages.values()))
    result = {
        'version': '繁體和合本（神版）', 'sourceCode': 'CUV',
        'publisherUrl': 'https://www.biblegateway.com/versions/Chinese-Union-Version-Traditional-CUV/',
        'retrievedAt': datetime.now(timezone.utc).isoformat(),
        'normalization': '僅移除來源排版用的空白、節號與註腳連結；保留所有中文字、標點與括注。跨節直接串接，不改寫文字。',
        'passages': fetched,
    }
    target = ROOT / 'verification/cuv-passages.json'
    target.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(f'SAVED {len(fetched)} passages to {target}', flush=True)

if __name__ == '__main__':
    main()

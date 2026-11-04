// Dependency-free source checks for this starter. Run Jekyll for authoritative
// Liquid/YAML rendering; the small YAML reader below supports this repo's subset.
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Script, runInNewContext } from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = file => readFileSync(join(root, file), 'utf8');
const required = [
  '_config.yml', 'Gemfile', '.gitignore', 'index.md', 'publications.md',
  'tech.md', 'life.md', 'WRITING_GUIDE.md', '_data/publications.yml',
  '_layouts/default.html', '_layouts/post.html', '_includes/header.html',
  '_includes/footer.html', '_includes/figure.html', '_includes/gif_video.html',
  '_posts/2026-03-01-sample-tech-post.md',
  '_posts/2026-03-02-sample-entertainment-post.md',
  'assets/css/style.css', 'assets/js/main.js', 'assets/images/.keep'
];
required.forEach(file => assert.ok(existsSync(join(root, file)), `Missing ${file}`));

function scalar(value) {
  const text = value.trim().replace(/\s+#.*$/, '');
  if (!text) return null;
  if (text.startsWith('"')) return JSON.parse(text);
  if (text.startsWith("'")) {
    assert.ok(text.endsWith("'"), `Unclosed YAML quote: ${text}`);
    return text.slice(1, -1).replace(/''/g, "'");
  }
  if (text.startsWith('[')) {
    assert.ok(text.endsWith(']'), `Unclosed YAML array: ${text}`);
    return text.slice(1, -1).split(',').map(item => scalar(item)).filter(item => item !== null);
  }
  if (text === 'true') return true;
  if (text === 'false') return false;
  if (text === 'null' || text === '~') return null;
  if (/^-?\d+$/.test(text)) return Number(text);
  assert.ok(!/:\s/.test(text), `Quote YAML values containing ': ': ${text}`);
  return text;
}

function yamlSubset(source) {
  const lines = source.replace(/\r/g, '').split('\n');
  assert.ok(!lines.some(line => /^\s*\t/.test(line)), 'Tabs in YAML indentation');
  let index = 0;
  const indentation = line => line.match(/^ */)[0].length;
  function skip() { while (index < lines.length && /^\s*(?:#.*)?$/.test(lines[index])) index++; }
  function block(indent) {
    skip();
    const sequence = lines[index]?.slice(indent).startsWith('- ');
    const result = sequence ? [] : {};
    while (index < lines.length) {
      skip();
      if (index >= lines.length || indentation(lines[index]) < indent) break;
      assert.equal(indentation(lines[index]), indent, `Unexpected indentation at YAML line ${index + 1}`);
      let text = lines[index++].slice(indent);
      let target = result;
      let fieldIndent = indent;
      if (sequence) {
        assert.ok(text.startsWith('- '), `Expected YAML sequence at line ${index}`);
        text = text.slice(2);
        if (!/^[\w-]+\s*:/.test(text)) { result.push(scalar(text)); continue; }
        target = {}; result.push(target); fieldIndent += 2;
      }
      function field(raw, parentIndent) {
        const match = raw.match(/^([\w-]+):(?:\s+(.*))?$/);
        assert.ok(match, `Unsupported or malformed YAML line: ${raw}`);
        const [, key, value = ''] = match;
        assert.ok(!Object.hasOwn(target, key), `Duplicate YAML key: ${key}`);
        if (/^[|>][-+]?$/.test(value)) {
          const chunks = [];
          while (index < lines.length && (!lines[index].trim() || indentation(lines[index]) > parentIndent)) chunks.push(lines[index++].slice(parentIndent + 2));
          target[key] = value.startsWith('>') ? chunks.join(' ').trim() : chunks.join('\n').trimEnd() + '\n';
        } else if (value && !value.startsWith('#')) target[key] = scalar(value);
        else {
          skip();
          target[key] = index < lines.length && indentation(lines[index]) > parentIndent ? block(indentation(lines[index])) : null;
        }
      }
      field(text, fieldIndent);
      if (sequence) {
        skip();
        while (index < lines.length && indentation(lines[index]) > indent) {
          assert.equal(indentation(lines[index]), fieldIndent, `Invalid sequence indentation at line ${index + 1}`);
          field(lines[index++].slice(fieldIndent), fieldIndent);
          skip();
        }
      }
    }
    return result;
  }
  skip();
  return block(0);
}

const config = yamlSubset(read('_config.yml'));
assert.equal(config.markdown, 'kramdown');
assert.equal(config.highlighter, 'rouge');
assert.equal(config.kramdown.math_engine, null);
assert.equal(config.permalink, '/blog/:year/:month/:day/:title/');
const papers = yamlSubset(read('_data/publications.yml'));
assert.ok(Array.isArray(papers));
for (const paper of papers) {
  for (const key of ['title', 'authors', 'venue', 'year', 'tags', 'pdf', 'code', 'abstract', 'bibtex']) assert.ok(Object.hasOwn(paper, key), `Missing paper.${key}`);
  assert.ok(Array.isArray(paper.tags) && paper.tags.every(tag => typeof tag === 'string' && tag !== 'All' && !tag.includes(',')));
  assert.equal(typeof paper.year, 'number');
}

const files = [...['index.md', 'publications.md', 'tech.md', 'life.md', '404.html'],
  ...['_layouts', '_includes', '_posts'].flatMap(dir => readdirSync(join(root, dir)).map(name => `${dir}/${name}`))];
const pages = new Set(['/']);
for (const file of files) {
  const source = read(file);
  let body = source;
  if (!file.startsWith('_includes/') && file !== '_layouts/default.html') {
    const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
    assert.ok(match, `Missing front matter: ${file}`);
    const front = yamlSubset(match[1]);
    body = source.slice(match[0].length);
    if (front.permalink) pages.add(front.permalink);
    if (file.startsWith('_posts/')) {
      assert.ok(['tech', 'life'].includes(front.category), `Unknown post category: ${file}`);
      assert.ok(Array.isArray(front.tags), `Post tags must be an array: ${file}`);
      const name = file.match(/(\d{4})-(\d{2})-(\d{2})-(.+)\.md$/);
      assert.ok(name, `Invalid post filename: ${file}`);
      pages.add(`/blog/${name[1]}/${name[2]}/${name[3]}/${name[4]}/`);
    }
  }
  const stack = [];
  for (const match of body.matchAll(/{%\s*([\s\S]*?)\s*%}/g)) {
    const tag = match[1].trim().split(/\s/)[0];
    if (['if', 'unless', 'for', 'capture', 'case', 'comment', 'raw'].includes(tag)) stack.push(tag);
    else if (tag.startsWith('end')) assert.equal(stack.pop(), tag.slice(3), `Unbalanced Liquid ${tag} in ${file}`);
    else if (tag === 'else' || tag === 'elsif') assert.ok(['if', 'unless', 'case', 'for'].includes(stack.at(-1)), `Orphan Liquid ${tag}: ${file}`);
    else if (tag === 'include') {
      const include = match[1].trim().split(/\s/)[1];
      assert.ok(existsSync(join(root, '_includes', include)), `Missing include ${include} in ${file}`);
    } else assert.ok(['assign', 'break', 'continue'].includes(tag), `Unrecognized Liquid tag: ${tag} in ${file}`);
  }
  assert.equal(stack.length, 0, `Unclosed Liquid block: ${file}`);
  assert.equal((body.match(/{{/g) || []).length, (body.match(/}}/g) || []).length, `Unbalanced Liquid output in ${file}`);
}

let references = 0;
for (const file of files) {
  for (const match of read(file).matchAll(/['"](\/(?!\/)[a-zA-Z0-9_./-]+)['"]/g)) {
    const path = match[1];
    assert.ok(pages.has(path) || existsSync(join(root, path.slice(1))), `Unresolved local reference ${path} in ${file}`);
    references++;
  }
}

// Exercise public interaction behavior in a small DOM fixture.
class Element {
  constructor(dataset = {}) {
    this.dataset = dataset; this.hidden = false; this.open = false;
    this.attrs = {}; this.listeners = {}; this.textContent = '';
    const classes = new Set();
    this.classList = { add: x => classes.add(x), remove: x => classes.delete(x), toggle: (x, state) => state ? classes.add(x) : classes.delete(x), contains: x => classes.has(x) };
  }
  setAttribute(key, value) { this.attrs[key] = value; }
  hasAttribute(key) { return Object.hasOwn(this.attrs, key); }
  removeAttribute(key) { delete this.attrs[key]; }
  addEventListener(name, callback) { this.listeners[name] = callback; }
  click() { this.listeners.click?.({ target: this }); }
  closest() { return null; }
}
const buttons = ['All', 'LLM', 'RL', 'Systems'].map(filter => new Element({ filter }));
const status = new Element();
const tools = new Element(); tools.hidden = true;
tools.querySelectorAll = () => buttons; tools.querySelector = () => status;
const fixturePapers = [['LLM', 'RL'], ['LLM', 'Systems'], ['RL']].map(tags => {
  const element = new Element({ tags: JSON.stringify(tags) });
  element.drawers = [new Element(), new Element()];
  element.querySelectorAll = () => element.drawers.filter(drawer => drawer.open);
  return element;
});
const drawers = fixturePapers.flatMap(paper => paper.drawers);
const toggles = drawers.map((drawer, i) => {
  drawer.summary = new Element(); drawer.querySelector = () => drawer.summary;
  return new Element({ drawerToggle: String(i) });
});
const content = new Element(), image = new Element(); image.alt = 'Test landscape';
const video = new Element(); video.paused = true;
video.play = () => { video.paused = false; return Promise.resolve(); };
video.pause = () => { video.paused = true; };
let mathOptions, zoomOpened = false, zoomCallbacks = {}, reduced = false;
const motion = { get matches() { return reduced; }, addEventListener(name, callback) { this.onChange = callback; } };
const document = {
  readyState: 'complete', body: { dataset: { math: 'true' } },
  getElementById: id => drawers[Number(id)],
  querySelector: selector => selector === '[data-publication-tools]' ? tools : selector === '.post-content' ? content : null,
  querySelectorAll: selector => ({
    '[data-drawer-toggle]': toggles, '.publication[data-tags]': fixturePapers,
    '.post-content img': [image], '.post-content video[autoplay]': [video]
  }[selector] || [])
};
const window = {
  matchMedia: () => motion,
  renderMathInElement: (target, options) => { assert.equal(target, content); mathOptions = options; },
  mediumZoom: () => ({ open: () => { zoomOpened = true; }, on: (name, callback) => { zoomCallbacks[name] = callback; } })
};
const javascript = read('assets/js/main.js');
new Script(javascript, { filename: 'main.js' });
runInNewContext(javascript, { document, window });
assert.equal(tools.hidden, false);
buttons[1].click();
assert.deepEqual(fixturePapers.map(p => p.hidden), [false, false, true]);
assert.equal(buttons[1].attrs['aria-pressed'], 'true');
assert.equal(status.textContent, '2 publications · LLM');
toggles[0].click(); toggles[1].click();
assert.ok(drawers[0].open && drawers[1].open, 'Drawers should open independently');
toggles[0].click(); assert.equal(drawers[0].open, false);
buttons[3].click(); assert.equal(drawers[1].open, false, 'Filtering should close hidden drawers');
assert.deepEqual(fixturePapers.map(p => p.hidden), [true, false, true]);
assert.equal(status.textContent, '1 publication · Systems');
buttons[0].click(); assert.ok(fixturePapers.every(p => !p.hidden));
assert.equal(mathOptions.delimiters[0].left, '$$');
assert.equal(mathOptions.delimiters[1].left, '$');
assert.ok(mathOptions.ignoredTags.includes('code'));
assert.equal(video.paused, false, 'Video should attempt muted autoplay');
image.listeners.keydown({ key: 'Enter', preventDefault() {} }); assert.ok(zoomOpened);
zoomCallbacks.open({ target: image }); assert.equal(image.attrs['aria-expanded'], 'true');
zoomCallbacks.closed({ target: image }); assert.equal(image.attrs['aria-expanded'], 'false');
reduced = true; motion.onChange();
assert.equal(video.paused, true, 'Reduced motion should pause autoplay');
assert.equal(video.hasAttribute('autoplay'), false);
buttons[1].click(); buttons[0].click();
assert.ok(fixturePapers.every(p => !p.classList.contains('is-entering')));
// Missing CDN globals should leave all other enhancements usable.
runInNewContext(javascript, { document, window: { matchMedia: () => motion } });

const gif = readFileSync(join(root, 'assets/images/demo.gif'));
assert.equal(gif.subarray(0, 6).toString(), 'GIF89a');
assert.equal(gif.at(-1), 0x3b);
console.log(`Passed: ${required.length} required files; ${files.length} template/front-matter checks; ${references} local references.`);
console.log('Passed: publication filters, drawer toggles, math options, keyboard image zoom, reduced-motion video/filtering, and missing-CDN fallback.');
console.log('Not checked here: native Jekyll rendering, full YAML/Liquid grammar, CDN delivery, or browser layout.');

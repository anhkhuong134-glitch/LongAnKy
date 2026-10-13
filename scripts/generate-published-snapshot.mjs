import fs from 'fs';

const rawPath = fs.existsSync('temp_doc.txt') ? 'temp_doc.txt' : 'src/data/google_doc_raw.txt';
const raw = fs.readFileSync(rawPath, 'utf8');
const lines = raw.split(/\r?\n/);
const pIdx = lines.findIndex(l => l.trim().startsWith('PHẦN I'));
const banCuIdx = lines.findIndex(l => l.trim().startsWith('BẢN CŨ'));
const dossierIdx = lines.findIndex(l => /^[0-9]{2}\./.test(l.trim()) || l.trim().startsWith('LONG ẤN KÝ — HỒ SƠ'));

// 1. Prologue
const prologueLines = lines.slice(0, pIdx !== -1 ? pIdx : 0).map(l => l.trim()).filter(Boolean);
const prologueContent = prologueLines.join('\n\n');

// 2. Part 1
const part1EndIdx = banCuIdx !== -1 ? banCuIdx : (dossierIdx !== -1 ? dossierIdx : lines.length);
const part1Lines = lines.slice(pIdx !== -1 ? pIdx + 1 : 0, part1EndIdx);
const chapters = [];
let currentChap = null;
let currentChapLines = [];

for (let i = 0; i < part1Lines.length; i++) {
  const line = part1Lines[i].trim();
  if (/^Chương\s+[0-9]+/i.test(line)) {
    if (currentChap) {
      currentChap.content = currentChapLines.join('\n\n');
      currentChap.wordCount = currentChap.content.split(/\s+/).filter(Boolean).length;
      chapters.push(currentChap);
      currentChapLines = [];
    }
    const chapOrder = chapters.length + 1;
    const chapNum = (line.match(/^Chương\s+([0-9]+)/i) || [])[1] || `${chapOrder}`;
    const formattedNum = Number(chapNum) < 10 ? `0${chapNum}` : `${chapNum}`;
    currentChap = {
      id: `doc_chap_${formattedNum}`,
      partId: 'part_mua_nuoc_dung',
      title: line,
      order: chapOrder,
      content: '',
      wordCount: 0,
      status: 'published'
    };
  } else if (line) {
    if (currentChap) currentChapLines.push(line);
  }
}
if (currentChap) {
  currentChap.content = currentChapLines.join('\n\n');
  currentChap.wordCount = currentChap.content.split(/\s+/).filter(Boolean).length;
  chapters.push(currentChap);
}

const publishedSnapshot = {
  version: '1.0.0',
  title: 'Long Ấn Thức Tỉnh',
  subtitle: 'Arumo Trong Nắng Sớm',
  publishedAt: '2026-10-13',
  parts: [
    {
      id: 'part_prologue',
      title: 'MỞ ĐẦU',
      order: 1,
      description: 'Điều đáng sợ nhất đôi khi là mọi thứ vẫn trông bình thường.',
      chapters: [
        {
          id: 'doc_chap_prologue',
          partId: 'part_prologue',
          title: 'Mở đầu: Ranh giới của sự bình thường',
          order: 1,
          content: prologueContent,
          wordCount: prologueContent.split(/\s+/).filter(Boolean).length,
          status: 'published'
        }
      ]
    },
    {
      id: 'part_mua_nuoc_dung',
      title: 'PHẦN I — MÙA NƯỚC ĐỨNG',
      order: 2,
      description: 'Bến Arumo, giếng cảng trên sông Asera, chiếc tời số bảy và thảm họa bí ẩn từ thượng nguồn.',
      chapters: chapters
    }
  ]
};

fs.mkdirSync('public/content', { recursive: true });
fs.writeFileSync('public/content/published-story.json', JSON.stringify(publishedSnapshot, null, 2), 'utf8');
console.log('✅ Đã tạo thành công snapshot public/content/published-story.json');
console.log(`Số phần: ${publishedSnapshot.parts.length}, Tổng số chương: ${publishedSnapshot.parts[0].chapters.length + publishedSnapshot.parts[1].chapters.length}`);
chapters.forEach(c => console.log(`  - ${c.id}: ${c.title} (${c.wordCount} từ)`));

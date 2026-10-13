import { Part, Chapter } from '../types';

/**
 * Phân tích cú pháp văn bản từ Google Docs thành cấu trúc Phần và Chương hoàn chỉnh của Mạch Studio.
 * URL: https://docs.google.com/document/d/1KAF0QBoZNjey7jQGP4ogHx4qu0M8HPfymSiSnITr61Y/edit
 */
export function parseGoogleDocTextToParts(rawText: string): Part[] {
  if (!rawText || rawText.trim().length === 0) {
    return [];
  }

  const lines = rawText.split(/\r?\n/);
  
  const pIdx = lines.findIndex(l => l.trim().startsWith('PHẦN I'));
  const banCuIdx = lines.findIndex(l => l.trim().startsWith('BẢN CŨ'));
  const dossierIdx = lines.findIndex(l => /^[0-9]{2}\./.test(l.trim()));
  
  const parts: Part[] = [];

  // 1. Phân tích Phần Mở Đầu (Prologue) — Tách thành Phần độc lập ngoài Phần 1
  const prologueLines = lines
    .slice(0, pIdx !== -1 ? pIdx : 0)
    .map(l => l.trim())
    .filter(Boolean);
  const prologueContent = prologueLines.join('\n\n');
  const prologueWords = prologueContent.split(/\s+/).filter(Boolean).length;
  
  if (prologueContent) {
    parts.push({
      id: 'part_prologue',
      title: 'MỞ ĐẦU',
      order: 1,
      description: '“Điều đáng sợ nhất đôi khi là mọi thứ vẫn trông bình thường.” Khái quát về ranh giới bình thường và sự báo hiệu hiểm nguy.',
      wordCount: prologueWords,
      isExpanded: true,
      chapters: [
        {
          id: 'doc_chap_prologue',
          partId: 'part_prologue',
          title: 'Mở đầu: Ranh giới của sự bình thường',
          order: 1,
          content: prologueContent,
          wordCount: prologueWords,
          status: 'final',
          povCharacterName: 'Người dẫn truyện',
          location: 'Dòng sông Asera & Bến Arumo',
          notes: 'Trích xuất tự động từ Google Docs. Khái quát về ranh giới bình thường và sự báo hiệu hiểm nguy.',
          scenes: []
        }
      ]
    });
  }

  // 2. Phân tích PHẦN I — MÙA NƯỚC ĐỨNG (Chỉ chứa các Chương 1-4 chính thức, không chứa Mở Đầu)
  const part1Title = pIdx !== -1 ? lines[pIdx].trim() : 'PHẦN I — MÙA NƯỚC ĐỨNG';
  const part1EndIdx = banCuIdx !== -1 ? banCuIdx : (dossierIdx !== -1 ? dossierIdx : lines.length);
  const part1Lines = lines.slice(pIdx !== -1 ? pIdx + 1 : 0, part1EndIdx);
  
  const part1Chapters: Chapter[] = [];
  
  let currentChap: Chapter | null = null;
  let currentChapLines: string[] = [];
  
  for (let i = 0; i < part1Lines.length; i++) {
    const line = part1Lines[i].trim();
    if (/^Chương\s+[0-9]+/i.test(line)) {
      if (currentChap) {
        currentChap.content = currentChapLines.join('\n\n');
        currentChap.wordCount = currentChap.content.split(/\s+/).filter(Boolean).length;
        part1Chapters.push(currentChap);
        currentChapLines = [];
      }
      
      const chapOrder = part1Chapters.length + 1;
      const chapNum = (line.match(/^Chương\s+([0-9]+)/i) || [])[1] || `${chapOrder}`;
      const chapId = `doc_chap_0${chapNum}`;
      
      let pov = 'Rento';
      let location = 'Bến cảng Arumo';
      if (line.includes('Chiếc tàu đến sớm')) {
        pov = 'Rento & Nari';
        location = 'Bến cảng Arumo — Xưởng tời & Giếng cảng';
      } else if (line.includes('Tên nào nằm trong sổ')) {
        pov = 'Nari & Rento & Omi';
        location = 'Nhà trực bến & Trạm kiểm soát Arumo';
      } else if (line.includes('Món nợ')) {
        pov = 'Rento & Mira & Seika';
        location = 'Khu sửa máy ven sông Asera & Nhà quỹ';
      }
      
      currentChap = {
        id: chapId,
        partId: 'part_mua_nuoc_dung',
        title: line,
        order: chapOrder,
        content: '',
        wordCount: 0,
        status: 'draft',
        povCharacterName: pov,
        location,
        notes: `Chương được đồng bộ tự động từ Google Doc (Live Sync).`,
        scenes: []
      };
    } else if (line) {
      if (currentChap) {
        currentChapLines.push(line);
      }
    }
  }
  
  if (currentChap) {
    currentChap.content = currentChapLines.join('\n\n');
    currentChap.wordCount = currentChap.content.split(/\s+/).filter(Boolean).length;
    part1Chapters.push(currentChap);
  }
  
  const part1WordCount = part1Chapters.reduce((sum, c) => sum + c.wordCount, 0);
  
  const part1: Part = {
    id: 'part_mua_nuoc_dung',
    title: part1Title,
    order: parts.length + 1,
    description: 'Bến Arumo, giếng cảng trên sông Asera, chiếc tời số bảy và thảm họa bí ẩn từ thượng nguồn.',
    chapters: part1Chapters,
    wordCount: part1WordCount,
    isExpanded: true
  };
  parts.push(part1);

  // 3. Bản Cũ (Các chương Aesvorn 2-4) đã được xóa bỏ hoàn toàn theo yêu cầu của tác giả
  return parts;
}

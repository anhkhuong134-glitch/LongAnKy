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
  
  // 1. Phân tích Phần Mở Đầu (Prologue)
  const prologueLines = lines
    .slice(0, pIdx !== -1 ? pIdx : 0)
    .map(l => l.trim())
    .filter(Boolean);
  const prologueContent = prologueLines.join('\n\n');
  const prologueWords = prologueContent.split(/\s+/).filter(Boolean).length;
  
  // 2. Phân tích PHẦN I — MÙA NƯỚC ĐỨNG
  const part1Title = pIdx !== -1 ? lines[pIdx].trim() : 'PHẦN I — MÙA NƯỚC ĐỨNG';
  const part1EndIdx = banCuIdx !== -1 ? banCuIdx : (dossierIdx !== -1 ? dossierIdx : lines.length);
  const part1Lines = lines.slice(pIdx !== -1 ? pIdx + 1 : 0, part1EndIdx);
  
  const part1Chapters: Chapter[] = [];
  
  // Thêm Mở Đầu vào đầu Phần 1
  if (prologueContent) {
    part1Chapters.push({
      id: 'doc_chap_prologue',
      partId: 'part_mua_nuoc_dung',
      title: 'Mở đầu: Ranh giới của sự bình thường',
      order: 1,
      content: prologueContent,
      wordCount: prologueWords,
      status: 'final',
      povCharacterName: 'Người dẫn truyện',
      location: 'Dòng sông Asera & Bến Arumo',
      notes: 'Trích xuất tự động từ Google Docs. Khái quát về ranh giới bình thường và sự báo hiệu hiểm nguy.',
      scenes: []
    });
  }
  
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
    order: 1,
    description: 'Bến Arumo, giếng cảng trên sông Asera, chiếc tời số bảy và thảm họa bí ẩn từ thượng nguồn.',
    chapters: part1Chapters,
    wordCount: part1WordCount,
    isExpanded: true
  };
  
  // 3. Phân tích BẢN CŨ — TƯ LIỆU AESVORN & LÕI HỒN ẤN
  const part2Chapters: Chapter[] = [];
  if (banCuIdx !== -1) {
    const part2EndIdx = dossierIdx !== -1 ? dossierIdx : lines.length;
    const part2Lines = lines.slice(banCuIdx + 1, part2EndIdx);
    
    let currentPart2Chap: Chapter | null = null;
    let currentPart2Lines: string[] = [];
    
    for (let i = 0; i < part2Lines.length; i++) {
      const line = part2Lines[i].trim();
      if (/^Chương\s+[0-9]+/i.test(line)) {
        if (currentPart2Chap) {
          currentPart2Chap.content = currentPart2Lines.join('\n\n');
          currentPart2Chap.wordCount = currentPart2Chap.content.split(/\s+/).filter(Boolean).length;
          part2Chapters.push(currentPart2Chap);
          currentPart2Lines = [];
        }
        
        const chapOrder = part2Chapters.length + 1;
        const chapNum = (line.match(/^Chương\s+([0-9]+)/i) || [])[1] || `${chapOrder}`;
        const chapId = `aesvorn_chap_0${chapNum}`;
        
        let pov = 'Sena';
        let location = 'Học viện Aesvorn';
        if (line.includes('Những sai lệch nhỏ')) {
          location = 'Căng tin sinh viên & Hành lang tầng 2';
        } else if (line.includes('Nhịp tay')) {
          location = 'Cây cổ thụ góc tây & Thư viện Aesvorn';
        } else if (line.includes('Vết nứt')) {
          location = 'Phòng luyện tập Hồn Ấn & Lớp học Lý thuyết';
        }
        
        currentPart2Chap = {
          id: chapId,
          partId: 'part_aesvorn_arc',
          title: line,
          order: chapOrder,
          content: '',
          wordCount: 0,
          status: 'draft',
          povCharacterName: pov,
          location,
          notes: 'Chương thuộc tư liệu tham khảo Aesvorn Arc từ Google Doc.',
          scenes: []
        };
      } else if (line && !line.startsWith('Các chương dưới đây thuộc cốt truyện trước')) {
        if (currentPart2Chap) {
          currentPart2Lines.push(line);
        }
      }
    }
    
    if (currentPart2Chap) {
      currentPart2Chap.content = currentPart2Lines.join('\n\n');
      currentPart2Chap.wordCount = currentPart2Chap.content.split(/\s+/).filter(Boolean).length;
      part2Chapters.push(currentPart2Chap);
    }
  }
  
  const part2WordCount = part2Chapters.reduce((sum, c) => sum + c.wordCount, 0);
  const part2: Part = {
    id: 'part_aesvorn_arc',
    title: banCuIdx !== -1 ? lines[banCuIdx].trim() : 'PHẦN II — BẢN CŨ THAM KHẢO (AESVORN)',
    order: 2,
    description: 'Tư liệu tham khảo: Học viện Aesvorn, ký ức bị xóa, đồng hồ quả lắc và Hồn Ấn.',
    chapters: part2Chapters,
    wordCount: part2WordCount,
    isExpanded: true
  };
  
  return [part1, part2];
}

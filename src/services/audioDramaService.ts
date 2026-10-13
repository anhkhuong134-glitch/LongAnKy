// Audio Drama & Karaoke Engine for "Long Ấn Thức Tỉnh"
// Supports multi-voice character acting, karaoke synchronized sentence tracking & auto-scroll

export type AudioSpeaker = 'narrator' | 'Rento' | 'Nari' | 'Tovan' | 'Sena' | 'Koto' | 'Ryou' | 'Omi' | 'Dagan';

export interface AudioDramaSentence {
  id: string;
  paragraphIndex: number;
  sentenceIndex: number;
  text: string;
  speaker: AudioSpeaker;
  speakerLabel: string;
  speakerIcon: string;
  isDialogue: boolean;
  pitch: number;
  rateMultiplier: number;
}

export type VoiceMode = 'multi_voice' | 'warm_narrator' | 'sweet_female';

export const SPEAKER_CONFIGS: Record<AudioSpeaker, { label: string; icon: string; pitch: number; rateMultiplier: number }> = {
  narrator: { label: 'Người Dẫn Chuyện', icon: '🎙️', pitch: 1.0, rateMultiplier: 0.95 },
  Rento: { label: 'Rento (Thiếu Niên)', icon: '⚔️', pitch: 1.18, rateMultiplier: 1.05 },
  Nari: { label: 'Nari (Linh Tộc)', icon: '🌸', pitch: 1.45, rateMultiplier: 1.0 },
  Tovan: { label: 'Tovan (Lão Thuyền Trưởng)', icon: '⚓', pitch: 0.72, rateMultiplier: 0.88 },
  Sena: { label: 'Sena (Quan Sát)', icon: '🔮', pitch: 1.35, rateMultiplier: 0.98 },
  Koto: { label: 'Koto (Namec)', icon: '🍃', pitch: 0.85, rateMultiplier: 1.02 },
  Ryou: { label: 'Ryou (Thú Tộc)', icon: '🐾', pitch: 1.12, rateMultiplier: 1.08 },
  Omi: { label: 'Bà Lão Omi', icon: '👵', pitch: 0.88, rateMultiplier: 0.85 },
  Dagan: { label: 'Dagan (Thần Bí)', icon: '🌑', pitch: 0.65, rateMultiplier: 0.85 },
};

export class AudioDramaService {
  /**
   * Phân tích văn bản chương tiểu thuyết thành các câu thoại / dẫn truyện
   */
  static parseChapterToSentences(chapterId: string, content: string): AudioDramaSentence[] {
    if (!content) return [];

    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);
    const sentences: AudioDramaSentence[] = [];

    paragraphs.forEach((para, pIdx) => {
      const cleanPara = para.trim();

      // Kiểm tra xem đoạn văn này có phải toàn bộ là lời thoại hay không
      const isWholeDialogue = cleanPara.startsWith('“') || cleanPara.startsWith('﻿“') || cleanPara.startsWith('"') || cleanPara.startsWith('—');

      // Tách đoạn văn thành các câu dựa trên dấu câu tiếng Việt
      // Giữ nguyên dấu kết thúc câu (. ! ? ... ”)
      const rawSentenceTokens = cleanPara.match(/[^.!?…]+(?:[.!?…]+[”"']?|$)/g) || [cleanPara];

      rawSentenceTokens.forEach((token, sIdx) => {
        const text = token.trim();
        if (text.length < 2) return;

        const isDialogue = isWholeDialogue || text.includes('“') || text.includes('"') || text.startsWith('—');
        const speaker = this.detectSpeaker(text, cleanPara, isDialogue);
        const config = SPEAKER_CONFIGS[speaker];

        sentences.push({
          id: `sent_${chapterId}_p${pIdx}_s${sIdx}`,
          paragraphIndex: pIdx,
          sentenceIndex: sIdx,
          text,
          speaker,
          speakerLabel: config.label,
          speakerIcon: config.icon,
          isDialogue,
          pitch: config.pitch,
          rateMultiplier: config.rateMultiplier,
        });
      });
    });

    return sentences;
  }

  /**
   * Nhận diện nhân vật đang nói dựa vào ngữ cảnh và tên gọi
   */
  private static detectSpeaker(sentenceText: string, paragraphText: string, isDialogue: boolean): AudioSpeaker {
    if (!isDialogue) {
      return 'narrator';
    }

    const lower = (sentenceText + ' ' + paragraphText).toLowerCase();

    if (lower.includes('rento')) return 'Rento';
    if (lower.includes('nari')) return 'Nari';
    if (lower.includes('tovan') || lower.includes('thuyền trưởng') || lower.includes('lão tovan')) return 'Tovan';
    if (lower.includes('sena')) return 'Sena';
    if (lower.includes('koto')) return 'Koto';
    if (lower.includes('ryou')) return 'Ryou';
    if (lower.includes('omi') || lower.includes('bà lão') || lower.includes('người phụ nữ')) return 'Omi';
    if (lower.includes('dagan')) return 'Dagan';

    // Mặc định đối thoại nam / nữ xen kẽ
    return 'Rento';
  }

  /**
   * Tính toán pitch và rate dựa trên VoiceMode được chọn
   */
  static getVoiceParameters(sentence: AudioDramaSentence, mode: VoiceMode, baseRate: number): { pitch: number; rate: number } {
    if (mode === 'multi_voice') {
      return {
        pitch: sentence.pitch,
        rate: Math.max(0.5, Math.min(2.0, baseRate * sentence.rateMultiplier)),
      };
    }

    if (mode === 'sweet_female') {
      return {
        pitch: 1.35,
        rate: Math.max(0.5, Math.min(2.0, baseRate * 0.98)),
      };
    }

    // Warm narrator
    return {
      pitch: 0.95,
      rate: Math.max(0.5, Math.min(2.0, baseRate * 0.95)),
    };
  }

  /**
   * Tìm giọng tiếng Việt tối ưu nhất trong hệ thống trình duyệt
   */
  static getBestVietnameseVoice(synth: SpeechSynthesis): SpeechSynthesisVoice | null {
    if (!synth) return null;
    const voices = synth.getVoices();
    if (!voices || voices.length === 0) return null;

    // Ưu tiên 1: Giọng Google hoặc Microsoft tiếng Việt
    const premiumViVoice = voices.find(v => 
      (v.lang === 'vi-VN' || v.lang === 'vi_VN' || v.lang.startsWith('vi')) &&
      (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Online') || v.name.includes('Microsoft'))
    );
    if (premiumViVoice) return premiumViVoice;

    // Ưu tiên 2: Bất kỳ giọng tiếng Việt nào
    const anyViVoice = voices.find(v => v.lang.startsWith('vi'));
    if (anyViVoice) return anyViVoice;

    // Fallback: Giọng mặc định
    return voices[0] || null;
  }
}

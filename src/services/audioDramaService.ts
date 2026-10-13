// Audio Drama & Karaoke Engine for "Long Ấn Thức Tỉnh"
// Supports multi-voice character acting, real-time word-by-word karaoke synchronization, and auto-scroll

export type AudioSpeaker = 
  | 'narrator' 
  | 'Rento' 
  | 'Nari' 
  | 'Tovan' 
  | 'Dagan' 
  | 'Seika' 
  | 'Mira' 
  | 'Omi' 
  | 'Oren' 
  | 'Garan' 
  | 'Khuong' 
  | 'HuyenNguyet'
  | 'default_male'
  | 'default_female';

export interface AudioDramaSentence {
  id: string;
  paragraphIndex: number;
  sentenceIndex: number;
  text: string;
  speaker: AudioSpeaker;
  speakerLabel: string;
  speakerIcon: string;
  isDialogue: boolean;
  words: string[];
}

export type VoiceThemeId = 'mythic_drama' | 'night_chill' | 'epic_shonen' | 'solo_male' | 'solo_female';

export interface CharacterVoiceProfile {
  label: string;
  icon: string;
  roleDescription: string;
  pitch: number;
  rateMultiplier: number;
  gender: 'male' | 'female' | 'neutral';
}

export interface VoiceTheme {
  id: VoiceThemeId;
  name: string;
  icon: string;
  badge: string;
  description: string;
  speakerProfiles: Record<AudioSpeaker, { pitch: number; rateMultiplier: number }>;
}

export const SPEAKER_METADATA: Record<AudioSpeaker, { label: string; icon: string; roleDescription: string; gender: 'male' | 'female' | 'neutral' }> = {
  narrator: { label: 'Người Dẫn Chuyện', icon: '🎙️', roleDescription: 'Lời kể trầm ấm, diễn cảm, điềm tĩnh', gender: 'neutral' },
  Rento: { label: 'Rento', icon: '⚔️', roleDescription: 'Thiếu niên thợ máy, hào sảng, dứt khoát', gender: 'male' },
  Nari: { label: 'Nari', icon: '🌸', roleDescription: 'Tuần bến trẻ, trong trẻo, thanh thoát', gender: 'female' },
  Tovan: { label: 'Lão Tovan', icon: '⚓', roleDescription: 'Lão thuyền trưởng già dặn, trầm đục phong trần', gender: 'male' },
  Dagan: { label: 'Dagan', icon: '💪', roleDescription: 'Bạn khuân vác, chân chất, trầm ấm khỏe khoắn', gender: 'male' },
  Seika: { label: 'Seika', icon: '📐', roleDescription: 'Nhà đo đạc dòng nước, điềm đạm trí tuệ', gender: 'female' },
  Mira: { label: 'Mẹ Mira', icon: '🍲', roleDescription: 'Người mẹ tần tảo, ấm áp đôn hậu', gender: 'female' },
  Omi: { label: 'Bà Lão Omi', icon: '👵', roleDescription: 'Nhân chứng trên tàu, khàn nhẹ từng trải', gender: 'female' },
  Oren: { label: 'Quản Bến Oren', icon: '📜', roleDescription: 'Quan chức quản bến, thận trọng hành chính', gender: 'male' },
  Garan: { label: 'Garan', icon: '👑', roleDescription: 'Quan chức thượng nguồn, uy quyền bí hiểm', gender: 'male' },
  Khuong: { label: 'Anh Khương', icon: '🐉', roleDescription: 'Đạo hữu tu giả, kiên định đĩnh đạc', gender: 'male' },
  HuyenNguyet: { label: 'Huyền Nguyệt', icon: '🌙', roleDescription: 'Nữ kiếm hiệp, kiêu sa sắc sảo', gender: 'female' },
  default_male: { label: 'Nhân Vật Nam', icon: '🧑', roleDescription: 'Giọng nam tự nhiên', gender: 'male' },
  default_female: { label: 'Nhân Vật Nữ', icon: '👩', roleDescription: 'Giọng nữ tự nhiên', gender: 'female' },
};

// 5 Bộ Phong Cách Giọng Đọc Đa Dạng
export const VOICE_THEMES: Record<VoiceThemeId, VoiceTheme> = {
  mythic_drama: {
    id: 'mythic_drama',
    name: 'Kịch Truyền Thanh Huyền Huyễn',
    icon: '🎭',
    badge: 'Tiêu Chuẩn',
    description: 'Mỗi nhân vật một giọng diễn cảm riêng biệt, chuẩn saga huyền bí Á Đông',
    speakerProfiles: {
      narrator: { pitch: 1.0, rateMultiplier: 0.96 },
      Rento: { pitch: 1.18, rateMultiplier: 1.04 },
      Nari: { pitch: 1.42, rateMultiplier: 0.98 },
      Tovan: { pitch: 0.72, rateMultiplier: 0.88 },
      Dagan: { pitch: 0.92, rateMultiplier: 1.0 },
      Seika: { pitch: 1.28, rateMultiplier: 0.96 },
      Mira: { pitch: 1.15, rateMultiplier: 0.92 },
      Omi: { pitch: 0.82, rateMultiplier: 0.84 },
      Oren: { pitch: 0.96, rateMultiplier: 0.96 },
      Garan: { pitch: 0.65, rateMultiplier: 0.90 },
      Khuong: { pitch: 1.08, rateMultiplier: 1.02 },
      HuyenNguyet: { pitch: 1.35, rateMultiplier: 0.98 },
      default_male: { pitch: 1.05, rateMultiplier: 1.0 },
      default_female: { pitch: 1.30, rateMultiplier: 0.98 },
    }
  },
  night_chill: {
    id: 'night_chill',
    name: 'Kể Chuyện Đêm Khuya (ASMR)',
    icon: '🌙',
    badge: 'Thư Giãn Du Dương',
    description: 'Âm sắc thì thầm nhẹ nhàng, tiết tấu chậm rãi êm dịu giúp tĩnh tâm thư thái',
    speakerProfiles: {
      narrator: { pitch: 0.88, rateMultiplier: 0.84 },
      Rento: { pitch: 1.02, rateMultiplier: 0.86 },
      Nari: { pitch: 1.25, rateMultiplier: 0.84 },
      Tovan: { pitch: 0.68, rateMultiplier: 0.80 },
      Dagan: { pitch: 0.86, rateMultiplier: 0.84 },
      Seika: { pitch: 1.15, rateMultiplier: 0.82 },
      Mira: { pitch: 1.05, rateMultiplier: 0.80 },
      Omi: { pitch: 0.78, rateMultiplier: 0.80 },
      Oren: { pitch: 0.90, rateMultiplier: 0.84 },
      Garan: { pitch: 0.60, rateMultiplier: 0.80 },
      Khuong: { pitch: 0.95, rateMultiplier: 0.85 },
      HuyenNguyet: { pitch: 1.20, rateMultiplier: 0.82 },
      default_male: { pitch: 0.95, rateMultiplier: 0.84 },
      default_female: { pitch: 1.18, rateMultiplier: 0.82 },
    }
  },
  epic_shonen: {
    id: 'epic_shonen',
    name: 'Sử Thi Hào Hùng (Chiến Đấu)',
    icon: '⚡',
    badge: 'Kịch Tính Nhiệt Huyết',
    description: 'Tiết tấu dồn dập, ngữ điệu vang dội, hào hùng bùng nổ theo từng biến cố',
    speakerProfiles: {
      narrator: { pitch: 1.05, rateMultiplier: 1.06 },
      Rento: { pitch: 1.26, rateMultiplier: 1.12 },
      Nari: { pitch: 1.50, rateMultiplier: 1.06 },
      Tovan: { pitch: 0.70, rateMultiplier: 0.96 },
      Dagan: { pitch: 0.96, rateMultiplier: 1.08 },
      Seika: { pitch: 1.32, rateMultiplier: 1.02 },
      Mira: { pitch: 1.18, rateMultiplier: 0.98 },
      Omi: { pitch: 0.85, rateMultiplier: 0.92 },
      Oren: { pitch: 1.00, rateMultiplier: 1.04 },
      Garan: { pitch: 0.58, rateMultiplier: 0.92 },
      Khuong: { pitch: 1.15, rateMultiplier: 1.10 },
      HuyenNguyet: { pitch: 1.40, rateMultiplier: 1.05 },
      default_male: { pitch: 1.12, rateMultiplier: 1.06 },
      default_female: { pitch: 1.38, rateMultiplier: 1.04 },
    }
  },
  solo_male: {
    id: 'solo_male',
    name: 'Độc Diễn Nam (Giọng Trầm Ấm)',
    icon: '🎙️',
    badge: 'Sách Nói Nam',
    description: 'Một giọng nam trầm ấm truyền cảm xuyên suốt toàn bộ tác phẩm',
    speakerProfiles: {
      narrator: { pitch: 0.95, rateMultiplier: 0.96 },
      Rento: { pitch: 0.98, rateMultiplier: 0.98 },
      Nari: { pitch: 1.05, rateMultiplier: 0.96 },
      Tovan: { pitch: 0.85, rateMultiplier: 0.92 },
      Dagan: { pitch: 0.95, rateMultiplier: 0.96 },
      Seika: { pitch: 1.02, rateMultiplier: 0.96 },
      Mira: { pitch: 1.02, rateMultiplier: 0.94 },
      Omi: { pitch: 0.90, rateMultiplier: 0.92 },
      Oren: { pitch: 0.95, rateMultiplier: 0.96 },
      Garan: { pitch: 0.88, rateMultiplier: 0.92 },
      Khuong: { pitch: 0.98, rateMultiplier: 0.98 },
      HuyenNguyet: { pitch: 1.05, rateMultiplier: 0.96 },
      default_male: { pitch: 0.95, rateMultiplier: 0.96 },
      default_female: { pitch: 1.02, rateMultiplier: 0.96 },
    }
  },
  solo_female: {
    id: 'solo_female',
    name: 'Độc Diễn Nữ (Giọng Dịu Dàng)',
    icon: '🌸',
    badge: 'Sách Nói Nữ',
    description: 'Một giọng nữ ngọt ngào trong sáng chuẩn phát thanh viên đọc toàn bài',
    speakerProfiles: {
      narrator: { pitch: 1.35, rateMultiplier: 0.98 },
      Rento: { pitch: 1.30, rateMultiplier: 1.00 },
      Nari: { pitch: 1.40, rateMultiplier: 0.98 },
      Tovan: { pitch: 1.20, rateMultiplier: 0.94 },
      Dagan: { pitch: 1.28, rateMultiplier: 0.98 },
      Seika: { pitch: 1.35, rateMultiplier: 0.98 },
      Mira: { pitch: 1.32, rateMultiplier: 0.96 },
      Omi: { pitch: 1.25, rateMultiplier: 0.94 },
      Oren: { pitch: 1.30, rateMultiplier: 0.98 },
      Garan: { pitch: 1.22, rateMultiplier: 0.94 },
      Khuong: { pitch: 1.32, rateMultiplier: 1.00 },
      HuyenNguyet: { pitch: 1.40, rateMultiplier: 0.98 },
      default_male: { pitch: 1.28, rateMultiplier: 0.98 },
      default_female: { pitch: 1.35, rateMultiplier: 0.98 },
    }
  }
};

export class AudioDramaService {
  /**
   * Phân tích văn bản chương tiểu thuyết thành các câu thoại & dẫn truyện
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
      const rawSentenceTokens = cleanPara.match(/[^.!?…]+(?:[.!?…]+[”"']?|$)/g) || [cleanPara];

      rawSentenceTokens.forEach((token, sIdx) => {
        const text = token.trim();
        if (text.length < 2) return;

        const isDialogue = isWholeDialogue || text.includes('“') || text.includes('"') || text.startsWith('—');
        const speaker = this.detectSpeaker(text, cleanPara, isDialogue);
        const meta = SPEAKER_METADATA[speaker];

        // Tách các từ riêng biệt để phục vụ tính năng Karaoke sáng chữ theo thời gian thực
        const words = text.split(/\s+/).filter(w => w.length > 0);

        sentences.push({
          id: `sent_${chapterId}_p${pIdx}_s${sIdx}`,
          paragraphIndex: pIdx,
          sentenceIndex: sIdx,
          text,
          speaker,
          speakerLabel: meta.label,
          speakerIcon: meta.icon,
          isDialogue,
          words,
        });
      });
    });

    return sentences;
  }

  /**
   * Nhận diện nhân vật đang nói dựa vào ngữ cảnh và tên gọi
   */
  static detectSpeaker(sentenceText: string, paragraphText: string, isDialogue: boolean): AudioSpeaker {
    if (!isDialogue) {
      return 'narrator';
    }

    const lower = (sentenceText + ' ' + paragraphText).toLowerCase();

    // Kiểm tra tên nhân vật cụ thể
    if (lower.includes('rento')) return 'Rento';
    if (lower.includes('nari')) return 'Nari';
    if (lower.includes('tovan') || lower.includes('thuyền trưởng') || lower.includes('lão tovan')) return 'Tovan';
    if (lower.includes('dagan') || lower.includes('khuân vác')) return 'Dagan';
    if (lower.includes('seika') || lower.includes('đo đạc')) return 'Seika';
    if (lower.includes('mira') || lower.includes('mẹ mira')) return 'Mira';
    if (lower.includes('omi') || lower.includes('bà lão omi') || lower.includes('bà omi')) return 'Omi';
    if (lower.includes('oren') || lower.includes('quản bến')) return 'Oren';
    if (lower.includes('garan') || lower.includes('thống đốc') || lower.includes('trạm trên')) return 'Garan';
    if (lower.includes('khương') || lower.includes('anh khương') || lower.includes('long ấn')) return 'Khuong';
    if (lower.includes('nguyệt') || lower.includes('huyền nguyệt')) return 'HuyenNguyet';

    // Dựa trên xưng hô giới tính
    if (lower.includes('cô ấy') || lower.includes('nàng') || lower.includes('tiểu thư') || lower.includes('nữ tử')) {
      return 'default_female';
    }
    if (lower.includes('hắn') || lower.includes('chàng') || lower.includes('gã') || lower.includes('tiểu tử') || lower.includes('lão già')) {
      return 'default_male';
    }

    // Mặc định đối thoại nam
    return 'Rento';
  }

  /**
   * Tính toán pitch và rate dựa trên VoiceTheme và baseRate
   */
  static getVoiceParameters(
    sentence: AudioDramaSentence, 
    themeId: VoiceThemeId, 
    baseRate: number
  ): { pitch: number; rate: number } {
    const theme = VOICE_THEMES[themeId] || VOICE_THEMES.mythic_drama;
    const profile = theme.speakerProfiles[sentence.speaker] || theme.speakerProfiles.narrator;

    return {
      pitch: profile.pitch,
      rate: Math.max(0.5, Math.min(2.0, baseRate * profile.rateMultiplier)),
    };
  }

  /**
   * Tính toán vị trí từ trong câu dựa trên chỉ số ký tự charIndex từ sự kiện TTS onboundary
   */
  static getWordIndexFromCharIndex(text: string, charIndex: number): number {
    if (!text || charIndex <= 0) return 0;
    const prefix = text.substring(0, charIndex);
    const wordsBefore = prefix.trim().split(/\s+/).filter(Boolean);
    return Math.max(0, wordsBefore.length);
  }

  /**
   * Ước tính khoảng thời gian cho mỗi từ (dùng làm timer mượt mà fallback)
   */
  static getAverageWordDurationMs(text: string, rate: number): number {
    const wordCount = Math.max(1, text.split(/\s+/).filter(Boolean).length);
    // Tốc độ bình thường: ~230 từ/phút => ~260ms/từ
    const msPerWord = 260 / (rate || 1.0);
    return Math.max(80, msPerWord);
  }

  /**
   * Tìm giọng tiếng Việt tối ưu nhất trong hệ thống trình duyệt
   */
  static getBestVietnameseVoice(synth: SpeechSynthesis, preferGender?: 'male' | 'female'): SpeechSynthesisVoice | null {
    if (!synth) return null;
    const voices = synth.getVoices();
    if (!voices || voices.length === 0) return null;

    const viVoices = voices.filter(v => v.lang.startsWith('vi') || v.lang === 'vi-VN' || v.lang === 'vi_VN');

    if (viVoices.length > 0) {
      if (preferGender === 'female') {
        const femaleVoice = viVoices.find(v => 
          v.name.toLowerCase().includes('female') || 
          v.name.toLowerCase().includes('hoaimy') || 
          v.name.toLowerCase().includes('an') || 
          v.name.toLowerCase().includes('mai')
        );
        if (femaleVoice) return femaleVoice;
      }

      if (preferGender === 'male') {
        const maleVoice = viVoices.find(v => 
          v.name.toLowerCase().includes('male') || 
          v.name.toLowerCase().includes('namminh') || 
          v.name.toLowerCase().includes('minh')
        );
        if (maleVoice) return maleVoice;
      }

      // Ưu tiên giọng tự nhiên Google hoặc Microsoft
      const naturalVoice = viVoices.find(v => 
        v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Online')
      );
      if (naturalVoice) return naturalVoice;

      return viVoices[0];
    }

    return voices[0] || null;
  }
}

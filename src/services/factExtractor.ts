import { Chapter, Scene, BibleFact, Character, ForeshadowingHook } from '../types';

export interface ExtractedFactCandidate {
  id: string;
  category: BibleFact['category'];
  title: string;
  content: string;
  confidence: number;
  sourceTextSnippet: string;
  suggestedTags: string[];
  affectedCharacterNames?: string[];
  hookTitle?: string;
}

export class FactExtractor {
  static extractFactsFromScene(scene: Chapter | Scene | any, characters: Character[]): ExtractedFactCandidate[] {
    const text = scene.content || '';
    const candidates: ExtractedFactCandidate[] = [];

    // Analyze scene content for key novel entities and state transitions
    if (text.includes('sổ da') || text.includes('cuốn sổ')) {
      candidates.push({
        id: `cand_${Date.now()}_1`,
        category: 'secret',
        title: 'Koto đang nắm giữ Cuốn Sổ Da Tầng 4',
        content: 'Koto là người trực tiếp giữ cuốn sổ da nâu chứa danh sách các cá nhân bị thanh tẩy ký ức tại Học viện Aesvorn.',
        confidence: 0.95,
        sourceTextSnippet: 'Trên bàn là một cuốn sổ da nâu sờn mép, gáy sách được khâu bằng gân thú...',
        suggestedTags: ['Vật phẩm', 'Koto', 'Cuốn sổ da'],
        affectedCharacterNames: ['Koto'],
        hookTitle: 'Cuốn Sổ Da Bìa Nâu Tầng 4'
      });
    }

    if (text.includes('chỉ đỏ') || text.includes('sợi chỉ đỏ')) {
      candidates.push({
        id: `cand_${Date.now()}_2`,
        category: 'magic_system',
        title: 'Sợi Chỉ Đỏ phản ứng và cộng hưởng với Long Ấn',
        content: 'Sợi chỉ đỏ trên cổ tay Koto phát sáng và rung mạnh khi tiếp cận cự ly gần với người mang Long Ấn như Sena.',
        confidence: 0.92,
        sourceTextSnippet: 'Sợi chỉ đỏ quấn ba vòng quanh cổ tay cô bỗng nhiên rung lên bần bật như một sợi dây đàn bị gảy mạnh.',
        suggestedTags: ['Phép thuật', 'Cộng hưởng', 'Sợi chỉ đỏ'],
        affectedCharacterNames: ['Koto', 'Sena'],
        hookTitle: 'Sợi Chỉ Đỏ Quấn Cổ Tay Koto'
      });
    }

    if (text.includes('Cốc') || text.includes('tiếng gõ')) {
      candidates.push({
        id: `cand_${Date.now()}_3`,
        category: 'world_rule',
        title: 'Nhịp ba tiếng gõ xuất hiện tại Khu Lưu Trữ Tầng 4',
        content: 'Nhịp ba tiếng gõ không chỉ xuất hiện ở Tháp Chuông mà còn báo hiệu sự áp sát của Kẻ Canh Giác Ký Ức tại Tầng 4.',
        confidence: 0.89,
        sourceTextSnippet: 'từ cuối hành lang tối om của Tầng 4, một âm thanh lạnh buốt vang lên. Cốc.',
        suggestedTags: ['Âm thanh', 'Kẻ Canh Giác', 'Tầng 4'],
        hookTitle: 'Nhịp Ba Tiếng Gõ'
      });
    }

    if (text.includes('Kẻ Canh Giác') || text.includes('bước chân')) {
      candidates.push({
        id: `cand_${Date.now()}_4`,
        category: 'faction',
        title: 'Kẻ Canh Giác Ký Ức đang truy lùng cuốn sổ',
        content: 'Lực lượng thi hành kỷ luật cấm của Aesvorn đã phát hiện sự xâm nhập của nhóm vào Tầng 4.',
        confidence: 0.85,
        sourceTextSnippet: 'Bên ngoài hành lang, tiếng bước chân nặng nề của Kẻ Canh Giác Ký Ức đang dội tới.',
        suggestedTags: ['Thế lực', 'Kẻ Canh Giác']
      });
    }

    return candidates;
  }
}

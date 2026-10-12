import { Chapter, Scene, Character, BibleFact, LogicAuditIssue } from '../types';

export class LogicChecker {
  static auditSceneContent(
    scene: Chapter | Scene | any,
    characters: Character[],
    bibleFacts: BibleFact[]
  ): LogicAuditIssue[] {
    const issues: LogicAuditIssue[] = [];
    const text = (scene.content || '').toLowerCase();

    // 1. Check Character Knowledge Leaks
    const presentChars = characters.filter(c => 
      scene.presentCharacterIds?.includes(c.id) || scene.povCharacterId === c.id || characters.length <= 3
    );

    presentChars.forEach(char => {
      const knowledge = [...char.knowledgeTracker].reverse()[0];
      if (knowledge && knowledge.forbiddenSecrets) {
        knowledge.forbiddenSecrets.forEach(forbidden => {
          const keywords = forbidden.toLowerCase().split(' ').filter(w => w.length > 3);
          const matchCount = keywords.filter(kw => text.includes(kw)).length;
          
          if (matchCount >= 2 || text.includes(forbidden.toLowerCase())) {
            issues.push({
              id: `leak_${char.id}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
              type: 'knowledge_leak',
              severity: 'critical',
              characterName: char.name,
              title: `Cảnh báo rò rỉ kiến thức: ${char.name}`,
              detail: `Nhân vật ${char.name} có dấu hiệu nhắc đến hoặc hành động dựa trên bí mật chưa được tiết lộ: "${forbidden}". Tại thời điểm này, ${char.name} tuyệt đối không được phép biết điều này!`,
              fixSuggestion: `Chỉnh sửa lại đoạn hội thoại/suy nghĩ của ${char.name} để giữ trạng thái hoài nghi hoặc chỉ đưa ra phán đoán mơ hồ thay vì nói thẳng sự thật.`
            });
          }
        });
      }
    });

    // 2. Item Paradox checks
    // Example: Leather notebook is held by Koto. If text mentions Sena reading it or taking it without an action transfer
    if (text.includes('sena') && text.includes('lật giở cuốn sổ da') && !text.includes('koto đưa')) {
      issues.push({
        id: `item_paradox_${Date.now()}`,
        type: 'item_paradox',
        severity: 'warning',
        characterName: 'Sena',
        title: 'Bất thường vị trí vật phẩm: Cuốn Sổ Da',
        detail: 'Cuốn Sổ Da hiện tại đang nằm trong tay Koto. Sena chưa thực hiện hành động nhận/giật lấy cuốn sổ.',
        fixSuggestion: 'Thêm một câu mô tả Koto mở sách ra cho cả hai cùng xem, hoặc Sena giật lấy cuốn sổ từ tay Koto.'
      });
    }

    // 3. Rule Violations (Canon laws check)
    const purgeRule = bibleFacts.find(f => f.category === 'world_rule' && f.title.includes('Thanh tẩy'));
    if (purgeRule && text.includes('sena nhớ rõ chuyện 6 năm trước')) {
      issues.push({
        id: `rule_viol_${Date.now()}`,
        type: 'rule_violation',
        severity: 'critical',
        title: 'Vi phạm Quy luật Thế giới (Canon)',
        detail: 'Quy luật thế giới quy định ký ức của người mang Long Ấn bị thanh tẩy toàn bộ trong vòng 5 năm qua. Sena không thể nhớ rõ ký ức 6 năm trước một cách nguyên vẹn.',
        fixSuggestion: 'Mô tả đó như một mảnh vỡ ký ức mơ hồ hoặc cảm giác trực giác gián tiếp.'
      });
    }

    // 4. Three-Knock Timing Check
    if (text.includes('tiếng gõ') && text.includes('liên hồi không ngớt')) {
      issues.push({
        id: `cadence_${Date.now()}`,
        type: 'rule_violation',
        severity: 'info',
        title: 'Lệch nhịp motif: Nhịp Ba Tiếng Gõ',
        detail: 'Quy tắc Canon quy định Nhịp Ba Tiếng Gõ luôn vang lên đúng 3 nhịp cách nhau 2 giây (Cốc... Cốc... Cốc...).',
        fixSuggestion: 'Giữ cấu trúc ba tiếng gõ ngắt quãng để duy trì tính biểu tượng và cảm giác hồi hộp.'
      });
    }

    return issues;
  }
}

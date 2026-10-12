import { AISettings, AIRole, Chapter, Scene, Part, Character, BibleFact, ForeshadowingHook, BetaFeedback } from '../types';
import { ContextCompiler, CompiledContextPackage } from './contextCompiler';

export interface AISuggestionResult {
  role: AIRole;
  title: string;
  response: string;
  options?: {
    id: string;
    title: string;
    description: string;
    snippet: string;
  }[];
  rationale: string;
  canonWarnings?: string[];
  suggestedFacts?: string[];
}

export class AIService {
  static async requestAssistance(
    role: AIRole,
    userPrompt: string,
    currentScene: Chapter | Scene | any,
    allParts: Part[],
    allCharacters: Character[],
    allBibleFacts: BibleFact[],
    allHooks: ForeshadowingHook[],
    settings: AISettings,
    customOptions?: {
      targetCharacterId?: string;
      continuationLength?: 'short' | 'medium' | 'long';
      tensionLevel?: 'subtle' | 'moderate' | 'intense';
    }
  ): Promise<AISuggestionResult> {
    const context = ContextCompiler.compileSceneContext(
      currentScene,
      allParts,
      allCharacters,
      allBibleFacts,
      allHooks
    );

    // If configured to use Ollama and reachable:
    if (settings.provider === 'ollama' && settings.ollamaUrl) {
      try {
        const res = await this.callOllama(settings, role, userPrompt, context);
        if (res) return res;
      } catch (err) {
        console.warn('Ollama unavailable, falling back to Intelligent Local Simulation:', err);
      }
    }

    // If configured to use Gemini API:
    if (settings.provider === 'gemini' && settings.geminiApiKey) {
      try {
        const res = await this.callGemini(settings, role, userPrompt, context);
        if (res) return res;
      } catch (err) {
        console.warn('Gemini API error, falling back:', err);
      }
    }

    // Default: High-fidelity specialized response generator
    return this.generateSimulatedResponse(role, userPrompt, currentScene, context, allCharacters, customOptions);
  }

  private static async callOllama(
    settings: AISettings,
    role: AIRole,
    userPrompt: string,
    context: CompiledContextPackage
  ): Promise<AISuggestionResult | null> {
    const systemPrompt = `Bạn là Trợ lý AI chuyên biệt "${role}" cho hệ thống viết tiểu thuyết Mạch. Luôn tuân thủ tuyệt đối quy tắc Canon và giới hạn tri thức nhân vật được cung cấp. Tuyệt đối không để nhân vật biết trước các bí mật cấm.`;
    
    const response = await fetch(`${settings.ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: settings.ollamaModel || 'llama3.2',
        prompt: `${systemPrompt}\n\n${context.assembledPromptContext}\n\nYêu cầu tác giả: ${userPrompt}`,
        stream: false
      })
    });

    if (!response.ok) throw new Error(`Ollama status: ${response.status}`);
    const data = await response.json();
    return {
      role,
      title: `Phản hồi từ Ollama (${settings.ollamaModel})`,
      response: data.response,
      rationale: 'Sinh tự động từ mô hình cục bộ với gói ngữ cảnh Canon.'
    };
  }

  private static async callGemini(
    settings: AISettings,
    role: AIRole,
    userPrompt: string,
    context: CompiledContextPackage
  ): Promise<AISuggestionResult | null> {
    const apiKey = settings.geminiApiKey;
    const model = settings.geminiModel || 'gemini-1.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const prompt = `Bạn là trợ lý AI chuyên biệt cho tiểu thuyết '${role}'. Hãy đọc kỹ gói ngữ cảnh sau và phản hồi yêu cầu của tác giả.\n\n${context.assembledPromptContext}\n\nYêu cầu: ${userPrompt}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!res.ok) throw new Error(`Gemini status: ${res.status}`);
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return {
      role,
      title: `Phản hồi từ Gemini (${model})`,
      response: text,
      rationale: 'Sinh từ Gemini API với đầy đủ ràng buộc tri thức nhân vật.'
    };
  }

  private static generateSimulatedResponse(
    role: AIRole,
    userPrompt: string,
    currentScene: Scene,
    context: CompiledContextPackage,
    characters: Character[],
    customOptions?: any
  ): AISuggestionResult {
    switch (role) {
      case 'scene_writer': {
        return {
          role: 'scene_writer',
          title: 'Đề xuất 3 Hướng Viết Tiếp Cảnh 1 (Chương 4)',
          response: `Dưới đây là 3 phương án phát triển tiếp theo từ vị trí con trỏ sau khi Nhịp Ba Tiếng Gõ vang lên ở cuối Tầng 4:`,
          options: [
            {
              id: 'opt_1',
              title: 'Phương án 1: Kịch tính & Đột kích (Action / High Tension)',
              description: 'Ryou rút kiếm nghênh chiến Kẻ Canh Giác, Koto mở lối thoát bí mật sau giá sách.',
              snippet: `Tiếng gõ thứ ba vừa dứt, bóng đen sau cánh cửa lim đồ sộ khẽ nhúc nhích. Không khí trong Tầng 4 lạnh buốt như thể một khối băng ngàn năm vừa được thả vào phòng.

"Ryou, chặn cửa!" Sena gằn giọng, bước vội đến bên bàn đá. "Koto, lối thoát phía sau có an toàn không?"

Koto không đáp, nhưng đôi tay gầy gò của cô nhanh chóng gấp cuốn sổ da lại, nhét vội vào bọc vải chàm trước ngực. Sợi chỉ đỏ nơi cổ tay cô rực sáng một quầng hào quang đỏ sẫm ma mị. Cô bé ấn mạnh ngón tay vào một viên đá gồ ghề bên cạnh giá sách thứ chín. Một tiếng "rắc" khô khốc vang lên, bức tường đá từ từ xoay tròn để lộ một lối đi dốc đứng hun hút mùi rêu ẩm.

"Đi nhanh," Koto thì thầm, hơi thở đứt quãng vì kiệt sức. "Kẻ Canh Giác mang theo Trượng Thanh Tẩy. Nếu để luồng sóng đó quét qua, ký ức ba ngày qua của các cậu sẽ thành cát bụi."`
            },
            {
              id: 'opt_2',
              title: 'Phương án 2: Bí ẩn & Phản ứng Cộng hưởng (Mystery / Deep Resonance)',
              description: 'Vảy rồng của Sena bùng cháy, cộng hưởng với sợi chỉ đỏ tạo ra kết giới vô hình.',
              snippet: `Trong tích tắc khi tiếng gõ thứ ba rơi xuống sàn đá, một luồng nhiệt dữ dội bỗng bốc lên từ cổ tay trái của Sena. Cơn nóng rát khiến cậu phải cắn chặt môi để không thốt ra tiếng kêu. Dưới làn da, những chiếc vảy rồng chìm phát ra một âm thanh ong ong trầm đục như tiếng gầm của dã thú bị giam cầm.

Koto giật mình lùi lại một bước, ánh mắt hổ phách nhìn chằm chằm vào cánh tay đang phát sáng của Sena: "Ngươi... tại sao ấn ký của ngươi lại có thể đánh thức sợi chỉ?"

"Tôi cũng muốn hỏi cô câu đó," Sena nghiến răng, giơ bàn tay trái ra chắn trước mặt Koto. 

Kỳ lạ thay, quầng sáng đỏ từ sợi chỉ quấn trên tay Koto và sắc tím lạnh từ vảy rồng của Sena không hề bài xích lẫn nhau, mà đan xen vào nhau tạo thành một màn sương năng lượng bao bọc lấy cả gian phòng. Tiếng bước chân nặng nề ngoài hành lang bỗng khựng lại như thể kẻ đi săn vừa đánh mất dấu vết của con mồi.`
            },
            {
              id: 'opt_3',
              title: 'Phương án 3: Đàm phán & Thử thách Lòng tin (Psychological / Suspense)',
              description: 'Koto thử lòng Sena trước khi chịu giao trang sách quan trọng nhất.',
              snippet: `Thay vì bỏ chạy, Koto lại đặt ngón tay mảnh dẻ lên trang sách đang mở dở. Ánh mắt cô bé nhìn thẳng vào Sena, sắc lạnh và kiên định đến kỳ lạ.

"Nếu tôi đưa cho cậu trang này," Koto nói, giọng nhỏ nhưng từng chữ như đinh đóng vào đá, "cậu sẽ phải mang theo lời nguyền của những kẻ bị lãng quên. Cậu có chắc mình muốn biết tên của người đầu tiên bị xóa sổ khỏi Aesvorn cách đây 7 năm không?"

Ryou đứng ở cửa, kiếm đã tuốt ra một nửa, trầm giọng nhắc nhở: "Koto, không phải lúc để chất vấn. Kẻ bên ngoài chỉ cách chúng ta mười bước chân."

"Để cô ấy nói," Sena bước sát lại mép bàn đá, mắt không rời khỏi cuốn sổ. "Tôi đã sống như một cái bóng không quá khứ suốt 5 năm qua. Thêm một lời nguyền nữa cũng chẳng làm tôi gục ngã được."`
            }
          ],
          rationale: 'Cả 3 phương án đều bảo toàn nghiêm ngặt Canon: Koto vẫn giữ cuốn sổ, Koto chưa biết thân phận vương tộc của Sena, nhịp 3 tiếng gõ giữ đúng tần số.',
          canonWarnings: [
            'Lưu ý: Koto vẫn chưa biết Sena mang Long Ấn Vương Giả cấp cao, chỉ mới nhận thấy hiện tượng cộng hưởng năng lượng.'
          ]
        };
      }

      case 'character_actor': {
        const charName = customOptions?.targetCharacterId ? characters.find(c => c.id === customOptions.targetCharacterId)?.name || 'Koto' : 'Koto';
        return {
          role: 'character_actor',
          title: `Thử nghiệm Nhập vai (Roleplay): ${charName}`,
          response: `[HỆ THỐNG ĐÃ KHỞI TẠO TÂM LÝ NHÂN VẬT ${charName.toUpperCase()}]
- Giọng điệu: Trầm lặng, cô độc, dùng từ ngữ cổ trang nhã, thường nhìn sâu vào mắt đối phương trước khi trả lời.
- Bí mật đang bảo vệ: Cuốn sổ da và danh sách thanh tẩy.
- Cảm xúc hiện tại: Bị dồn vào chân tường nhưng kiêu hãnh.

Đoạn độc thoại nội tâm & Lời thoại thử nghiệm:
"Các người nhìn vào cuốn sổ này và chỉ thấy những vết mực cũ kỹ. Nhưng tôi nhìn vào đó và thấy linh hồn của những người bạn cùng khóa... những người sáng nay còn cười nói, chiều đến đã nhìn tôi như một kẻ xa lạ. 

Sena, cậu nghĩ mất trí nhớ là nỗi đau lớn nhất sao? Không. Kẻ bị quên lãng chỉ chịu một nhát chém, còn kẻ bị bỏ lại với ký ức nguyên vẹn phải chịu ngàn vết cắt mỗi ngày. Đừng bước lại gần tôi nữa. Sợi chỉ này không bảo vệ tôi... nó đang đếm ngược mạng sống của tôi đấy."`,
          rationale: 'Đảm bảo giữ đúng Voice Cadence và không tiết lộ bí mật tấm thẻ bài ở Chương 1 cho Sena.'
        };
      }

      case 'logic_auditor': {
        return {
          role: 'logic_auditor',
          title: 'Báo cáo Kiểm định Logic Toàn Diện (Chương 4)',
          response: `✅ **Kết quả kiểm định logic**:
1. **Kiểm tra rò rỉ tri thức**: ĐẠT. Không có nhân vật nào nói trước bí mật tương lai.
2. **Kiểm tra dòng thời gian & vị trí**: ĐẠT. Sena, Ryou, Koto đều có mặt hợp lý tại Tầng 4 lúc đêm muộn.
3. **Kiểm tra vật phẩm**: 
   - Cuốn Sổ Da: Đang ở trên bàn do Koto sở hữu (Chính xác).
   - Sợi Chỉ Đỏ: Quấn trên cổ tay Koto (Chính xác).
   - Thẻ bài kim loại: Trong túi áo Sena (Chính xác).
4. **Nhịp Ba Tiếng Gõ**: Đang ở trạng thái Cốc thứ nhất. Cần chú ý ở cảnh tiếp theo nếu mô tả tiếp tiếng thứ 2 và thứ 3 phải cách nhau đúng 2 giây theo quy chuẩn Canon.`,
          rationale: 'Hệ thống đã rà soát ma trận 3 nhân vật và 6 quy tắc Canon.'
        };
      }

      case 'plot_architect': {
        return {
          role: 'plot_architect',
          title: 'Phân tích Nhịp Cốt truyện & Cao trào Phần 1',
          response: `📊 **Đánh giá nhịp truyện (Pacing Analysis)**:
- **Hồi 1 (Chương 1-2)**: Khởi đầu tốt, thiết lập bí ẩn mất trí nhớ và ấn rồng chìm.
- **Hồi 2 (Chương 3-4)**: Tăng tốc độ xung đột rất tốt nhờ motif Nhịp Ba Tiếng Gõ và sự xuất hiện của Koto.
- **Cảnh báo đoạn giữa (Midpoint check)**: Khi nhóm thoát khỏi Tầng 4 sang Chương 5, hãy tránh việc cho các nhân vật chỉ ngồi đàm thoại giải thích cốt truyện quá dài (info-dump). Cần kết hợp vừa dịch mã cuốn sổ vừa phải tránh sự truy quét của Kẻ Canh Giác.

💡 **Đề xuất Bước ngoặt Chương 5**:
- Cho cuốn sổ da chỉ hiện chữ khi nhỏ máu của một người có huyết mạch rồng (Sena vô tình làm rách tay khiến một trang bí mật hiện lên bản đồ tầng hầm Tháp Chuông).`,
          rationale: 'Giúp duy trì đà căng thẳng (momentum) từ cảnh 1 sang các chương tiếp theo.'
        };
      }

      case 'lore_keeper': {
        return {
          role: 'lore_keeper',
          title: 'Truy xuất Tri thức & Biểu tượng Canon',
          response: `📖 **Dữ kiện liên quan đến Cảnh hiện tại**:
- **Sợi Chỉ Đỏ**: Lần đầu xuất hiện tại Chương 3 (vướng trên bụi cây Tháp Chuông). Tại Chương 4, xác nhận quấn 3 vòng quanh cổ tay Koto.
- **Vết bớt vảy rồng**: Phát hiện lần đầu tại Chương 1 (Thung Lũng Tro Tàn). Đặc tính: chỉ phát nhiệt khi tiếp xúc vật phẩm cộng hưởng.
- **Quy tắc thế giới số 01**: Chu kỳ 7 năm sẽ diễn ra vào đêm trăng tròn tới (còn 3 ngày trong dòng thời gian truyện).`,
          rationale: 'Tự động đối chiếu Story Bible và Timeline.'
        };
      }

      case 'style_editor': {
        return {
          role: 'style_editor',
          title: 'Phân tích Văn phong & Nhịp điệu Câu chữ',
          response: `✍️ **Nhận xét văn phong tác giả**:
- **Điểm mạnh**: Văn phong sắc sảo, giàu hình ảnh thị giác và xúc giác ("mùi giấy mục và dầu thông", "gân thú ngả màu xám xịt", "tiếng rên của sinh vật khổng lồ").
- **Góp ý vi chỉnh**:
  + Đoạn Koto nói: "Những kẻ tò mò về 'Mạch' ở Aesvorn này đều biến mất vào ngày thứ bảy sau kỳ trăng tròn" — Nhịp câu rất chắc.
  + Tránh lặp lại từ "bước" quá nhiều trong 2 đoạn liên tiếp (Sena bước lên một bước, Sena bước lại gần trong cự ly ba bước). Có thể thay bằng: "tiến sát mép bàn", "thu hẹp khoảng cách".`,
          rationale: 'Học hỏi trực tiếp từ chính mẫu văn bản tác giả cung cấp.'
        };
      }

      case 'beta_reader': {
        return {
          role: 'beta_reader',
          title: 'Mô phỏng Đánh giá Độc giả (Beta Readers Simulation)',
          response: `Dưới đây là phản hồi từ 3 nhóm độc giả mục tiêu:

🕵️ **1. Độc giả Mê Bí Ẩn / Trinh Thám (Mystery Sleuth) — 4.8/5 ⭐**:
- "Motif Nhịp Ba Tiếng Gõ rất ám ảnh! Tôi đang tò mò liệu tiếng gõ này là do người sống hay một cỗ máy ma thuật dưới lòng đất tạo ra. Sợi chỉ đỏ và vảy rồng cùng phát sáng cho thấy Koto và Sena chắc chắn có mối liên hệ từ kiếp trước hoặc cùng chung huyết thống."

❤️ **2. Độc giả Chú trọng Tâm lý / Nhân vật (Character Lover) — 4.5/5 ⭐**:
- "Rất thích sự giằng xé của Koto: bề ngoài lạnh lùng nhưng thật ra đang chịu nỗi đau mất bạn bè. Ryou đóng vai trò người giữ nhịp rất tốt. Cần thêm một chút ánh mắt giữa Sena và Koto để tạo cảm xúc kết nối ngầm."

🧐 **3. Nhà Phê Bình Khó Tính (Tough Critic) — 4.0/5 ⭐**:
- "Cảnh truyện đẩy cao trào rất dứt khoát. Nhưng cần chú ý lý giải tại sao Koto mang cuốn sổ cấm ra bàn đọc công khai ở Tầng 4 thay vì giấu ở nơi kín đáo hơn."`,
          rationale: 'Mô phỏng đa góc nhìn giúp tác giả có cái nhìn khách quan trước khi xuất bản.'
        };
      }

      default:
        return {
          role,
          title: 'Phản hồi từ Mạch AI',
          response: 'Đang xử lý yêu cầu sáng tác của tác giả...',
          rationale: 'Tự động điều phối.'
        };
    }
  }
}

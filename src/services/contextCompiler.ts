import { Chapter, Scene, Part, Character, BibleFact, ForeshadowingHook } from '../types';

export interface CompiledContextPackage {
  summary: string;
  currentScene: {
    title: string;
    pov: string;
    location: string;
    timeOfDay: string;
    goal: string;
    conflict: string;
    revelation: string;
    nextHook: string;
    content: string;
  };
  recentScenes: {
    title: string;
    chapterTitle: string;
    excerpt: string;
  }[];
  charactersInScene: {
    name: string;
    role: string;
    voiceCadence: string;
    currentEmotionalState: string;
    itemsCarried: string[];
    allowedKnowledge: string[];
    forbiddenKnowledge: string[];
  }[];
  canonWorldRules: string[];
  activeForeshadowing: {
    title: string;
    status: string;
    description: string;
  }[];
  authorStyleExcerpt: string;
  assembledPromptContext: string;
}

export class ContextCompiler {
  static compileSceneContext(
    currentScene: Chapter | Scene | any,
    allParts: Part[],
    allCharacters: Character[],
    allBibleFacts: BibleFact[],
    allHooks: ForeshadowingHook[]
  ): CompiledContextPackage {
    // 1. Gather all chapters/scenes for preceding context
    const allFlatChapters: { chapter: Chapter; partTitle: string }[] = [];
    allParts.forEach(p => {
      p.chapters.forEach(c => {
        allFlatChapters.push({ chapter: c, partTitle: p.title });
      });
    });

    const currentIndex = allFlatChapters.findIndex(item => item.chapter.id === currentScene.id);
    const recentScenes: { title: string; chapterTitle: string; excerpt: string }[] = [];

    if (currentIndex > 0) {
      const start = Math.max(0, currentIndex - 2);
      for (let i = start; i < currentIndex; i++) {
        const item = allFlatChapters[i];
        recentScenes.push({
          title: item.chapter.title,
          chapterTitle: item.partTitle,
          excerpt: (item.chapter.content || '').slice(-400)
        });
      }
    }

    // 2. Characters in scene and their strict knowledge limits
    const presentChars = allCharacters.filter(c => 
      currentScene.presentCharacterIds?.includes(c.id) || currentScene.povCharacterId === c.id || allCharacters.length <= 3
    );

    const charactersInScene = presentChars.map(char => {
      // Find latest knowledge record for this chapter or earlier
      const knowledgeRec = [...char.knowledgeTracker].reverse()[0];
      return {
        name: char.name,
        role: char.role,
        voiceCadence: char.bio.voiceCadence,
        currentEmotionalState: char.dynamicState.emotionalState,
        itemsCarried: char.dynamicState.itemsCarried,
        allowedKnowledge: knowledgeRec ? knowledgeRec.knownSecrets : [],
        forbiddenKnowledge: knowledgeRec ? knowledgeRec.forbiddenSecrets : []
      };
    });

    // 3. Canon facts only (ignore deprecated, suggested only if verified)
    const canonWorldRules = allBibleFacts
      .filter(f => f.status === 'canon')
      .map(f => `[${f.category.toUpperCase()}] ${f.title}: ${f.content}`);

    // 4. Active foreshadowing hooks linked to this scene or chapter
    const activeForeshadowing = allHooks
      .filter(h => currentScene.foreshadowingIds?.includes(h.id) || h.status === 'developing' || h.status === 'planted')
      .map(h => ({
        title: h.title,
        status: h.status,
        description: h.description
      }));

    // 5. Extract author style sample (e.g. from Prologue or Chapter 1)
    let authorStyleExcerpt = `Có một thứ mà con người sợ hơn cái chết: bị quên khi vẫn còn đang sống...`;
    if (allFlatChapters.length > 0 && allFlatChapters[0].chapter.content) {
      authorStyleExcerpt = allFlatChapters[0].chapter.content.slice(0, 350);
    }

    // 6. Writing Principles from "nguyên tắc viết.txt" (Mandatory for AI)
    const writingPrinciplesPrompt = [
      `[NGUYÊN TẮC VIẾT TIỂU THUYẾT (TỐI QUAN TRỌNG - AI BẮT BUỘC TUÂN THỦ)]`,
      `1. Triết lý cốt lõi:`,
      `   - "Có một thứ mà con người sợ hơn cái chết: bị quên khi vẫn còn đang sống." Ký ức nằm trong khoảng không gian giữa vật chất, không nằm trong tường hay đá. Nơi bị xóa ký ức sẽ trở nên "lệch" (glitch).`,
      `   - Tuyệt đối không dùng những lời giải thích lấp liếm ("Tòa nhà cũ mà", "Chắc nhìn nhầm") như chân lý, mà dùng chúng như sự né tránh của người đời.`,
      `2. Văn phong & Tiết tấu:`,
      `   - Giọng văn trần thuật điềm tĩnh, hơi lạnh, giàu chất suy tư hiện sinh; câu từ chậm rãi, giàu xúc giác (mùi đất ẩm, nắng vàng vệt hẹp, hơi thở phả khói trắng, luồng lạnh buốt ở gáy).`,
      `   - Tuyệt đối KHÔNG dùng văn phong kiếm hiệp hoa mỹ sáo rỗng. Đối thoại tự nhiên, xen kẽ hài hước đời thường (bánh mì kẹp trứng, phản xạ ăng-ten).`,
      `3. Cử chỉ & Ngôn ngữ cơ thể nhân vật:`,
      `   - Sena: Viết nhật ký đêm từ năm 12 tuổi để neo giữ thời gian, nhạy cảm với vết nứt không gian, buốt thái dương khi cố nhớ.`,
      `   - Koto (người Namec da xanh lục): Ăng-ten cụp xuống khi suy nghĩ/tập trung; dựng thẳng đứng cứng đờ khi cảnh giác cao độ; đặt từng chữ cẩn trọng như bước trên băng mỏng.`,
      `   - Ryou: Có chiếc đuôi nâu sẫm quấn quanh hông (siết chặt khi đông người, thả lỏng khi an toàn); gõ ngón tay khi suy nghĩ; tính tình thẳng thắn.`,
      `4. Các motif thế giới cấm phá vỡ:`,
      `   - Nhịp ba tiếng gõ (Tốc — tốc — tốc): Ba ngón tay giữa chụm lại gõ; LUÔN có tiếng gõ thứ tư vô hình dội lại từ khoảng trống.`,
      `   - Cuốn sổ da nâu sẫm: Gáy có sợi chỉ đỏ quấn quanh (tự đứt và quấn quanh cổ tay Koto); Trang 4 ghi "VẾT NỨT HƯ KHÔNG" và 3 chấm tròn nhỏ trong vòng tròn mờ.`
    ].join('\n');

    // 7. Assemble into structured prompt context string
    const promptLines: string[] = [
      `=== GÓI NGỮ CẢNH CÂU CHUYỆN "MẠCH" (STORY CONTEXT COMPILER) ===`,
      `[CẢNH HIỆN TẠI]: ${currentScene.title}`,
      `- Góc nhìn (POV): ${currentScene.povCharacterName || 'Ngôi thứ ba'}`,
      `- Địa điểm: ${currentScene.location || 'Chưa xác định'}`,
      `- Thời điểm: ${currentScene.timeOfDay || 'Chưa xác định'}`,
      `- Mục tiêu cảnh: ${currentScene.sceneGoal}`,
      `- Xung đột: ${currentScene.conflict}`,
      `- Móc nối tiếp theo (Next Hook): ${currentScene.nextHook}`,
      '',
      writingPrinciplesPrompt,
      '',
      `[NHÂN VẬT HIỆN DIỆN & GIỚI HẠN TRI THỨC]:`,
      ...charactersInScene.map(c => 
        `* ${c.name} (${c.role}):\n  - Giọng văn/Cách nói: ${c.voiceCadence}\n  - Tâm lý hiện tại: ${c.currentEmotionalState}\n  - Vật phẩm đang mang: ${c.itemsCarried.join(', ') || 'Không mang theo gì'}\n  - TRI THỨC ĐƯỢC BIẾT: ${c.allowedKnowledge.join('; ') || 'Chỉ thông tin cơ bản'}\n  - TUYỆT ĐỐI CẤM BIẾT (FORBIDDEN): ${c.forbiddenKnowledge.join('; ') || 'Không có'}`
      ),
      '',
      `[QUY TẮC THẾ GIỚI CHÍNH THỨC (CANON)]:`,
      ...canonWorldRules.slice(0, 5),
      '',
      `[TÌNH TIẾT PHỤC BÚT ĐANG THEO DÕI]:`,
      ...activeForeshadowing.map(h => `- ${h.title} (${h.status}): ${h.description}`),
      '',
      `[VĂN PHONG TÁC GIẢ THAM CHIẾU]:`,
      `"${authorStyleExcerpt}..."`,
      '==============================================================='
    ];

    const assembledPromptContext = promptLines.join('\n');

    return {
      summary: `Ngữ cảnh cảnh "${currentScene.title}" với ${charactersInScene.length} nhân vật (${charactersInScene.map(c => c.name).join(', ')}), ${canonWorldRules.length} quy luật Canon, và ${activeForeshadowing.length} phục bút.`,
      currentScene: {
        title: currentScene.title,
        pov: currentScene.povCharacterName || 'Ngôi thứ ba',
        location: currentScene.location || '',
        timeOfDay: currentScene.timeOfDay || '',
        goal: currentScene.sceneGoal,
        conflict: currentScene.conflict,
        revelation: currentScene.revelation,
        nextHook: currentScene.nextHook,
        content: currentScene.content
      },
      recentScenes,
      charactersInScene,
      canonWorldRules,
      activeForeshadowing,
      authorStyleExcerpt,
      assembledPromptContext
    };
  }
}

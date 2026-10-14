import React, { useState } from 'react';
import {
  Flame,
  Zap,
  Wind,
  Snowflake,
  Shield,
  Sword,
  Target,
  Sparkles,
  Users,
  Compass,
  ArrowRight,
  RotateCcw,
  Play,
  Heart,
  Eye,
  Crosshair,
  Layers,
  Crown
} from 'lucide-react';

interface GameShowcasePageProps {
  onNavigate: (path: string) => void;
}

// 3 Chủng Tộc (NRO)
interface RaceInfo {
  id: 'saiyan' | 'earthling' | 'namek';
  name: string;
  nroTitle: string;
  badge: string;
  color: string;
  bgLight: string;
  borderLight: string;
  description: string;
  passiveName: string;
  passiveDesc: string;
  awakeningForm: string;
  awakeningDesc: string;
  traits: string[];
}

const RACES: RaceInfo[] = [
  {
    id: 'saiyan',
    name: 'Tộc Saiyan (Xayda)',
    nroTitle: 'Chiến Binh Vũ Trụ • Cuồng Nộ',
    badge: 'Cận Chiến & Bạo Kích',
    color: '#D9534F',
    bgLight: '#FFF5F5',
    borderLight: '#FED7D7',
    description:
      'Hậu duệ của tộc chiến binh hiếu chiến đến từ vũ trụ. Họ giấu chiếc đuôi nâu quấn quanh hông để ngụy trang, sở hữu thể lực siêu phàm và khát khao chiến đấu bẩm sinh.',
    passiveName: 'Cuồng Huyết Zenkai',
    passiveDesc:
      'Khi lượng máu tụt xuống dưới 30%, sát thương vật lý và tốc độ đánh tăng 50%, miễn nhiễm hoàn toàn hiệu ứng làm chậm.',
    awakeningForm: 'Huyết Diễm Cuồng Long (Super Saiyan Dragon Form)',
    awakeningDesc:
      'Đuôi rực cháy hào quang đỏ, cơ bắp cuồn cuộn mọc giáp vảy rồng. Mỗi nhát đao chém ra tạo sóng xung kích nổ áp suất cực lớn càn quét bản đồ.',
    traits: ['Sát thương bùng nổ khi thấp máu', 'Càng đánh càng hăng', 'Kháng choáng tự nhiên']
  },
  {
    id: 'earthling',
    name: 'Tộc Trái Đất (Nhân Tộc)',
    nroTitle: 'Ý Chí Thích Nghi • Khí Nén',
    badge: 'Tốc Độ & Thấu Thị',
    color: '#2B6CB0',
    bgLight: '#EBF8FF',
    borderLight: '#BEE3F8',
    description:
      'Chủng tộc bản địa với ý chí kiên cường và khả năng kiểm soát dòng chảy Khí (Ki) tinh tế nhất. Họ nhạy cảm đặc biệt với các vết nứt không-thời gian và sự lãng quên.',
    passiveName: 'Khí Kình Thấu Điểm',
    passiveDesc:
      'Nén Khí vào vũ khí đạt độ sắc bén tuyệt đối. Có 15% xác suất mỗi đòn đánh bỏ qua 100% giáp của kẻ thù. Thể lực hồi nhanh hơn 25%.',
    awakeningForm: 'Hư Không Long Nhẫn (Void Dragon Sage)',
    awakeningDesc:
      'Toàn thân phủ ánh bạc trong suốt, mở ra 4 tàn ảnh phân thân tấn công phụ trợ. Nhận 100% tỷ lệ né đòn và bạo kích tối đa trong 15 giây.',
    traits: ['Né đòn phản công (Parry) chuẩn xác', 'Tốc độ hồi Khí cực nhanh', 'Khắc chế giáp cứng']
  },
  {
    id: 'namek',
    name: 'Tộc Namec (Linh Tộc)',
    nroTitle: 'Tâm Linh Cổ Xưa • Tế Bào Thần',
    badge: 'Trị Liệu & Phong Ấn',
    color: '#2F855A',
    bgLight: '#F0FFF4',
    borderLight: '#C6F6D5',
    description:
      'Chủng tộc da xanh lục nhạt với đôi ăng-ten cảm ứng sóng âm và mắt tím xám. Họ là người gìn giữ các bí thuật phong ấn, trận đồ cổ và hạt giống linh mộc.',
    passiveName: 'Linh Mộc Tái Sinh',
    passiveDesc:
      'Tự động hồi phục 2% máu tối đa mỗi 3 giây. Đôi ăng-ten giúp phát hiện trước bẫy và tàng hình của quái vật trong bán kính 20 mét.',
    awakeningForm: 'Cổ Thần Namec Hộ Pháp (Giant Divine Dragon)',
    awakeningDesc:
      'Cơ thể hóa khổng lồ một phần, phủ lớp vảy rồng xanh bích bất hoại. Tỏa ra hào quang thần thánh trị liệu toàn bộ đồng đội và làm câm lặng chiêu thức kẻ địch.',
    traits: ['Hồi phục sinh lực vô tận', 'Kéo dài khoảng cách giao tranh', 'Khống chế diện rộng']
  }
];

// 6 Phái Ninja (NSO)
interface ClassInfo {
  id: 'dao' | 'kiem' | 'kunai' | 'tieu' | 'cung' | 'quat';
  name: string;
  weapon: string;
  element: string;
  icon: React.ElementType;
  color: string;
  bgLight: string;
  role: string;
  attackType: string;
  skills: string[];
  description: string;
}

const CLASSES: ClassInfo[] = [
  {
    id: 'dao',
    name: 'Đao Phái',
    weapon: 'Trọng Đao / Trảm Mã Đao',
    element: 'Hệ Hỏa (Lửa)',
    icon: Flame,
    color: '#C53030',
    bgLight: '#FFF5F5',
    role: 'Tiên Phong • Càn Quét',
    attackType: 'Cận chiến diện rộng',
    skills: ['Hỏa Liệt Trảm (4 nhịp)', 'Toái Thạch Long Xoay', 'Nham Thạch Hộ Thể', 'Chân Long Liệt Diễm'],
    description:
      'Vũ khí nặng ngàn cân, đường đao cuồn cuộn sức mạnh thiêu đốt. Dùng áp lực của đao để nghiền nát khiên chắn và gom quái vật vào vòng lửa.'
  },
  {
    id: 'kiem',
    name: 'Kiếm Phái',
    weapon: 'Trường Kiếm / Katana',
    element: 'Hệ Phong (Gió)',
    icon: Wind,
    color: '#319795',
    bgLight: '#E6FFFA',
    role: 'Sát Thương Chủ Lực (DPS)',
    attackType: 'Cận - Trung chiến tốc độ',
    skills: ['Tật Phong Bạt Kiếm', 'Vô Ảnh Trảm (Lướt 4 lần)', 'Kiếm Khí Xé Rách', 'Phong Thần Tuyệt Trảm'],
    description:
      'Thân kiếm sắc lẹm, chém ra kiếm khí xé gió tầm xa. Khả năng lướt xuyên mục tiêu liên hoàn và kết liễu kẻ thù bằng những đòn bạo kích kinh hoàng.'
  },
  {
    id: 'kunai',
    name: 'Kunai Phái',
    weapon: 'Phi Dao Kunai & Cước Linh Lực',
    element: 'Hệ Lôi (Sấm Sét)',
    icon: Zap,
    color: '#D69E2E',
    bgLight: '#FFFFF0',
    role: 'Sát Thủ Ám Sát • Cơ Động',
    attackType: 'Cận chiến chớp giật',
    skills: ['Lôi Vũ Kunai', 'Thuấn Di Dẫn Sét', 'Ảnh Trận Vô Hình', 'Thiên Lôi Phạt Tru'],
    description:
      'Cặp phi dao nhỏ gọn gắn sợi cước vô hình. Cắm cọc dẫn lôi đình để dịch chuyển tức thời, dồn sát thương bùng nổ vào điểm yếu đối phương trong chớp mắt.'
  },
  {
    id: 'tieu',
    name: 'Tiêu Phái',
    weapon: 'Phi Tiêu Shuriken Đa Cánh',
    element: 'Hệ Băng (Băng Giá)',
    icon: Snowflake,
    color: '#3182CE',
    bgLight: '#EBF8FF',
    role: 'Khống Chế • Xạ Thủ Tầm Xa',
    attackType: 'Tầm xa đa mục tiêu',
    skills: ['Băng Tinh Tam Tiêu', 'Hàn Băng Tỏa Cước', 'Vũ Bão Băng Shuriken', 'Cực Hàn Tuyệt Ngục'],
    description:
      'Phóng ra hàng loạt phi tiêu tẩm hàn khí. Có khả năng làm chậm tốc độ di chuyển và đóng băng vĩnh cửu mặt đất, thả diều kẻ thù từ cự ly an toàn.'
  },
  {
    id: 'cung',
    name: 'Cung Phái',
    weapon: 'Đại Cung Linh Lực',
    element: 'Hệ Hư Không (Quang Khí)',
    icon: Target,
    color: '#805AD5',
    bgLight: '#FAF5FF',
    role: 'Xạ Thủ Bắn Xa • Phá Giáp',
    attackType: 'Tầm siêu xa xuyên thấu',
    skills: ['Tụ Lực Xuyên Vân Tiễn', 'Mưa Tên Hư Không', 'Bẫy Quang Trận', 'Long Hồn Thần Tiễn'],
    description:
      'Kéo căng dây cung tụ nén Khí công vũ trụ, bắn ra những mũi tên xuyên thủng mọi lớp tường đá và áo giáp. Đòn bẫy rập không gian khóa chặt Boss.'
  },
  {
    id: 'quat',
    name: 'Quạt Phái',
    weapon: 'Thiết Phiến (Quạt Thép Trận Đồ)',
    element: 'Hệ Thần Mộc & Thủy',
    icon: Heart,
    color: '#38A169',
    bgLight: '#F0FFF4',
    role: 'Trị Liệu Sư • Hỗ Trợ Đội Ngũ',
    attackType: 'Tầm trung kiểm soát',
    skills: ['Bích Mộc Cuồng Phong', 'Hồi Xuân Linh Chú', 'Kết Giới Hóa Giải', 'Thần Long Hồi Sinh'],
    description:
      'Quạt thép bung mở vẽ nên các trận đồ bảo hộ. Đẩy lùi kẻ thù bằng lốc xoáy ma thuật, hồi phục máu liên tục và giải trừ toàn bộ bùa chú suy yếu cho đồng minh.'
  }
];

// Ma Trận 18 Lối Chơi: [Race] x [Class]
interface ArchetypeDetail {
  title: string;
  epithet: string;
  playstyle: string;
  signatureSkill: string;
  stats: { atk: number; def: number; spd: number; rng: number; sup: number };
}

const ARCHETYPES: Record<string, ArchetypeDetail> = {
  'saiyan-dao': {
    title: 'Hỏa Long Cuồng Đao',
    epithet: 'Cỗ Máy Hủy Diệt Cận Chiến',
    playstyle: 'Lấy máu đổi sát thương, chém ra sóng lửa chấn động, càn quét toàn bộ quái vật dã ngoại.',
    signatureSkill: 'Cuồng Long Bạo Liệt Trảm (Kèm nổ áp suất)',
    stats: { atk: 98, def: 85, spd: 70, rng: 50, sup: 30 }
  },
  'saiyan-kiem': {
    title: 'Chiến Khí Bạt Kiếm',
    epithet: 'Nhát Kiếm Xé Đôi Không Gian',
    playstyle: 'Tập trung Khí Saiyan vào lưỡi kiếm, rút kiếm nhanh hơn âm thanh, bạo kích chí mạng cực hạn.',
    signatureSkill: 'X-Slash Chiến Ý Vũ Trụ',
    stats: { atk: 95, def: 65, spd: 90, rng: 65, sup: 30 }
  },
  'saiyan-kunai': {
    title: 'Lôi Nộ Ám Bộ',
    epithet: 'Tia Sét Cuồng Bạo',
    playstyle: 'Kết hợp thể chất dã chiến với lôi điện, lao thẳng vào giữa đội hình địch giáng sấm sét.',
    signatureSkill: 'Hoang Lôi Trụy Địa',
    stats: { atk: 90, def: 70, spd: 92, rng: 60, sup: 35 }
  },
  'saiyan-tieu': {
    title: 'Bạo Liệt Tiêu',
    epithet: 'Pháo Thủ Shuriken Tầm Xa',
    playstyle: 'Ném phi tiêu bọc Khí công phát nổ như lựu đạn khi chạm mục tiêu, khống chế diện rộng.',
    signatureSkill: 'Băng Hỏa Liên Hoàn Bạo Tiêu',
    stats: { atk: 88, def: 60, spd: 80, rng: 88, sup: 45 }
  },
  'saiyan-cung': {
    title: 'Long Pháo Thần Cung',
    epithet: 'Đại Pháo Tầm Siêu Xa',
    playstyle: 'Dùng thể lực quái vật kéo đại cung, bắn ra mũi tên tụ khí nổ tung như chưởng lực Kamehameha.',
    signatureSkill: 'Diệt Thế Thần Long Tiễn',
    stats: { atk: 96, def: 60, spd: 65, rng: 98, sup: 35 }
  },
  'saiyan-quat': {
    title: 'Liệt Phong Cuồng Phiến',
    epithet: 'Chiến Binh Quạt Đập Trực Diện',
    playstyle: 'Dùng quạt thép như vũ khí gõ cận chiến kết hợp bão tố đẩy lùi, vừa trâu vừa đánh rát.',
    signatureSkill: 'Cuồng Phong Bạo Thiết Vũ',
    stats: { atk: 82, def: 80, spd: 75, rng: 60, sup: 60 }
  },

  // Trái Đất
  'earthling-dao': {
    title: 'Kim Cang Trảm Đao',
    epithet: 'Đao Khí Xuyên Giáp',
    playstyle: 'Dùng sự chuẩn xác của Khí để mài bén đao, chém thẳng vào điểm yếu bỏ qua toàn bộ giáp trụ.',
    signatureSkill: 'Hư Điểm Đoạn Kim Trảm',
    stats: { atk: 88, def: 75, spd: 80, rng: 55, sup: 40 }
  },
  'earthling-kiem': {
    title: 'Tật Phong Vô Ảnh Kiếm',
    epithet: 'Bậc Thầy Thân Pháp Kiếm Đạo',
    playstyle: 'Lướt liên tục không tốn thể lực, tạo ra ảo ảnh đánh lừa quái vật và parry mọi đòn đánh.',
    signatureSkill: 'Vô Ảnh Bát Bộ Kiếm',
    stats: { atk: 90, def: 65, spd: 96, rng: 65, sup: 45 }
  },
  'earthling-kunai': {
    title: 'Ảnh Nhẫn Thập Phương',
    epithet: 'Kẻ Săn Điểm Chết Hư Không',
    playstyle: 'Phóng Kunai nối cước linh lực khóa góc chết, dịch chuyển ra sau lưng đối thủ găm dao chí mạng.',
    signatureSkill: 'Hư Nghịch Trảm (Sena Signature)',
    stats: { atk: 92, def: 60, spd: 98, rng: 70, sup: 50 }
  },
  'earthling-tieu': {
    title: 'Băng Phách Thần Tiêu',
    epithet: 'Cơn Ác Mộng Thả Diều',
    playstyle: 'Ném cụm 5 tiêu đóng băng vĩnh cửu bước chân kẻ thù, không cho quái vật có cơ hội chạm vào người.',
    signatureSkill: 'Băng Vũ Cửu Thiên',
    stats: { atk: 85, def: 65, spd: 90, rng: 92, sup: 60 }
  },
  'earthling-cung': {
    title: 'Hư Không Thần Tiễn',
    epithet: 'Mũi Tên Xuyên Không Gian',
    playstyle: 'Nhìn thấu vết nứt, bắn mũi tên xuyên qua cả tường đá và chướng ngại vật trúng đích 100%.',
    signatureSkill: 'Toái Không Xuyên Tâm Tiễn',
    stats: { atk: 92, def: 60, spd: 82, rng: 99, sup: 50 }
  },
  'earthling-quat': {
    title: 'Cửu Cung Phong Ấn Phiến',
    epithet: 'Kẻ Cầm Tù Không Gian',
    playstyle: 'Vẽ trận đồ quạt phong ấn vùng đất, làm đứng yên toàn bộ kẻ thù trong trận địa.',
    signatureSkill: 'Cửu Tinh Tỏa Long Trận',
    stats: { atk: 75, def: 75, spd: 85, rng: 75, sup: 85 }
  },

  // Namec
  'namek-dao': {
    title: 'Bích Mộc Trọng Đao',
    epithet: 'Trường Đao Bất Hoại',
    playstyle: 'Vươn dài cánh tay chém đao cự ly bất ngờ, vừa chém vừa hút sinh lực hồi phục liên tục.',
    signatureSkill: 'Mộc Long Hút Máu Trảm',
    stats: { atk: 80, def: 90, spd: 65, rng: 70, sup: 65 }
  },
  'namek-kiem': {
    title: 'Linh Hồn Phá Kiếm',
    epithet: 'Kiếm Sĩ Ma Pháp Tâm Linh',
    playstyle: 'Mỗi nhát kiếm cắt đứt nguồn năng lượng của kẻ địch, làm câm lặng kỹ năng và phá kết giới.',
    signatureSkill: 'Phá Hồn Tuyệt Kỹ',
    stats: { atk: 82, def: 80, spd: 78, rng: 70, sup: 70 }
  },
  'namek-kunai': {
    title: 'Huyết Tinh Ma Châm',
    epithet: 'Ám Khí Ký Sinh',
    playstyle: 'Kunai găm vào người địch sinh sôi gai mộc, làm chậm và rút cạn nội lực đối phương về bản thân.',
    signatureSkill: 'Bích Linh Ma Châm Phược',
    stats: { atk: 80, def: 75, spd: 85, rng: 75, sup: 75 }
  },
  'namek-tieu': {
    title: 'Ký Sinh Ma Tiêu',
    epithet: 'Trận Địa Dây Leo Khống Chế',
    playstyle: 'Phi tiêu hóa thành rễ cây cổ thụ trói chân toàn bộ quái vật, tạo điều kiện cho đồng đội xả chiêu.',
    signatureSkill: 'Vạn Cổ Mộc Trận',
    stats: { atk: 78, def: 82, spd: 75, rng: 90, sup: 85 }
  },
  'namek-cung': {
    title: 'Trường Sinh Thần Cung',
    epithet: 'Cung Thủ Thanh Tẩy Hộ Vệ',
    playstyle: 'Bắn mưa tên mang năng lượng thần mộc, vừa gây sát thương quái vừa hồi máu cho đồng minh.',
    signatureSkill: 'Quang Mộc Cứu Sinh Vũ',
    stats: { atk: 80, def: 80, spd: 75, rng: 95, sup: 88 }
  },
  'namek-quat': {
    title: 'Cổ Thần Trị Liệu Sư',
    epithet: 'Thần Y Bảo Hộ Tối Cao (Koto Signature)',
    playstyle: 'Hồi phục sinh lực vô hạn, triệu hồi kết giới rồng thần bảo hộ, xóa bỏ mọi lời nguyền và hồi sinh.',
    signatureSkill: 'Đại Thần Long Hồi Sinh Thuật',
    stats: { atk: 70, def: 88, spd: 80, rng: 80, sup: 100 }
  }
};

export const GameShowcasePage: React.FC<GameShowcasePageProps> = ({ onNavigate }) => {
  const [selectedRace, setSelectedRace] = useState<'saiyan' | 'earthling' | 'namek'>('saiyan');
  const [selectedClass, setSelectedClass] = useState<'dao' | 'kiem' | 'kunai' | 'tieu' | 'cung' | 'quat'>('dao');
  const [rageLevel, setRageLevel] = useState<number>(0);
  const [isAwakened, setIsAwakened] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'matrix' | 'races' | 'classes' | 'awakening' | 'roadmap'>('matrix');

  const currentArchetypeKey = `${selectedRace}-${selectedClass}`;
  const currentArchetype = ARCHETYPES[currentArchetypeKey] || ARCHETYPES['saiyan-dao'];
  const activeRaceObj = RACES.find((r) => r.id === selectedRace)!;
  const activeClassObj = CLASSES.find((c) => c.id === selectedClass)!;

  // Handle Rage test button
  const handleAddRage = () => {
    if (rageLevel >= 100) {
      setRageLevel(0);
      setIsAwakened(false);
    } else {
      const next = Math.min(100, rageLevel + 35);
      setRageLevel(next);
      if (next >= 100) {
        setIsAwakened(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#293B36] font-['Nunito'] pb-24">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#E4F1E9]/70 via-[#FFFDF8] to-[#FFFDF8] border-b border-[#DCE6DF] pt-12 pb-16 px-4 sm:px-6 md:px-8">
        <div className="max-w-[1120px] mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#376F64]/10 border border-[#376F64]/20 text-[#376F64] text-xs sm:text-sm font-bold tracking-wide">
            <Sparkles className="w-4 h-4 text-[#376F64]" />
            DỰ ÁN GAME CHUYỂN THỂ ĐỘC QUYỀN TỪ TIỂU THUYẾT
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#293B36] leading-[1.15]">
            SOUL SEAL: THỨC TỈNH LONG ẤN
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-[#5F706A] max-w-3xl mx-auto leading-relaxed">
            Tuyệt phẩm 2D Action RPG kết hợp linh hồn <strong className="text-[#376F64]">Ngọc Rồng (NRO)</strong> và{' '}
            <strong className="text-[#376F64]">Ninja School (NSO)</strong>. Bước vào Học viện Aesvorn, chọn 1 trong 3
            chủng tộc vũ trụ, rèn luyện 6 phái nhẫn đạo và khai mở sức mạnh Thức Tỉnh Cổ Thần Long.
          </p>

          {/* Quick stats pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <span className="px-3.5 py-1.5 rounded-xl bg-white border border-[#DCE6DF] text-xs font-bold shadow-sm flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#C53030]" /> 3 Chủng Tộc Vũ Trụ
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-white border border-[#DCE6DF] text-xs font-bold shadow-sm flex items-center gap-1.5">
              <Sword className="w-4 h-4 text-[#319795]" /> 6 Đại Phái Nhẫn Giả
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-white border border-[#DCE6DF] text-xs font-bold shadow-sm flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#D69E2E]" /> 18 Biến Thể Lối Chơi
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-white border border-[#DCE6DF] text-xs font-bold shadow-sm flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-[#805AD5]" /> 5 Tầng Long Ấn Thức Tỉnh
            </span>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="pt-6 flex flex-wrap justify-center gap-2">
            {[
              { id: 'matrix', label: '🎮 Mô Phỏng 18 Lối Chơi', icon: SlidersIcon },
              { id: 'races', label: '🧬 3 Chủng Tộc (NRO)', icon: Users },
              { id: 'classes', label: '⚔️ 6 Phái Nhẫn Giả (NSO)', icon: Sword },
              { id: 'awakening', label: '🐉 Cơ Chế Thức Tỉnh Long Thân', icon: Sparkles },
              { id: 'roadmap', label: '🗺️ Vòng Chơi & Lộ Trình', icon: Compass }
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-sm ${
                    active
                      ? 'bg-[#376F64] text-white shadow-md scale-105'
                      : 'bg-white text-[#293B36] border border-[#DCE6DF] hover:bg-[#F2F8F5]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT ACCORDING TO ACTIVE TAB */}
      <main className="max-w-[1120px] mx-auto px-4 sm:px-6 md:px-8 mt-10">
        {/* ================= TAB 1: 18 COMBINATIONS SIMULATOR ================= */}
        {activeTab === 'matrix' && (
          <div className="space-y-10">
            {/* Control Panel: Select Race & Class */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCE6DF] shadow-sm space-y-6">
              <div className="border-b border-[#DCE6DF] pb-4">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#293B36] flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#376F64]"></span>
                  BỘ MÔ PHỎNG NRO × NSO: TÙY BIẾN NHÂN VẬT NHẬP VAI
                </h2>
                <p className="text-xs sm:text-sm text-[#5F706A] mt-1">
                  Chọn 1 Chủng Tộc và 1 Môn Phái để khám phá danh tính, kỹ năng độc quyền và chỉ số chiến đấu:
                </p>
              </div>

              {/* Step 1: Pick Race */}
              <div className="space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#5F706A]">
                  BƯỚC 1: CHỌN CHỦNG TỘC (NRO ORIGIN)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {RACES.map((race) => {
                    const isSelected = selectedRace === race.id;
                    return (
                      <button
                        key={race.id}
                        onClick={() => setSelectedRace(race.id)}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'border-[#376F64] bg-[#E4F1E9]/60 shadow-md ring-2 ring-[#376F64]/30'
                            : 'border-[#DCE6DF] bg-[#FFFDF8] hover:border-[#376F64]/40 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-sm sm:text-base text-[#293B36]">{race.name}</span>
                          <span
                            className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                            style={{ backgroundColor: race.bgLight, color: race.color }}
                          >
                            {race.badge}
                          </span>
                        </div>
                        <p className="text-xs text-[#5F706A] mt-1 line-clamp-1">{race.nroTitle}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Pick Class */}
              <div className="space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#5F706A]">
                  BƯỚC 2: CHỌN HỆ PHÁI NINJA (NSO CLASS)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                  {CLASSES.map((cls) => {
                    const isSelected = selectedClass === cls.id;
                    const IconComp = cls.icon;
                    return (
                      <button
                        key={cls.id}
                        onClick={() => setSelectedClass(cls.id)}
                        className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                          isSelected
                            ? 'border-[#376F64] bg-[#E4F1E9]/80 shadow-md ring-2 ring-[#376F64]/30'
                            : 'border-[#DCE6DF] bg-[#FFFDF8] hover:border-[#376F64]/40 hover:bg-white'
                        }`}
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                          style={{ backgroundColor: cls.bgLight, color: cls.color }}
                        >
                          <IconComp className="w-5 h-5" />
                        </div>
                        <span className="font-extrabold text-xs text-[#293B36]">{cls.name}</span>
                        <span className="text-[10px] text-[#5F706A]">{cls.element}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Step 3: Archetype Result Card */}
            <div className="bg-gradient-to-br from-white via-white to-[#F7FAF8] rounded-3xl p-6 sm:p-8 border border-[#DCE6DF] shadow-md grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Archetype Presentation */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#376F64] text-white text-xs font-extrabold tracking-wide uppercase">
                    HỆ PHÁI KẾT HỢP #{selectedRace.toUpperCase()}-{selectedClass.toUpperCase()}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#E4F1E9] text-[#376F64] text-xs font-bold">
                    {activeRaceObj.name} × {activeClassObj.name}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#293B36]">{currentArchetype.title}</h3>
                  <p className="text-sm font-semibold text-[#376F64] italic">{currentArchetype.epithet}</p>
                </div>

                <p className="text-sm text-[#5F706A] leading-relaxed">{currentArchetype.playstyle}</p>

                {/* Highlighted Signature Skill */}
                <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#DCE6DF] space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-[#293B36]">
                    <Sparkles className="w-4 h-4 text-[#D69E2E]" />
                    <span>TUYỆT KỸ TRẤN PHÁI:</span>
                  </div>
                  <p className="text-sm font-extrabold text-[#C53030]">{currentArchetype.signatureSkill}</p>
                  <p className="text-xs text-[#5F706A]">
                    Được cường hóa trực tiếp bởi nội tại <strong className="text-[#293B36]">{activeRaceObj.passiveName}</strong>{' '}
                    và nguyên tố <strong className="text-[#293B36]">{activeClassObj.element}</strong>.
                  </p>
                </div>

                {/* Race & Weapon Highlights */}
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-[#DCE6DF]">
                    <span className="text-[#5F706A] block text-[10px] uppercase font-bold">Vũ khí chính:</span>
                    <strong className="text-[#293B36]">{activeClassObj.weapon}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-[#DCE6DF]">
                    <span className="text-[#5F706A] block text-[10px] uppercase font-bold">Nội tại chủng tộc:</span>
                    <strong className="text-[#293B36]">{activeRaceObj.passiveName}</strong>
                  </div>
                </div>
              </div>

              {/* Right Column: Stat Bars & Radar Representation */}
              <div className="lg:col-span-5 bg-[#FFFDF8] rounded-2xl p-5 border border-[#DCE6DF] space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#5F706A] flex items-center justify-between">
                  <span>CHỈ SỐ THI ĐẤU MÔ PHỎNG</span>
                  <span className="text-[#376F64]">CÂN BẰNG T17</span>
                </h4>

                <div className="space-y-3">
                  {[
                    { label: 'Sát Thương (ATK)', val: currentArchetype.stats.atk, color: 'bg-red-500' },
                    { label: 'Phòng Ngự / Chống Chịu (DEF)', val: currentArchetype.stats.def, color: 'bg-blue-500' },
                    { label: 'Tốc Độ & Cơ Động (SPD)', val: currentArchetype.stats.spd, color: 'bg-emerald-500' },
                    { label: 'Tầm Đánh / Khống Chế (RNG)', val: currentArchetype.stats.rng, color: 'bg-amber-500' },
                    { label: 'Hỗ Trợ / Trị Liệu (SUP)', val: currentArchetype.stats.sup, color: 'bg-purple-500' }
                  ].map((stat) => (
                    <div key={stat.label} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-[#293B36]">
                        <span>{stat.label}</span>
                        <span>{stat.val}/100</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#E2E8F0] overflow-hidden">
                        <div
                          className={`h-full rounded-full ${stat.color} transition-all duration-500`}
                          style={{ width: `${stat.val}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#DCE6DF] flex items-center justify-between text-[11px] text-[#5F706A]">
                  <span>Đồng bộ tiểu thuyết:</span>
                  <span className="font-bold text-[#376F64]">
                    {selectedRace === 'saiyan' && selectedClass === 'dao' && 'Đại diện: Ryou'}
                    {selectedRace === 'earthling' && selectedClass === 'kunai' && 'Đại diện: Sena'}
                    {selectedRace === 'namek' && selectedClass === 'quat' && 'Đại diện: Koto'}
                    {!(
                      (selectedRace === 'saiyan' && selectedClass === 'dao') ||
                      (selectedRace === 'earthling' && selectedClass === 'kunai') ||
                      (selectedRace === 'namek' && selectedClass === 'quat')
                    ) && 'Học viên Học viện Aesvorn'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: 3 RACES DETAILS ================= */}
        {activeTab === 'races' && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#293B36]">
                TAM ĐẠI CHỦNG TỘC VŨ TRỤ (NRO INHERITANCE)
              </h2>
              <p className="text-sm text-[#5F706A]">
                Hậu duệ của các chiến binh vũ trụ tị nạn trên Trái Đất sau trận đại chiến phá vỡ Thần Long Châu.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {RACES.map((race) => (
                <div
                  key={race.id}
                  className="bg-white rounded-3xl p-6 border border-[#DCE6DF] shadow-sm flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className="text-xs px-3 py-1 rounded-full font-bold"
                        style={{ backgroundColor: race.bgLight, color: race.color }}
                      >
                        {race.badge}
                      </span>
                      <span className="text-xs text-[#5F706A] font-bold">NRO DNA</span>
                    </div>

                    <h3 className="text-xl font-extrabold text-[#293B36]">{race.name}</h3>
                    <p className="text-xs text-[#5F706A] font-semibold">{race.nroTitle}</p>
                    <p className="text-xs sm:text-sm text-[#293B36]/80 leading-relaxed">{race.description}</p>
                  </div>

                  {/* Passive & Awakening */}
                  <div className="space-y-3 pt-3 border-t border-[#DCE6DF]">
                    <div className="p-3 rounded-2xl bg-[#FFFDF8] border border-[#DCE6DF] space-y-1">
                      <span className="text-[10px] font-extrabold uppercase text-[#5F706A]">Nội tại sinh học:</span>
                      <p className="text-xs font-bold text-[#376F64]">{race.passiveName}</p>
                      <p className="text-[11px] text-[#5F706A]">{race.passiveDesc}</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#FFFDF8] border border-[#DCE6DF] space-y-1">
                      <span className="text-[10px] font-extrabold uppercase text-[#5F706A]">Thức tỉnh Long Thể:</span>
                      <p className="text-xs font-bold text-[#C53030]">{race.awakeningForm}</p>
                      <p className="text-[11px] text-[#5F706A]">{race.awakeningDesc}</p>
                    </div>
                  </div>

                  {/* Traits List */}
                  <ul className="space-y-1 text-xs text-[#5F706A] pt-2">
                    {race.traits.map((t) => (
                      <li key={t} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#376F64]"></span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: 6 CLASSES DETAILS ================= */}
        {activeTab === 'classes' && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#293B36]">
                LỤC ĐẠI HỆ PHÁI NINJA (NSO INHERITANCE)
              </h2>
              <p className="text-sm text-[#5F706A]">
                6 pháp môn nhẫn đạo tại Học viện Aesvorn, giúp học viên định hình và giải phóng Khí qua vũ khí bí truyền.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CLASSES.map((cls) => {
                const IconComp = cls.icon;
                return (
                  <div
                    key={cls.id}
                    className="bg-white rounded-3xl p-6 border border-[#DCE6DF] shadow-sm flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center"
                          style={{ backgroundColor: cls.bgLight, color: cls.color }}
                        >
                          <IconComp className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#E4F1E9] text-[#376F64]">
                          {cls.role}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg font-extrabold text-[#293B36]">{cls.name}</h3>
                        <p className="text-xs text-[#5F706A]">{cls.element} • {cls.weapon}</p>
                      </div>

                      <p className="text-xs sm:text-sm text-[#5F706A] leading-relaxed">{cls.description}</p>
                    </div>

                    {/* Skill Tree Snapshot */}
                    <div className="p-3.5 rounded-2xl bg-[#FFFDF8] border border-[#DCE6DF] space-y-2">
                      <span className="text-[10px] font-extrabold uppercase text-[#5F706A]">Bộ Kỹ Năng Tiêu Biểu:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {cls.skills.map((sk) => (
                          <span
                            key={sk}
                            className="text-[11px] px-2 py-0.5 rounded-lg bg-white border border-[#DCE6DF] text-[#293B36] font-semibold"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB 4: AWAKENING ENGINE DEMO ================= */}
        {activeTab === 'awakening' && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#293B36]">
                CƠ CHẾ THỨC TỈNH LONG ẤN (SOUL SEAL AWAKENING)
              </h2>
              <p className="text-sm text-[#5F706A]">
                Hệ thống nộ chiêu chuyển dạng độc quyền, lật ngược thế trận trong chớp mắt trước Boss Hồn Thú.
              </p>
            </div>

            {/* Interactive Rage Gauge Demonstration */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCE6DF] shadow-md max-w-2xl mx-auto space-y-6 text-center">
              <div className="flex items-center justify-between text-xs font-extrabold uppercase text-[#5F706A]">
                <span>THANH HỒN LỰC LONG NỘ (DRAGON RAGE)</span>
                <span className="text-[#C53030] font-black">{rageLevel}% / 100%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-5 rounded-full bg-[#E2E8F0] p-1 overflow-hidden relative shadow-inner">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    rageLevel >= 100
                      ? 'bg-gradient-to-r from-amber-500 via-red-500 to-rose-600 animate-pulse'
                      : 'bg-gradient-to-r from-[#376F64] to-[#2F855A]'
                  }`}
                  style={{ width: `${rageLevel}%` }}
                ></div>
              </div>

              {/* Status Message */}
              <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#DCE6DF]">
                {rageLevel === 0 && (
                  <p className="text-xs text-[#5F706A]">
                    Đánh combo thường 4 nhịp hoặc né đòn hoàn hảo (Perfect Parry) để tích lũy Hồn Lực.
                  </p>
                )}
                {rageLevel > 0 && rageLevel < 50 && (
                  <p className="text-xs font-bold text-[#376F64]">
                    ✨ BẬC 1: Đã kích hoạt [Cường Hóa Ấn Chú] — Đòn đánh tiếp theo kèm hiệu ứng Long Nha!
                  </p>
                )}
                {rageLevel >= 50 && rageLevel < 100 && (
                  <p className="text-xs font-bold text-[#D69E2E]">
                    ⚡ BẬC 2: [Nhẫn Cảnh Long Vực Sẵn Sàng] — Giảm thời gian hồi chiêu và thuấn di tức thời!
                  </p>
                )}
                {rageLevel >= 100 && (
                  <p className="text-sm font-extrabold text-[#C53030] animate-bounce">
                    🔥 BẬC 3: ĐẠI THỨC TỈNH LONG THÂN BÙNG NỔ! BA TIẾNG GÕ "TỐC — TỐC — TỐC"!
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handleAddRage}
                  className="px-6 py-3 rounded-2xl bg-[#376F64] hover:bg-[#2B5A51] text-white font-extrabold text-sm shadow-md transition-all active:scale-95 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  {rageLevel >= 100 ? 'Hạ Hỏa / Đặt Lại' : 'Tích Thêm 35% Long Nộ'}
                </button>
              </div>

              <p className="text-[11px] text-[#5F706A] italic">
                *Khi kích hoạt Thức Tỉnh tối thượng, nhân vật sẽ biến hình toàn diện, mở khóa đòn kết liễu cinematic và
                gây sát thương quét sạch quái vật trên màn hình.
              </p>
            </div>

            {/* 5 Levels Details */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-4">
              {[
                { lv: 'Tầng 1', name: 'Tinh Hồn Ấn', desc: 'Khai mở kinh mạch, cảm ứng Khí và Chakra vi mô.' },
                { lv: 'Tầng 2', name: 'Khí Huyết Ấn', desc: 'Bản năng chủng tộc thức giấc: Đuôi nóng, ăng-ten dựng, thấu thị vết nứt.' },
                { lv: 'Tầng 3', name: 'Nhẫn Cảnh Long Ấn', desc: 'Mở kết giới Long Vực, dịch chuyển tức thời Hư Không Thuấn Di.' },
                { lv: 'Tầng 4', name: 'Long Hóa Chân Thân', desc: 'Siêu biến hình: Huyết Diễm Cuồng Long, Hư Không Long Nhẫn, Cổ Thần Namec.' },
                { lv: 'Tầng 5', name: 'Vô Danh Thần Ấn', desc: 'Thực thể Vết Nứt với 2 cái bóng song song, viết lại dòng ký ức.' }
              ].map((tier, idx) => (
                <div key={tier.lv} className="bg-white rounded-2xl p-4 border border-[#DCE6DF] text-center space-y-1.5 shadow-sm">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#E4F1E9] text-[#376F64]">
                    {tier.lv}
                  </span>
                  <h4 className="font-extrabold text-xs text-[#293B36]">{tier.name}</h4>
                  <p className="text-[11px] text-[#5F706A] leading-relaxed">{tier.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 5: ROADMAP & SPECS ================= */}
        {activeTab === 'roadmap' && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#293B36]">
                VÒNG CHƠI CỐT LÕI & LỘ TRÌNH PHÁT TRIỂN GAME
              </h2>
              <p className="text-sm text-[#5F706A]">
                Dự án xây dựng trên nền tảng Unity 2D ARPG, dung lượng tối ưu &lt; 100MB cho Mobile và PC.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pillar 1 */}
              <div className="bg-white rounded-3xl p-6 border border-[#DCE6DF] space-y-4">
                <span className="text-xs font-black uppercase text-[#376F64]">PHASE 1: PROTOTYPE T17</span>
                <h3 className="text-lg font-extrabold text-[#293B36]">Vertical Slice 5 Phút</h3>
                <ul className="text-xs text-[#5F706A] space-y-2">
                  <li>• 1 Nhân vật: Ryou (Tộc Saiyan cầm Đao).</li>
                  <li>• 1 Map mẫu: Thôn Khởi Nguyên (Tilemap 32x32).</li>
                  <li>• 2 Quái thường và 1 Boss Hồn Thú gác cổng.</li>
                  <li>• Cơ chế đánh combo 4 nhịp, Dash né đòn và kích nộ Long Ấn.</li>
                  <li>• Build .exe (Windows) và .apk (Android) mượt mà 60fps.</li>
                </ul>
              </div>

              {/* Pillar 2 */}
              <div className="bg-white rounded-3xl p-6 border border-[#DCE6DF] space-y-4">
                <span className="text-xs font-black uppercase text-[#319795]">PHASE 2: ALPHA COMBAT</span>
                <h3 className="text-lg font-extrabold text-[#293B36]">Đủ 3 Tộc & 6 Môn Phái</h3>
                <ul className="text-xs text-[#5F706A] space-y-2">
                  <li>• Mở khóa Sena (Kunai) và Koto (Quạt).</li>
                  <li>• Bổ sung hệ thống Kiếm, Tiêu, Cung.</li>
                  <li>• Hệ thống trang bị, cường hóa ấn chú và rèn vũ khí.</li>
                  <li>• Đấu trường PvP 1vs1 cân bằng chỉ số.</li>
                </ul>
              </div>

              {/* Pillar 3 */}
              <div className="bg-white rounded-3xl p-6 border border-[#DCE6DF] space-y-4">
                <span className="text-xs font-black uppercase text-[#805AD5]">PHASE 3: UNIVERSE SYNC</span>
                <h3 className="text-lg font-extrabold text-[#293B36]">Đồng Bộ Tiểu Thuyết & Webtoon</h3>
                <ul className="text-xs text-[#5F706A] space-y-2">
                  <li>• Các ải cốt truyện phát hành song song từng chương truyện chữ.</li>
                  <li>• Phụ bản Đáy Vực Aesvorn và Bí mật Kẻ Không Tồn Tại.</li>
                  <li>• Tính năng Bang Hội Nhẫn Giả và Đua Top Săn Boss Thế Giới.</li>
                </ul>
              </div>
            </div>

            {/* CTA Back to Reading */}
            <div className="p-8 rounded-3xl bg-gradient-to-r from-[#E4F1E9] to-[#FFFDF8] border border-[#DCE6DF] text-center space-y-4">
              <h3 className="text-xl font-extrabold text-[#293B36]">
                Sẵn sàng khám phá nguồn gốc câu chuyện trong tiểu thuyết?
              </h3>
              <p className="text-xs sm:text-sm text-[#5F706A] max-w-xl mx-auto">
                Toàn bộ bí ẩn về Vết Nứt Hư Không, sinh viên áo trắng hai cái bóng và cuộc chạm trán đầu tiên của Sena,
                Ryou, Koto đang chờ bạn tại các chương truyện chính văn.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('/muc-luc')}
                  className="px-6 py-2.5 rounded-2xl bg-[#376F64] hover:bg-[#2B5A51] text-white font-bold text-xs shadow-md transition-all"
                >
                  Đọc Truyện Ngay
                </button>
                <button
                  onClick={() => onNavigate('/nhan-vat')}
                  className="px-6 py-2.5 rounded-2xl bg-white border border-[#DCE6DF] hover:bg-gray-50 text-[#293B36] font-bold text-xs transition-all"
                >
                  Xem Hồ Sơ Nhân Vật
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Helper icon component
function SlidersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="4" x2="4" y1="21" y2="14" />
      <line x1="4" x2="4" y1="10" y2="3" />
      <line x1="12" x2="12" y1="21" y2="12" />
      <line x1="12" x2="12" y1="8" y2="3" />
      <line x1="20" x2="20" y1="21" y2="16" />
      <line x1="20" x2="20" y1="12" y2="3" />
      <line x1="1" x2="7" y1="14" y2="14" />
      <line x1="9" x2="15" y1="8" y2="8" />
      <line x1="17" x2="23" y1="16" y2="16" />
    </svg>
  );
}

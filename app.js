/* ============================================================
   占い師タイプ診断 — data & logic
   1人あたり必ず20問(共通2問 + グループ別スコアリング18問)
   ============================================================ */

const ICONS = {
  astro:      '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M40 20a14 14 0 1 0 0 24 10.5 10.5 0 0 1 0-24Z"/><circle cx="46" cy="18" r="1.6" fill="currentColor" stroke="none"/></svg>',
  meijutsu:   '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="32" r="16"/><line x1="32" y1="10" x2="32" y2="18"/><line x1="32" y1="46" x2="32" y2="54"/><line x1="10" y1="32" x2="18" y2="32"/><line x1="46" y1="32" x2="54" y2="32"/><circle cx="32" cy="32" r="3"/></svg>',
  suuhi:      '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="26" r="10"/><circle cx="40" cy="26" r="10"/><circle cx="32" cy="40" r="10"/></svg>',
  eki:        '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="16" y1="20" x2="48" y2="20"/><line x1="16" y1="32" x2="27" y2="32"/><line x1="37" y1="32" x2="48" y2="32"/><line x1="16" y1="44" x2="48" y2="44"/></svg>',
  consultant: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="14,44 26,32 34,38 50,18"/><polyline points="40,18 50,18 50,28"/></svg>',
  seimei:     '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="32" cy="32" r="4"/><circle cx="32" cy="32" r="13" opacity=".55"/><circle cx="32" cy="32" r="21" opacity=".3"/></svg>',
  zenze:      '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 32c0-5 4-9 9-9s7 9 7 9-2 9-7 9-9-4-9-9Z"/><path d="M48 32c0-5-4-9-9-9s-7 9-7 9 2 9 7 9 9-4 9-9Z"/></svg>',
  tarot:      '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="20" y="13" width="24" height="38" rx="3"/><path d="M32 24l2.6 5.4 5.9 0.9-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.1 5.9-0.9Z"/></svg>',
  rune:       '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="26" y1="14" x2="26" y2="50"/><line x1="26" y1="20" x2="42" y2="14"/><line x1="26" y1="32" x2="42" y2="26"/></svg>',
  yume:       '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M30 20a12 12 0 1 0 0 20 9 9 0 0 1 0-20Z"/><path d="M38 42h7l-7 7h7"/></svg>',
  pendulum:   '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15h22l-11 11Z"/><line x1="32" y1="26" x2="32" y2="41"/><circle cx="32" cy="47" r="6"/></svg>',
  kansou:     '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 32s8-13 19-13 19 13 19 13-8 13-19 13-19-13-19-13Z"/><circle cx="32" cy="32" r="4.5"/></svg>',
  psychic:    '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 36s7-11 15-11 15 11 15 11-7 11-15 11-15-11-15-11Z"/><circle cx="32" cy="36" r="3.2"/><line x1="32" y1="14" x2="32" y2="21"/><line x1="19" y1="19" x2="23" y2="24"/><line x1="45" y1="19" x2="41" y2="24"/></svg>',
  healer:     '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M32 15c11 4 17 15 17 25-11 0-17-6-17-15 0 9-6 15-17 15 0-10 6-21 17-25Z"/><line x1="32" y1="20" x2="32" y2="47"/></svg>',
  channel:    '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="42" r="3" fill="currentColor" stroke="none"/><path d="M23 33a13 13 0 0 1 18 0"/><path d="M16 26a23 23 0 0 1 32 0"/></svg>',
};

const TYPES = {
  astro: {
    name: "占星術師タイプ", title: "星詠み",
    catch: "星の配置を読む理論派",
    desc: "星々の巡りや周期から、物語ではなく法則としてタイミングを読み解くタイプ。目先の出来事より「大きな流れ」を捉えるのが得意で、長期的な視点でアドバイスするのに向いています。",
    history: "占星術の起源は紀元前2000年頃の古代バビロニアに遡り、天体の動きから国家の運命を占う王侯占星術として発展した。ヘレニズム期にギリシャへ伝わると、天文学者プトレマイオスが『テトラビブロス』で理論体系を確立し、西洋占星術の礎を築いた。近世には予言者ノストラダムスが『諸世紀』で名を馳せ、20世紀には心理学者カール・ユングが元型論と結びつけて心理占星術の道を開いた。",
    people: "プトレマイオス / ノストラダムス / カール・ユング",
  },
  meijutsu: {
    name: "命術占い師タイプ", title: "宿曜の設計士",
    catch: "データが語る宿命の設計図",
    desc: "生年月日という揺るがないデータから、その人の資質や巡り合わせを体系的に解き明かすタイプ。感覚に頼らず、理論という土台の上で信頼を積み上げるのが得意です。",
    history: "起源は古代中国の陰陽五行説と干支暦にあり、生年月日を「四柱」に見立てて運命を読む思想が育まれた。唐代の学者・李虚中が基礎を築き、宋代の徐子平がこれを大成させたため、四柱推命は「子平術」とも呼ばれる。日本には奇門遁甲や九星気学として伝来し、江戸時代以降、独自の発展を遂げた由緒ある命術である。",
    people: "李虚中 / 徐子平",
  },
  suuhi: {
    name: "数秘術師タイプ", title: "数霊の巫女",
    catch: "数字にパターンを見出すアナリスト",
    desc: "数字の並びやリズムに意味を見出し、論理と直感の中間で答えを組み立てるタイプ。シンプルな法則で複雑な人生を整理するのが得意です。",
    history: "数秘術の源流は「万物は数である」と説いた古代ギリシャの数学者ピタゴラスにある。彼が率いた学派では、数は宇宙の秩序そのものとみなされた。時代を経て20世紀初頭、アメリカのL・ダウ・バリエットが誕生日や名前を数値化する現代数秘術の体系を確立し、大きな反響を呼んだ。以来、西洋占星術と並ぶ人気の占術として世界に広まっている。",
    people: "ピタゴラス / L・ダウ・バリエット",
  },
  eki: {
    name: "易占い師タイプ", title: "易者",
    catch: "二進法で運命を切り開く決断者",
    desc: "二者択一の積み重ねから答えを導く、潔さと集中力を武器にするタイプ。迷いを長引かせず、今この瞬間の一手を信じて進むのが得意です。",
    history: "易占いの起源は紀元前1000年頃、中国・周の時代に成立した現存最古の占術書『易経』にある。儒教の経典の一つに数えられ、思想家・孔子も晩年これを愛読し注釈を加えたと伝わる。陰陽の組み合わせによる64通りの卦は哲学的にも高く評価され、17世紀の哲学者ライプニッツはその並びから二進法の着想を得たという逸話が残る。",
    people: "孔子 / ライプニッツ",
  },
  consultant: {
    name: "コンサルタント・アドバイザータイプ", title: "開運参謀",
    catch: "現実を動かす実践派",
    desc: "占いの結果を「次の一歩」に変換するのが得意なタイプ。感情より行動計画を渡すことで、相手の背中を押すのが得意です。",
    history: "そのルーツは、占術や兵法を駆使して主君を導いた古の「軍師」にある。中国三国時代の諸葛亮(孔明)は天文と易に通じ、日本では戦国時代の黒田官兵衛や竹中半兵衛が知略で主君を支えた参謀として知られる。現代ではこの系譜が形を変え、経営判断やキャリア選択を占術的な視点から支援するビジネスアドバイザーとして発展している。",
    people: "諸葛亮(孔明) / 黒田官兵衛 / 竹中半兵衛",
  },
  seimei: {
    name: "姓名判断・言霊師タイプ", title: "言霊師",
    catch: "言葉の響きに宿る力を読む人",
    desc: "名前や言葉そのものに宿る力を信じ、響きから運気やその人らしさを読み解くタイプ。言葉選び一つで人を励ませる力を持っています。",
    history: "言葉に宿る力を信じる「言霊信仰」は日本古来の思想で、奈良時代の『万葉集』にも「言霊の幸ふ国」という一節が残る。姓名判断そのものは中国の五行思想を土台に発展し、明治時代の日本で熊崎健翁が画数を用いた「熊崎式姓名学」を確立したことで庶民にも広く普及した。今日でも新生児の命名などで画数や響きを重視する文化が受け継がれている。",
    people: "熊崎健翁",
  },
  zenze: {
    name: "前世療法・ヒプノセラピストタイプ", title: "退行催眠士",
    catch: "過去世から今を紐解く探求者",
    desc: "今の悩みの根っこを、目に見えない過去や潜在意識まで遡って探すタイプ。表面的な解決より、深い納得を大事にします。",
    history: "前世療法の思想的な源流は、輪廻転生を説く仏教やヒンドゥー教にある。近代的な形になったのは20世紀後半で、アメリカの精神科医ブライアン・ワイス博士が患者の退行催眠中に前世の記憶らしきものに遭遇した体験を著書『前世療法』にまとめ、世界的ベストセラーとなったことがきっかけだった。以来、心理療法や自己探求の手段として世界中に広まっている。",
    people: "ブライアン・ワイス",
  },
  tarot: {
    name: "タロット占い師タイプ", title: "絵解き師",
    catch: "物語で導く直感の紡ぎ手",
    desc: "一枚の絵の中に無数の意味を見出し、相談者ごとに違う物語を紡ぐタイプ。同じ悩みにも、毎回新しい角度から光を当てるのが得意です。",
    history: "タロットの起源は15世紀のイタリアで誕生した、貴族の遊戯用カード「タロッキ」にある。18世紀フランスの神秘思想家アントワーヌ・クール・ド・ジェブランやエリファス・レヴィが占術としての意味づけを行い体系化した。20世紀初頭には神秘思想家A・E・ウェイトと画家パメラ・コールマン・スミスが手がけた「ライダー・ウェイト版」が発表され、世界標準のデッキとして今も広く使われている。",
    people: "エリファス・レヴィ / A・E・ウェイト / パメラ・コールマン・スミス",
  },
  rune: {
    name: "ルーン・オラクルタイプ", title: "符呪師",
    catch: "一瞬の直感で核心を突く人",
    desc: "一つの記号やメッセージから、長い説明なしに本質をつかみ取るタイプ。シンプルな言葉で相手の迷いをスッと晴らします。",
    history: "ルーン文字は2〜3世紀頃、北欧・ゲルマン民族が用いた古代のアルファベットで、文字であると同時に呪術的な力を持つ記号ともされていた。北欧神話の詩『ハヴァマール』では、主神オーディンが自らを世界樹ユグドラシルに9日間吊るす苦行の末に、ルーンの知恵を得たと語られている。現代ではオラクルカードと並び、直感的なメッセージ占術として親しまれている。",
    people: "オーディン(北欧神話)",
  },
  yume: {
    name: "夢占い師タイプ", title: "夢解き師",
    catch: "無意識の物語を読み解く人",
    desc: "眠っている間に見る夢という、もう一つの現実から意味を汲み取るタイプ。言葉にならない感情の正体を、そっと言語化するのが得意です。",
    history: "夢を通じて神の意志を知る「夢占い」は、古代エジプトやギリシャの神殿で盛んに行われた儀式に起源を持つ。近代に入り、精神分析学の創始者ジークムント・フロイトが著書『夢判断』で夢を無意識の願望が表れたものと理論化したことで、心理学的な裏付けを得ることとなった。後継者ユングもまた元型(アーキタイプ)の概念から夢を分析し、夢占いの奥行きをさらに広げた。",
    people: "ジークムント・フロイト / カール・ユング",
  },
  pendulum: {
    name: "ペンデュラム・ダウジングタイプ", title: "振り子の巫女",
    catch: "YES/NOで潜在意識とつながる人",
    desc: "道具のわずかな揺れを通じて、自分でも気づいていない答えを引き出すタイプ。まさにこの診断のように、シンプルな問いの連続で真実に辿り着きます。",
    history: "ダウジングの歴史は古く、中世ヨーロッパでは鉱脈や水脈を探す実用的な技術として、L字の棒や振り子が用いられてきた。20世紀にはスイスの神父アレクシス・メルメが、その現象を科学的に検証しようと研究を重ね、体系立てた著作を残したことで知られる。現代ではYES/NOで潜在意識に問いかける、精神的な自己対話のツールとして親しまれている。",
    people: "アレクシス・メルメ",
  },
  kansou: {
    name: "観相・手相占い師タイプ", title: "人相見",
    catch: "見た目と仕草を読む観察者",
    desc: "表情や手のしわ、仕草といった「今その人に現れているサイン」を見逃さないタイプ。データより、目の前の相手をじっくり観察するのが得意です。",
    history: "人相を見て性格や運勢を判断する人相学は、古代ギリシャの哲学者アリストテレスも論じたと伝わるほど歴史が古い。手相学(パルミストリー)はインドを起源に、シルクロードを通じてヨーロッパへと伝わった。19世紀イギリスでは「キロ」という名で活動した手相占い師が、著名な文豪マーク・トウェインなどを次々と鑑定し、社交界で絶大な人気を博したことで知られている。",
    people: "アリストテレス / キロ / マーク・トウェイン",
  },
  psychic: {
    name: "サイキック・霊感タイプ", title: "霊媒師",
    catch: "エネルギーを感じ取る感応者",
    desc: "言葉が発せられる前に、場の空気や相手の気配を感じ取るタイプ。理由は説明できなくても、その直感はよく当たります。",
    history: "近代スピリチュアリズムは1848年、アメリカ・ニューヨーク州でフォックス姉妹が謎の「ラップ音」を霊との交信として披露したことに端を発する。この出来事をきっかけに、欧米では降霊会が大流行した。20世紀に入ると、霊媒師アイリーン・ガレットが自らの能力を科学者に提供し、超心理学の研究対象として協力したことでも広く知られている。",
    people: "フォックス姉妹 / アイリーン・ガレット",
  },
  healer: {
    name: "ヒーラー・カウンセラータイプ", title: "拝み屋",
    catch: "寄り添い癒す伴走者",
    desc: "答えを急がず、まず気持ちに寄り添うことを大切にするタイプ。何度もそばにいることで、相手の心を少しずつ軽くしていきます。",
    history: "癒しの技術としてのヒーリングは、世界各地のシャーマニズムに古くから見られる伝統である。日本で親しまれる系譜としては、大正時代に臼井甕男が創始した「霊気(レイキ)」療法や、ハワイの伝統的な問題解決法「ホ・オポノポノ」が代表的。いずれも特別な道具を使わず、手や言葉を通じて心を整えるという考え方を軸に、現代のセラピー文化として世界へ広がっている。",
    people: "臼井甕男",
  },
  channel: {
    name: "チャネラー・スピリチュアルメッセンジャータイプ", title: "口寄せ師",
    catch: "見えない声を取り次ぐ媒介者",
    desc: "自分の考えというより、どこか別のところから降りてくる言葉を相手に届けるタイプ。伝える役割に徹することで、相手に大きな気づきをもたらします。",
    history: "死者や霊的存在の言葉を生きた人間が代わりに伝える文化は世界各地にあり、日本の東北地方には「イタコ」と呼ばれる口寄せの伝統が今も残る。青森県の恐山は、例大祭の時期にイタコが集まることで知られる霊媒の聖地である。海外では19世紀フランスの教育者アラン・カルデックが、交霊会の記録をもとに「交霊術(スピリティスム)」という体系を確立し、世界的に広めた。",
    people: "アラン・カルデック",
  },
};

// ---- Phase 1: 全員共通の導入2問(グループ振り分け) ----
const ENTRY_Q1 = {
  text: "目の前で時計が逆回りに動き出しても、まず壊れた理由を確かめたくなる方だ",
  branch: (yes) => yes ? "logic" : "intuition",
};
const ENTRY_Q2_LOGIC = {
  text: "初対面の相手の話より、その人の忘れ物の中身の方が本音を語る気がする",
  branch: (yes) => yes ? "A" : "B",
};
const ENTRY_Q2_INTUITION = {
  text: "誰かの本音より、手元のカードや振り子の揺れの方が信用できる",
  branch: (yes) => yes ? "C" : "D",
};

// ---- Phase 2: グループ別 各18問(スコアリング式) ----
const GROUPS = {
  A: {
    types: ["astro", "meijutsu", "suuhi", "eki"],
    questions: [
      { text: "夜、月を見上げると、今日の自分の調子が今の月の形と関係している気がしてくる", yes: { astro: 3 } },
      { text: "生まれた瞬間に、人生の設計図はすでに描き終わっていたと考える方がしっくりくる", yes: { meijutsu: 4 } },
      { text: "エレベーターの階数表示が特定の数字を通過するとき、一瞬だけ数え直してしまう", yes: { suuhi: 3 } },
      { text: "重要な決断ほど、コインを投げて出た面に従いたくなる瞬間がある", yes: { eki: 3 } },
      { text: "運命は「今この瞬間の配置」で変わると思う", yes: { astro: 2 }, no: { meijutsu: 2 } },
      { text: "答えは「積み重ねた数字の先」にあると思う", yes: { suuhi: 3 }, no: { eki: 3 } },
      { text: "自分の誕生日と同じ数字を街で見かけると、その日は何か起きる予感がする", yes: { astro: 2, suuhi: 2 } },
      { text: "家系図をたどれば、自分の性格の理由がどこかに見つかる気がする", yes: { meijutsu: 4 } },
      { text: "パスワードを決めるとき、語呂より「バランスの良い数字の並び」を優先する", yes: { suuhi: 3 } },
      { text: "「はい」か「いいえ」しか選べない世界の方が、実は生きやすいと思う", yes: { eki: 3 } },
      { text: "子どもの頃、星座早見盤や暦をいじって遊んだ記憶がある", yes: { astro: 2 } },
      { text: "自分の性格は「火」や「水」のような元素に例えられる方がしっくりくる", yes: { meijutsu: 2 } },
      { text: "迷ったときは、直近の出来事より「何年かけて繰り返してきたか」を思い出す方だ", yes: { astro: 2 }, no: { eki: 2 } },
      { text: "サイコロを転がすと、出た目に意味を探してしまう方だ", yes: { eki: 3 } },
      { text: "運命というものが実在するなら、それは変えられない方がロマンチックだと思う", yes: { meijutsu: 2 } },
      { text: "静寂しかない世界と雑音しかない世界、選べるなら静寂を選ぶ", yes: { suuhi: 2 }, no: { eki: 1 } },
      { text: "誰も見ていない鏡の中の自分は、今の自分と少し違う気がする", yes: { astro: 1 }, no: { meijutsu: 1 } },
      { text: "結果を人に伝えるとき、「巡り合わせ」という言葉の方が「積み上げ」という言葉よりしっくりくる", yes: { astro: 2 }, no: { suuhi: 2 } },
    ],
  },
  B: {
    types: ["consultant", "seimei", "zenze"],
    questions: [
      { text: "誰かの相談を受けたら、まず「今すぐ変えられること」を3つ挙げたくなる", yes: { consultant: 3 } },
      { text: "人の名前を聞くと、その字面や響きの意味をつい考えてしまう", yes: { seimei: 3 } },
      { text: "「前にもこんな感覚になったことがある」と、初めての場所で感じることがある", yes: { zenze: 3 } },
      { text: "相談された悩みは、感情よりまず構造(原因と結果)に分解したくなる", yes: { consultant: 2, seimei: 1 } },
      { text: "名刺交換をするとき、肩書きより名前の漢字の方が気になる", yes: { seimei: 3 } },
      { text: "強い既視感(デジャブ)を、ただの偶然だと片付けられない方だ", yes: { zenze: 3 } },
      { text: "誰かに改名や芸名を勧めるとしたら、運気が変わると本気で思っている", yes: { seimei: 2, zenze: 1 } },
      { text: "相談相手には、答えより「次にやることリスト」を渡したくなる", yes: { consultant: 3 } },
      { text: "行ったことのない場所なのに、妙に懐かしいと感じたことがある", yes: { zenze: 2 } },
      { text: "数字やグラフより、文章や言葉の方に説得力を感じる", yes: { seimei: 2, consultant: 1 } },
      { text: "自分の中に、今の自分とは違う「もう一人の記憶」があるような感覚がある", yes: { zenze: 3 } },
      { text: "会議やミーティングでは、結論を最初に言ってほしいタイプだ", yes: { consultant: 2 } },
      { text: "生まれ変わるなら、人間より別の何かになってみたいと思うことがある", yes: { zenze: 2 } },
      { text: "目標達成のためなら、感情より計画を優先する方だ", yes: { consultant: 3 } },
      { text: "もし苗字が変わるとしたら、名前の画数を一度は調べると思う", yes: { seimei: 2 } },
      { text: "記憶を一つだけ消せるとしたら、消さない方を選ぶと思う", yes: { zenze: 1, seimei: 1 } },
      { text: "誰も見ていない鏡の中の自分は、今の自分と少し違う気がする", yes: { zenze: 2 } },
      { text: "人を動かすのは「言葉の響き」だと思う", yes: { seimei: 2 }, no: { consultant: 2 } },
    ],
  },
  C: {
    types: ["tarot", "rune", "yume", "pendulum"],
    questions: [
      { text: "絵や写真を見ると、そこに写っていないはずの「続きの物語」を想像してしまう", yes: { tarot: 2 }, no: { pendulum: 2 } },
      { text: "一つの記号やマークを見ただけで、パッと答えが浮かぶことがある", yes: { rune: 3 } },
      { text: "朝起きた直後、覚えている夢の意味を無意識に考えてしまう", yes: { yume: 4 } },
      { text: "何かに迷ったとき、手に持った物が自然と動く感覚を信じたくなる", yes: { pendulum: 4 } },
      { text: "占いの結果は、1枚のカードよりストーリー仕立ての方が納得できる", yes: { tarot: 2 }, no: { rune: 2 } },
      { text: "シンプルな一文字・一記号の方が、長い説明より真実を突いていると思う", yes: { rune: 2, pendulum: 1 } },
      { text: "昨夜見た夢を、朝のうちにメモしたくなることがある", yes: { yume: 3 } },
      { text: "「はい/いいえ」で聞かれたら、体が先に傾く感覚がある方だと思う", yes: { pendulum: 3 } },
      { text: "絵札のようなビジュアルに、つい自分の物語を重ねてしまう", yes: { tarot: 2 }, no: { yume: 1 } },
      { text: "石や木片に刻まれた古い記号に、理由もなく惹かれることがある", yes: { rune: 3 } },
      { text: "同じ夢を何度も見ると、それは何かのサインだと思ってしまう", yes: { yume: 3 } },
      { text: "道具(振り子やカードなど)が自分の意思と関係なく動くのを見てみたい", yes: { pendulum: 2, rune: 1 } },
      { text: "物語の「結末」より「伏線」を考えている時間の方が好きだ", yes: { tarot: 2 }, no: { rune: 1 } },
      { text: "答えの出し方は「一枚引く」より「意味を組み合わせる」方が好きだ", yes: { tarot: 2 }, no: { rune: 2 } },
      { text: "記憶を一つだけ消せるとしたら、消さない方を選ぶと思う", yes: { yume: 2 } },
      { text: "静寂しかない世界と雑音しかない世界、選べるなら静寂を選ぶ", yes: { pendulum: 1, yume: 1 } },
      { text: "誰も見ていない鏡の中の自分は、今の自分と少し違う気がする", yes: { tarot: 2 }, no: { pendulum: 1 } },
      { text: "答えを求めるとき、「物語」で受け取りたい", yes: { tarot: 2, yume: 1 }, no: { pendulum: 2, rune: 1 } },
    ],
  },
  D: {
    types: ["kansou", "psychic", "healer", "channel"],
    questions: [
      { text: "電車で向かいに座った人の手や表情を、つい観察してしまう", yes: { kansou: 3 } },
      { text: "会う前から、その人の雰囲気を何となく感じ取れることがある", yes: { psychic: 3 } },
      { text: "誰かの悩みを聞くと、解決策より先に「大変だったね」と言いたくなる", yes: { healer: 3 } },
      { text: "誰かの言葉を伝えているとき、それが自分の考えなのか分からなくなる瞬間がある", yes: { channel: 3 } },
      { text: "初対面の人の靴や持ち物から、性格を勝手に想像してしまう", yes: { kansou: 3 } },
      { text: "理由が説明できないのに、ある人や場所を「苦手」と感じることがある", yes: { psychic: 2, channel: 1 } },
      { text: "友人が落ち込んでいたら、アドバイスよりそばにいることを選ぶ", yes: { healer: 3 } },
      { text: "一人で静かにしていると、誰かに話しかけられているような感覚になることがある", yes: { channel: 3 } },
      { text: "手のひらのしわや指の形が、その人らしさを物語っている気がする", yes: { kansou: 3 } },
      { text: "部屋に入った瞬間、そこで何かあったと空気で分かることがある", yes: { psychic: 2 } },
      { text: "同じ話を聞いても、内容より相手の疲れ具合の方が気になる", yes: { healer: 3 } },
      { text: "眠りに落ちる直前、知らない声や言葉が浮かんでくることがある", yes: { channel: 2 } },
      { text: "顔立ちや姿勢を見ただけで、その人の調子の良し悪しが分かる方だ", yes: { kansou: 2 } },
      { text: "宇宙人に出会ったら、質問するより先に握手を求めると思う", yes: { psychic: 2, channel: 1 } },
      { text: "生まれ変わるなら、人間より別の何かになってみたいと思うことがある", yes: { channel: 2, psychic: 1 } },
      { text: "誰かの相談に乗るときは、答えを出さずに終わっても満足できる", yes: { healer: 2 } },
      { text: "誰も見ていない鏡の中の自分は、今の自分と少し違う気がする", yes: { psychic: 1, channel: 1 } },
      { text: "人を助けるとき、「気づいてあげる」方が「そばにいてあげる」より自分に向いている", yes: { kansou: 1, psychic: 2 }, no: { healer: 2, channel: 1 } },
    ],
  },
};

/* ============================================================
   進行ロジック
   ============================================================ */
const TOTAL_Q = 20;

let state = {
  step: 0,          // 0-indexed, 0..19
  group: null,      // 'A' | 'B' | 'C' | 'D'
  score: {},
  queue: [],         // 解決済みの質問オブジェクト列(表示用)
};

const el = {
  progressWrap: document.getElementById("progressWrap"),
  progressFill: document.getElementById("progressFill"),
  progressLabel: document.getElementById("progressLabel"),
  panelStart: document.getElementById("panel-start"),
  panelQuestion: document.getElementById("panel-question"),
  panelResult: document.getElementById("panel-result"),
  qText: document.getElementById("qText"),
  yesBtn: document.getElementById("yesBtn"),
  noBtn: document.getElementById("noBtn"),
  startBtn: document.getElementById("startBtn"),
  backBtn: document.getElementById("backBtn"),
  resIcon: document.getElementById("resIcon"),
  resAlias: document.getElementById("resAlias"),
  resName: document.getElementById("resName"),
  resCatch: document.getElementById("resCatch"),
  resDesc: document.getElementById("resDesc"),
  resHistory: document.getElementById("resHistory"),
  resPeople: document.getElementById("resPeople"),
  resScores: document.getElementById("resScores"),
  resScoresWrap: document.getElementById("resScoresWrap"),
  analysisCard: document.getElementById("analysisCard"),
  resAnalysis: document.getElementById("resAnalysis"),
  sharedBadge: document.getElementById("sharedBadge"),
  shareSns: document.getElementById("shareSns"),
  shareLine: document.getElementById("shareLine"),
  shareCopy: document.getElementById("shareCopy"),
  shareToast: document.getElementById("shareToast"),
};

function resetState() {
  state = { step: 0, group: null, score: {}, history: [], answerLog: [] };
}

function showPanel(name) {
  [el.panelStart, el.panelQuestion, el.panelResult].forEach(p => p.classList.remove("active"));
  if (name === "start") el.panelStart.classList.add("active");
  if (name === "question") el.panelQuestion.classList.add("active");
  if (name === "result") el.panelResult.classList.add("active");
  el.backBtn.classList.toggle("show", name !== "start");
}

function updateProgress() {
  const n = Math.min(state.step, TOTAL_Q);
  el.progressFill.style.width = (n / TOTAL_Q * 100) + "%";
  el.progressLabel.textContent = n + " / " + TOTAL_Q;
}

function currentQuestion() {
  const s = state.step;
  if (s === 0) return { text: ENTRY_Q1.text, kind: "entry1" };
  if (s === 1) {
    return state._path === "logic"
      ? { text: ENTRY_Q2_LOGIC.text, kind: "entry2" }
      : { text: ENTRY_Q2_INTUITION.text, kind: "entry2" };
  }
  const groupQIndex = s - 2;
  const g = GROUPS[state.group];
  return { text: g.questions[groupQIndex].text, kind: "group", data: g.questions[groupQIndex] };
}

function renderQuestion() {
  showPanel("question");
  el.progressWrap.classList.add("show");
  updateProgress();
  const q = currentQuestion();
  el.qText.textContent = q.text;
}

function snapshotState() {
  return {
    step: state.step,
    group: state.group,
    score: JSON.parse(JSON.stringify(state.score)),
    _path: state._path,
    answerLog: state.answerLog.slice(),
  };
}

function answer(yes) {
  state.history.push(snapshotState());
  const s = state.step;

  if (s === 0) {
    state._path = ENTRY_Q1.branch(yes);
  } else if (s === 1) {
    const branchFn = state._path === "logic" ? ENTRY_Q2_LOGIC.branch : ENTRY_Q2_INTUITION.branch;
    state.group = branchFn(yes);
    GROUPS[state.group].types.forEach(t => (state.score[t] = 0));
  } else {
    const q = currentQuestion();
    const deltas = yes ? q.data.yes : q.data.no;
    if (deltas) {
      Object.keys(deltas).forEach(t => {
        state.score[t] = (state.score[t] || 0) + deltas[t];
      });
      state.answerLog.push({ text: q.text, deltas });
    }
  }

  state.step++;
  if (state.step >= TOTAL_Q) {
    showResult();
  } else {
    renderQuestion();
  }
}

function goBack() {
  if (!state.history || state.history.length === 0) {
    resetState();
    history.replaceState(null, "", location.pathname + location.search);
    el.progressWrap.classList.remove("show");
    showPanel("start");
    return;
  }
  const prev = state.history.pop();
  state.step = prev.step;
  state.group = prev.group;
  state.score = prev.score;
  state._path = prev._path;
  state.answerLog = prev.answerLog;
  history.replaceState(null, "", location.pathname + location.search);
  renderQuestion();
}

const AXIS_DESC = {
  A: "回答の傾向として「論理」×「情報・データ」を重視する選択が多く見られました。感覚よりも根拠やパターンを大切にするタイプです。",
  B: "回答の傾向として「論理」×「人との対話」を重視する選択が多く見られました。データよりも、相手と向き合いながら考えるタイプです。",
  C: "回答の傾向として「直感」×「道具・象徴」を重視する選択が多く見られました。言葉より先に、シンボルや感覚を信じるタイプです。",
  D: "回答の傾向として「直感」×「人の気配」を重視する選択が多く見られました。理屈より先に、場の空気や相手の様子を感じ取るタイプです。",
};

function buildAnalysis(best) {
  const types = GROUPS[state.group].types;
  const sorted = types.slice().sort((a, b) => (state.score[b] || 0) - (state.score[a] || 0));
  const topScore = state.score[best] || 0;
  const secondScore = sorted.length > 1 ? (state.score[sorted[1]] || 0) : 0;
  const diff = topScore - secondScore;

  let marginText;
  if (diff >= 8) {
    marginText = "他の候補とは一線を画す、はっきりとした結果です(2位との差" + diff + "ポイント)。";
  } else if (diff >= 4) {
    marginText = "一定の差がつき、納得感のある結果です(2位との差" + diff + "ポイント)。";
  } else {
    marginText = "僅差での結果でした(2位との差" + diff + "ポイント)。すぐ隣には別のタイプの可能性もありました。";
  }

  const contributors = (state.answerLog || [])
    .filter(a => (a.deltas[best] || 0) > 0)
    .sort((a, b) => (b.deltas[best] || 0) - (a.deltas[best] || 0))
    .slice(0, 2)
    .map(a => a.text);

  let contributorsText = "";
  if (contributors.length > 0) {
    contributorsText = "\n\n特に次の回答が、この結果を後押ししました。\n・" + contributors.join("\n・");
  }

  return AXIS_DESC[state.group] + " " + marginText + contributorsText;
}

function renderResultInfo(best) {
  const info = TYPES[best];
  el.resIcon.innerHTML = ICONS[best];
  el.resAlias.textContent = "通称・" + info.title;
  el.resName.textContent = info.name;
  el.resCatch.textContent = "「" + info.catch + "」";
  el.resDesc.textContent = info.desc;
  el.resHistory.textContent = info.history;
  el.resPeople.textContent = info.people;
}

function showResult() {
  const types = GROUPS[state.group].types;
  let best = types[0];
  types.forEach(t => { if ((state.score[t] || 0) > (state.score[best] || 0)) best = t; });

  el.sharedBadge.style.display = "none";
  el.resScoresWrap.style.display = "block";
  el.analysisCard.style.display = "block";
  renderResultInfo(best);

  const maxScore = Math.max(1, ...types.map(t => state.score[t] || 0));
  el.resScores.innerHTML = "";
  types
    .slice()
    .sort((a, b) => (state.score[b] || 0) - (state.score[a] || 0))
    .forEach(t => {
      const isTop = t === best;
      const val = state.score[t] || 0;
      const pct = Math.max(4, (val / maxScore) * 100);
      const row = document.createElement("div");
      row.className = "score-row";
      row.innerHTML =
        '<div class="score-name' + (isTop ? " top" : "") + '">' + TYPES[t].name.replace("タイプ", "") + '</div>' +
        '<div class="score-bar-track"><div class="score-bar-fill' + (isTop ? " top" : "") + '" style="width:' + pct + '%"></div></div>';
      el.resScores.appendChild(row);
    });
  el.resAnalysis.textContent = buildAnalysis(best);

  el.progressFill.style.width = "100%";
  el.progressLabel.textContent = TOTAL_Q + " / " + TOTAL_Q;
  showPanel("result");

  history.replaceState(null, "", "#result=" + best);
  setupShare(best);
}

function showSharedResult(key) {
  el.sharedBadge.style.display = "block";
  el.resScoresWrap.style.display = "none";
  el.analysisCard.style.display = "none";
  el.progressWrap.classList.remove("show");
  renderResultInfo(key);
  showPanel("result");
  setupShare(key);
}

function setupShare(key) {
  const info = TYPES[key];
  const shareUrl = location.href;
  const shareText = "私の占い師タイプは「" + info.title + "(" + info.name + ")」でした。 #占い師タイプ診断";

  el.shareSns.onclick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "占い師タイプ診断", text: shareText, url: shareUrl });
      } catch (e) {
        // ユーザーがキャンセルした場合など。何もしない。
      }
    } else {
      window.open(
        "https://twitter.com/intent/tweet?text=" + encodeURIComponent(shareText) + "&url=" + encodeURIComponent(shareUrl),
        "_blank",
        "noopener"
      );
    }
  };
  el.shareLine.onclick = () => {
    window.open(
      "https://social-plugins.line.me/lineit/share?url=" + encodeURIComponent(shareUrl) + "&text=" + encodeURIComponent(shareText),
      "_blank",
      "noopener"
    );
  };
  el.shareCopy.onclick = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch (e) {
      const ta = document.createElement("textarea");
      ta.value = shareUrl;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    el.shareToast.classList.add("show");
    setTimeout(() => el.shareToast.classList.remove("show"), 1800);
  };
}

el.startBtn.addEventListener("click", () => {
  resetState();
  renderQuestion();
});
el.yesBtn.addEventListener("click", () => answer(true));
el.noBtn.addEventListener("click", () => answer(false));
el.backBtn.addEventListener("click", goBack);

(function init() {
  const m = location.hash.match(/result=([a-zA-Z]+)/);
  if (m && TYPES[m[1]]) {
    showSharedResult(m[1]);
  }
})();

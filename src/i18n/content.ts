import { YORUSHIKA } from './yorushika';

// These passages adapt the owner's supplied words, not an official lyric translation.
export const content = {
  zh: {
    lang: 'zh-CN', artist: YORUSHIKA.name.zh,
    description: 'DoubleTree 的个人世界。ヨルシカ「だから僕は音楽を辞めた」主题。',
    skip: '跳转到正文', language: '选择语言', theme: '当前主题', about: '关于我',
    monologueFirst: '如果人生会在22岁死去', monologueBefore: '那么是', monologueBand: YORUSHIKA.personalMonologueName.zh, monologueAfter: '拯救了我',
    hateFirst: '我憎恨那些', hateSecond: '满脸幸福的人。',
    selfFirst: '满脑子充斥着，', selfSecond: '这怪物般的劣等感。',
    words: ['爱', '救赎', '温暖'], reason: '这些毫无缘由的东西，', disgust: '全都令我反胃。',
    questionFirst: '凭什么我的人生', questionSecond: '只有失败和痛苦。',
    indifferent: ['真相', '爱', '世界', '痛苦', '人生'], ending: '全都无所谓了。',
    personal: '一个人的世界', intro: '写代码，听音乐。这里放着我所热爱的，和我还说不清的。',
    interests: '音乐 / Cosplay / 计算机科学', back: '回到开场', source: '这首歌',
    note: '文字据个人表达整理 · 影像来自 live 截图',
    imageStage: '蓝色灯光下的舞台与街景投影', imageVocal: '暖色舞台灯光中的演唱近景', imageWriting: '黑色画面中央的手写字：劣等感', imageWindow: '窗前坐在书桌旁的人物背影',
  },
  en: {
    lang: 'en', artist: YORUSHIKA.name.en,
    description: 'DoubleTree’s personal world. A theme for yorushika’s「だから僕は音楽を辞めた」.',
    skip: 'Skip to content', language: 'Choose language', theme: 'Current theme', about: 'About',
    monologueFirst: 'If life were to end at 22,', monologueBefore: 'then ', monologueBand: YORUSHIKA.personalMonologueName.en, monologueAfter: ' saved me.',
    hateFirst: 'I hate those', hateSecond: 'happy faces.', selfFirst: 'My head is filled with', selfSecond: 'this monstrous inferiority.',
    words: ['Love', 'Salvation', 'Warmth'], reason: 'All these things without a reason.', disgust: 'They make me sick.',
    questionFirst: 'Why does my life get', questionSecond: 'only failure and pain?',
    indifferent: ['Truth', 'Love', 'The world', 'Pain', 'Life'], ending: 'None of it matters.',
    personal: 'A world of my own', intro: 'Writing code. Listening to music. A place for what I love, and what I cannot quite put into words.',
    interests: 'Music / Cosplay / Computer science', back: 'Back to the opening', source: 'The song',
    note: 'Words adapted from personal reflections · Live performance stills',
    imageStage: 'A blue-lit stage beneath a street-scene projection', imageVocal: 'A vocalist in warm stage light', imageWriting: 'Handwritten 劣等感 against black', imageWindow: 'A figure at a desk, facing a window',
  },
} as const;

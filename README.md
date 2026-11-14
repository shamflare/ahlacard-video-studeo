# AhlaCard Video Studio — إعلان أهلا كارد

إعلان عمودي 1080×1920، مدته 30 ثانية بمعدل 30 إطارًا في الثانية، منتج بالكامل بأدوات مجانية:
**Remotion** لبناء المشاهد، و**FFmpeg** للترميز ومعالجة الصوت، وخط **Cairo** بترخيص SIL OFL،
وموسيقى أصلية مولّدة برمجيًا فلا توجد عليها حقوق لطرف آخر.

## التعليق الصوتي العربي (v2 + VO)
- `out/ahlacard-ad-v2-voiceover.mp4`: النسخة الثانية مع تعليق صوتي عربي.
- الصوت المستخدم هو **Piper ar_JO-kareem (medium)**، وهو مجاني ويعمل دون إنترنت بعد تنزيله.
  نُزّل من إصدارات GitHub لمشروع k2-fsa/sherpa-onnx (`tts-models`) دون أي تعديل على شبكة البيئة.
- النص مع التشكيل في `voiceover/script-v2.json`. حقل `tts` يحتوي التشكيل، ويُستخدم السكون في مواضع الوقف حتى لا تُنطق حركات الإعراب في نهايات الجمل.
- خطوات الإنتاج:
  `python make_voice.py <voice_dir> voiceover/script-v2.json voiceover/v2`
  ثم `scripts/mix_vo.sh voiceover/v2/voice.wav public/audio/music-v2.wav public/audio/mix-v2-vo.wav`.
  ينخفض مستوى الموسيقى تلقائيًا تحت الصوت، ويكون الصوت أعلى منها بنحو 10.7 dB، ومستوى الصوت النهائي −14 LUFS.
- ⚠️ ترخيص بيانات تدريب هذا الصوت غير مذكور بوضوح في بطاقة النموذج ("See URL"). يُنصح بالتحقق منه قبل الاستخدام التجاري، أو استبداله بتسجيل بصوت بشري.

### تسجيل خارجي (ElevenLabs، صوت Mona السعودي)
- `out/ahlacard-ad-v2-mona.mp4`: تسجيل واحد من ElevenLabs قُطّع إلى 7 جمل عند الوقفات، ووُضعت كل جملة على مشهدها.
- التسجيل الأصلي في `voiceover/eleven/mona-raw.mp3`، ونقاط القطع في `voiceover/eleven/cuts.json`.
- الأمر: `python3 scripts/place_voice.py <rec.wav> <cuts.json> <out>`، ثم `scripts/mix_vo.sh`.
- يمكن استخدام الطريقة نفسها مع أي تسجيل بشري.

### صوت سوري احترافي (Azure Neural TTS، الخطة المجانية F0)
| الملف | الصوت |
|---|---|
| `out/ahlacard-ad-v2-syrian-Laith.mp4` | ليث (ar-SY-LaithNeural)، صوت رجل سوري |
| `out/ahlacard-ad-v2-syrian-Amany.mp4` | أماني (ar-SY-AmanyNeural)، صوت امرأة سورية |

- يُولَّد الصوت بالأمر `python3 scripts/make_voice_azure.py ar-SY-LaithNeural voiceover/script-v2-azure.json <out> northeurope`، ثم يُمزج بـ `scripts/mix_vo.sh`.
- النص بصيغة SSML في `voiceover/script-v2-azure.json`، وفيه السرعة والنبرة والوقفات لكل جملة.
- لا يُحفظ مفتاح Azure في المستودع. في بيئة Claude السحابية يحقنه وكيل الشبكة تلقائيًا، وعلى جهاز آخر اضبط متغير البيئة `AZURE_SPEECH_KEY`.

### نسختا إلقاء محسّن بصوت Piper (المونتاج نفسه دون تغيير)
| الملف | الإلقاء |
|---|---|
| `out/ahlacard-ad-v2-vo-deep.mp4` | صوت أعمق بدرجتين نغميتين مع الحفاظ على طابع الصوت، وإيقاع أهدأ، وتنغيم أكثر حيوية |
| `out/ahlacard-ad-v2-vo-energetic.mp4` | أعمق بدرجة واحدة، وأسرع وأكثر حماسًا |

في النسختين: سرعة خاصة لكل جملة (الافتتاحية أسرع، و«أسعار منافسة» و«ابدأ الآن» أبطأ للتأكيد)،
وسلسلة معالجة إذاعية في `scripts/voice_fx.sh` (دفء ووضوح وتوافقيات وضغط).
الأمر: `make_voice.py <voice> script.json <out> <speed> <noise> <noise_w>`، ثم `voice_fx.sh <in> <out> <pitch>`، ثم `mix_vo.sh`.

## الإصدار الثاني (v2): إعلان بلقطات حقيقية من الموقع
- `out/ahlacard-ad-v2.mp4`: موجّه للوكلاء، ويستخدم لقطات شاشة حقيقية من ahlacard.com.
- المعاينات في `previews/v2/`، والكود في `src/v2/`، واللقطات في `public/screens/` وتجهّزها `scripts/make_screens.py`.
- عند تجهيز اللقطات يُحذف شريط المتصفح، وبانر Vodafone، وتنبيه «قسم الفواتير غير مفعّل».

| الوقت | المشهد |
|---|---|
| 0–3.5 ث | زبونك يطلب شحن؟ / خلّيها على أهلا كارد (ثلاثة جوالات بلقطات حقيقية) |
| 3.5–9 ث | شحن الألعاب والتطبيقات: أكثر من 80 قسمًا |
| 9–14 ث | شحن الخطوط التركية مع لمسة على زر «كشف» |
| 14–19 ث | ادفع الفواتير: كهرباء، ماء، غاز، إنترنت |
| 19–24 ث | تابع طلباتك وأرباحك: إبراز «ربح» وتصدير Excel والتقارير |
| 24–27 ث | أسعار منافسة / تنفيذ سريع / كل خدماتك في مكان واحد |
| 27–30 ث | الشعار، ثم «ابدأ الآن»، ثم ahlacard.com |

لتوليد الموسيقى: `python3 scripts/make_music.py <out.wav> v2`.
للتصيير: `npx remotion render AhlaCardAdV2 out/ahlacard-ad-v2.mp4`.

## المخرجات (v1)
- `out/ahlacard-ad-draft.mp4`: النسخة التجريبية الأولى، بموسيقى ودون تعليق صوتي.
- `previews/scene-1..6.jpg` و`previews/contact-sheet.jpg`: صور معاينة للمشاهد.

## المشاهد
| الوقت | المشهد | النص |
|---|---|---|
| 0–4 ث | افتتاحية بتأثير Glitch | جاهز للعب؟ / لا تدع الرصيد يوقفك |
| 4–9 ث | شحن رصيد الهاتف | اشحن رصيد هاتفك / بكل سهولة |
| 9–15 ث | بطاقات الألعاب | وبطاقات الألعاب / لمتعة لا تتوقف |
| 15–21 ث | الخطوات | بخطوات بسيطة: اختر ما تحتاجه، أكمل طلبك، واستمتع باللعب |
| 21–26 ث | كشف الشعار | أهلا كارد / رصيدك وألعابك في مكان واحد |
| 26–30 ث | دعوة لاتخاذ إجراء | لا تنتظر / اشحن الآن / ahlacard.com |

لا يتضمن الإعلان أي أسعار أو عروض أو أسماء ألعاب تجارية أو ادعاءات بسرعة التسليم.

## الأوامر
```bash
npm install
python3 scripts/make_logo.py        # شعار بخلفية شفافة من logo-original.jpg
python3 scripts/make_music.py public/audio/music_raw.wav \
  && ffmpeg -y -i public/audio/music_raw.wav -af loudnorm=I=-14:TP=-1.5:LRA=11 public/audio/music.wav \
  && rm public/audio/music_raw.wav
npm run stills                      # صور المعاينة
npm run render                      # out/ahlacard-ad-draft.mp4
npm run studio                      # معاينة تفاعلية
```
مسار المتصفح في `remotion.config.ts` خاص ببيئة Claude Code السحابية. احذفه عند التشغيل على جهاز آخر.

## التراخيص
- **Remotion**: مجاني للأفراد وللشركات التي لا يزيد عدد موظفيها على 3. الشركات الأكبر تحتاج ترخيصًا تجاريًا.
- **Cairo**: SIL Open Font License، والنص الكامل في `public/fonts/OFL.txt`.
- **الموسيقى**: مولّدة من الصفر عبر `scripts/make_music.py`.

## التعليق الصوتي (لاحقًا)
محرك Piper يعمل في البيئة، لكن نماذج الصوت العربي مستضافة على `huggingface.co`، وهذا النطاق محجوب في شبكة البيئة الحالية.
لإضافة التعليق: إما السماح بهذا النطاق، أو رفع تسجيل صوتي، ثم إضافته في `src/AhlaCardAd.tsx`
مع خفض مستوى الموسيقى تحته.

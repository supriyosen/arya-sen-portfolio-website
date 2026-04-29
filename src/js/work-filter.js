// ─── Work Section: Category Filtering & Card Generation ───

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


// CDN base for Behance
const B = 'https://mir-s3-cdn-cf.behance.net/project_modules/';

const PROJECTS = {
    retouching: [
        {
            title: 'Ambani Wedding — Isha Ambani',
            tag: 'Celebrity Retouching',
            desc: 'High-end beauty and fashion retouching for the Ambani Wedding series, featuring Isha Ambani. Precision skin work, color grading, and compositional refinements for editorial publication.',
            thumbFocus: 'center 18%',
            cover: B + 'max_1200/1f6e56204393641.66a86a2de1914.jpg',
            images: [
                B + 'max_1200/1f6e56204393641.66a86a2de1914.jpg',
                B + 'max_1200/5db81d204393641.66a86a2de26ef.jpg',
                B + 'max_1200/eda659204393641.66a86a2de2180.jpg',
                B + 'max_1200/a26e92204393641.66a86a2de1078.jpg',
            ]
        },
        {
            title: 'Ambani Wedding — Radhika & Anant',
            tag: 'Celebrity Retouching',
            desc: 'Luxury wedding editorial retouching for Radhika and Anant Ambani. Cinematic color science, flawless skin retouching, and atmosphere enhancement across a multi-image series.',
            thumbFocus: 'center 20%',
            thumbScale: 1.7,
            thumbOrigin: '14% 66%',
            cover: B + 'max_1200/6ec7b0204392389.66a860e86ff56.jpg',
            images: [
                B + 'max_1200/6ec7b0204392389.66a860e86ff56.jpg',
                B + 'max_1200/d49b8d204392389.66a860e86f7be.jpg',
                B + 'max_1200/bb70e3204392389.66a860e86f03d.jpg',
                B + 'max_1200/467c7b204392389.66a860e86e881.jpg',
            ]
        },
        {
            title: 'Janhvi Kapoor — Homebound, TIFF Premiere',
            tag: 'Celebrity & Editorial',
            desc: 'Premium editorial retouching for Janhvi Kapoor\'s TIFF premiere feature. Clean, high-fashion skin work with cinematic toning crafted for international press publication.',
            thumbFocus: 'center 12%',
            cover: B + 'max_1200/0830dc241643445.695cf49a6fea7.jpg',
            images: [
                B + 'max_1200/0830dc241643445.695cf49a6fea7.jpg',
                B + 'max_1200/94e016241643445.695cf49a74674.jpg',
            ]
        },
        {
            title: 'Vivo X80 — Campaign Retouch & Compositing',
            tag: 'Brand Compositing',
            desc: 'Product retouching and digital compositing for the Vivo X80 commercial campaign. Device skin blending, environmental compositing, and product heroism lighting.',
            thumbFocus: '50% 25%',
            thumbScale: 1.25,
            thumbOrigin: '65% 75%',
            cover: B + 'max_1200/7215ac196602703.662264b5246f6.jpg',
            images: [
                B + 'max_1200/7215ac196602703.662264b5246f6.jpg',
                B + 'max_1200/3c978a196602703.662264b524c06.jpeg',
                B + 'max_1200/fadd2c196602703.662264b525c67.jpg',
                B + 'max_1200/c55f92196602703.662264b5264c2.jpg',
            ]
        },
        {
            title: 'AJIO — Commercial Campaign Retouch',
            tag: 'Fashion Commercial',
            desc: 'Multi-look commercial retouching for AJIO\'s fashion campaign. High-end skin, hair, and garment retouching with consistent, punchy color grades across the full series.',
            thumbFocus: 'center 22%',
            cover: B + 'max_1200/593600230573091.6879090c60866.jpeg',
            images: [
                B + 'max_1200/593600230573091.6879090c60866.jpeg',
                B + 'max_1200/f177fb230573091.6879090c6011a.jpeg',
                B + 'max_1200/debd18230573091.6879090c5ed2f.jpeg',
            ]
        },
        {
            title: 'AZORTE × Reliance — Campaign Retouch',
            tag: 'Fashion & Lifestyle',
            desc: 'Extensive retouching for the AZORTE Reliance multi-model fashion campaign. Cohesive look-matching, skin perfection, and vibrant fashion color treatment across 11 images.',
            thumbFocus: '65% 50%',
            cover: B + '2800_webp/ba9a22231664213.688d0adecf22a.jpg',
            images: [
                B + '2800_webp/ba9a22231664213.688d0adecf22a.jpg',
                B + 'max_3840_webp/417ddc231664213.688d0ada6f4ec.jpg',
                B + 'max_3840_webp/2ede97231664213.688d0ada6fd5a.jpg',
                B + 'max_3840_webp/3c2548231664213.688d0adbcf8e1.jpg',
                B + '2800_webp/9c6ede231664213.688d0aded14f2.jpg',
                B + '2800_webp/7614ea231664213.688d0aded6f0f.jpg',
                B + '2800_webp/9819e5231664213.688d0aded1c96.jpg',
            ]
        },
        {
            title: 'POCO — Retouch & CGI Render Compositing',
            tag: 'Product CGI',
            desc: 'CGI rendering integrated with live photography for the POCO smartphone campaign. Seamless blending of rendered assets with retouched talent, environmental lighting matched throughout.',
            thumbFocus: '25% 50%',
            cover: B + '2800_webp/0f56a6176339499.64c2ce76ae1e2.png',
            images: [
                B + '2800_webp/0f56a6176339499.64c2ce76ae1e2.png',
                B + '2800_webp/21b80d176339499.64c2ce76b06e8.png',
                B + '2800_webp/50b1ee176339499.64c2ce76b3809.png',
                B + '2800_webp/8a99b5176339499.64c2ce76b1809.png',
            ]
        },
        {
            title: 'Reebok — Campaign Retouch',
            tag: 'Sports & Lifestyle',
            desc: 'High-energy sports campaign retouching for Reebok India. Dynamic motion correction, seamless background compositing, and bold contrast grading for maximum visual impact.',
            thumbFocus: '80% 0%',
            thumbScale: 1.3,
            thumbOrigin: '80% 0%',
            cover: B + 'fs_webp/01fe8d176339353.64c2cdef58a37.png',
            images: [
                B + 'max_3840_webp/558e66176339353.64c2cdef57d1d.png',
                B + 'fs_webp/f99f97176339353.64c2cdef5976b.png',
                B + 'fs_webp/01fe8d176339353.64c2cdef58a37.png',
            ]
        },
        {
            title: 'Livon — Beauty Retouching',
            tag: 'Beauty & Hair',
            desc: 'Detailed beauty retouching for the Livon hair care campaign. Strand-by-strand hair enhancement, gloss, and texture work paired with soft, luminous skin treatment.',
            thumbFocus: '40% 50%',
            cover: B + 'max_1200/da8b7f196359713.661ea8df243f0.jpg',
            images: [
                B + 'max_1200/da8b7f196359713.661ea8df243f0.jpg',
                B + 'max_1200/d68d19196359713.661ea8df23e32.jpg',
                B + 'max_1200/be2a58196359713.661ea8df2383e.jpg',
                B + 'max_1200/b8cd60196359713.6621fbe9d9745.jpeg',
            ]
        },
        {
            title: 'Money Heist — Netflix Key Art Vol. I',
            tag: 'Entertainment & OTT',
            desc: 'Cinematic composite and retouching for Netflix India\'s Money Heist campaign. Dark, moody color science, hero lighting reconstruction, and seamless multi-element compositing.',
            thumbFocus: 'center 15%',
            cover: B + 'max_1200/9d5929137429993.620b5ff791cfa.jpg',
            images: [
                B + 'max_1200/ee92e2137429993.620b5ff7912be.jpg',
                B + 'max_1200/4f4b15137429993.620b5ff793333.jpg',
                B + 'max_1200/1eeeda137429993.620b5ff79287e.jpg',
                B + 'max_1200/9d5929137429993.620b5ff791cfa.jpg',
            ]
        },
        {
            title: 'Beauty Retouch — Studio Editorial',
            tag: 'High-End Beauty',
            desc: 'Ultra high-end beauty retouching for a studio editorial series. Frequency separation skin work, dodge & burn sculpting, perfect eye enhancement, and luxury beauty color grading.',
            thumbFocus: 'center 10%',
            cover: B + 'max_1200/8b07ab236132189.68e57e1171d9b.jpg',
            images: [
                B + 'max_1200/8b07ab236132189.68e57e1171d9b.jpg',
            ]
        },
        {
            title: 'TITAN — Retouch & Compositing',
            tag: 'Luxury Brand',
            desc: 'Premium retouching and digital compositing for TITAN\'s watch campaign. Jewellery and product heroism, lifestyle integration, and a rich, warm luxury color palette.',
            thumbFocus: '50% 50%',
            cover: B + 'max_1200/56982f186664533.6579803d7acd4.jpg',
            images: [
                B + 'max_1200/56982f186664533.6579803d7acd4.jpg',
                B + 'max_1200/c6cde4186664533.6579803d7810d.jpg',
                B + 'max_1200/a10211186664533.6579803d7b90f.jpg',
                B + 'max_1200/570668186664533.6579803d79e05.jpg',
            ]
        },
        {
            title: 'Vivo X80 — Campaign Retouch Vol. II',
            tag: 'Brand Compositing',
            desc: 'Second volume of the Vivo X80 campaign series. Advanced compositing with neon environmental elements, device reflections, and cinematic skin and atmosphere work.',
            thumbFocus: '35% 50%',
            cover: B + 'max_1200/db931a196602995.662265840e510.jpg',
            images: [
                B + 'max_1200/db931a196602995.662265840e510.jpg',
                B + 'max_1200/169199196602995.662265840dddb.jpg',
                B + 'max_1200/d37f3a196602995.662265840f077.jpg',
                B + 'max_1200/cbafb3196602995.662265840e986.jpg',
            ]
        },
        {
            title: 'Money Heist — Netflix Key Art Vol. II',
            tag: 'Entertainment & OTT',
            desc: 'Continuation of the Netflix Money Heist campaign — additional character key arts with matching cinematic treatment, dramatic atmosphere, and cohesive tone across the series.',
            thumbFocus: '80% 15%',
            thumbScale: 1.2,
            thumbOrigin: '60% 45%',
            cover: B + 'max_1200/ead657137430109.620b606f9f2da.jpg',
            images: [
                B + 'max_1200/ead657137430109.620b606f9f2da.jpg',
                B + 'max_1200/640be9137430109.620b606f9fae6.jpeg',
                B + 'max_1200/29dbf7137430109.620b606fa026d.jpeg',
            ]
        },
        {
            title: 'Malavika Mohanan — Film Editorial',
            tag: 'Celebrity Editorial',
            desc: 'Elegant editorial retouching for Malavika Mohanan. Clean, skin-forward retouching with balanced natural tones, designed for premium magazine publication.',
            thumbFocus: '50% 50%',
            cover: B + 'max_1200/5c3337186663405.65797c462c95d.jpg',
            images: [
                B + 'max_1200/8ceb2c186663405.65797c4629af7.jpg',
                B + 'max_1200/5c3337186663405.65797c462c95d.jpg',
                B + 'max_1200/4ffc0a186663405.65797c462baff.jpg',
                B + 'max_1200/6469f3186663405.65797c462aac8.jpg',
            ]
        },
        {
            title: 'High-End Beauty Retouch',
            tag: 'Beauty Editorial',
            desc: 'Luxury beauty editorial retouching series. Advanced frequency separation, luminosity masking for skin, precise makeup enhancement, and rich cinematic color treatment.',
            thumbFocus: 'center 10%',
            cover: B + 'max_1200/418b13187163965.65dabf1cd6d7d.jpg',
            images: [
                B + 'max_1200/418b13187163965.65dabf1cd6d7d.jpg',
                B + 'max_1200/68a77a187163965.65dabf1cd0862.jpg',
                B + 'max_1200/abe2fa187163965.65dabf1cd3a50.jpg',
                B + 'max_1200/5cd315187163965.65dabf1ccc137.jpg',
            ]
        },
        {
            title: 'Celio — Campaign Retouch',
            tag: 'Fashion & Menswear',
            desc: 'Men\'s fashion campaign retouching for Celio India. Garment texture preservation, confident model retouching, and a crisp, commercial European aesthetic.',
            thumbFocus: '65% 50%',
            cover: B + '2800_webp/3de5c0121205149.60c0f1f134e99.jpg',
            images: [
                B + '2800_webp/3de5c0121205149.60c0f1f134e99.jpg',
                B + '2800_webp/7cccfb121205149.60c0f1f1357a1.jpg',
            ]
        },
        {
            title: 'Kiara Advani — Editorial Retouch',
            tag: 'Celebrity Editorial',
            desc: 'High-profile editorial retouching for Kiara Advani. Sophisticated, clean retouching balanced for both digital and print, with a warm, magazine-ready colour palette.',
            thumbFocus: 'center 15%',
            cover: B + '2800_webp/369b60135757497.61eda93bef49f.jpg',
            images: [
                B + '2800_webp/0b623b135757497.61eda93bee2fa.jpg',
                B + '2800_webp/369b60135757497.61eda93bef49f.jpg',
                B + '2800_webp/64cbac135757497.61eda93beeb85.jpg',
            ]
        },
        {
            title: 'Fashion Retouch — Editorial Series',
            tag: 'Fashion Retouching',
            desc: 'High-fashion editorial retouching series featuring dramatic lighting, precise garment work, and a bold, dark colour palette crafted for editorial and campaign contexts.',
            thumbFocus: 'center 18%',
            cover: B + '2800_webp/66b3c7118934653.6093113c07cc5.jpeg',
            images: [
                B + '2800_webp/66b3c7118934653.6093113c07cc5.jpeg',
                B + '2800_webp/39b607118934653.6093113c08565.jpeg',
                B + '2800_webp/7e504c118934653.6093113c07537.jpeg',
            ]
        },
        {
            title: 'Femina × Kiara Advani — Editorial',
            tag: 'Magazine Editorial',
            desc: 'Elite magazine retouching for Femina India\'s Kiara Advani feature. Radiant skin, luxury garment detail, and prestige publication colour standards throughout.',
            thumbFocus: 'center 12%',
            cover: B + '2800_webp/fa43b9113344161.60259562d6d06.jpg',
            images: [
                B + '2800_webp/fa43b9113344161.60259562d6d06.jpg',
                B + '2800_webp/e7ea1b113344161.60259562d8ac1.jpg',
                B + '2800_webp/721c86113344161.60259562d7e42.jpg',
            ]
        },
        {
            title: 'Kartik Aaryan — Celebrity Portrait',
            tag: 'Celebrity Retouching',
            desc: 'Striking celebrity portrait retouching for Kartik Aaryan. Masculine, confident skin work with dramatic shadow and highlight sculpting for a powerful editorial look.',
            thumbFocus: 'center 12%',
            cover: B + 'fs_webp/3f8b71120536695.60b3dd34794cc.jpg',
            images: [
                B + 'fs_webp/3f8b71120536695.60b3dd34794cc.jpg',
                B + 'fs_webp/d93b86120536695.60b3dd3479bf6.jpg',
                B + 'max_3840_webp/b8f6aa120536695.60b3dd347a142.jpg',
            ]
        },
        {
            title: 'Redmi Watch 3 Active — Compositing',
            tag: 'Product Compositing',
            desc: 'Sleek product compositing for the Redmi Watch 3 Active launch. Device isolation, environmental integration, lifestyle hero shots, and tech-forward colour treatment.',
            thumbFocus: '55% 50%',
            cover: B + '2800_webp/a02535197441907.6630a8a1142c1.jpg',
            images: [
                B + '2800_webp/ca8ccd197441907.6630a8a11514f.jpg',
                B + '2800_webp/6a2b3d197441907.6630b07f03a1f.png',
                B + '2800_webp/a02535197441907.6630a8a1142c1.jpg',
                B + '2800_webp/170c4b197441907.6630a8a114a04.jpg',
            ]
        },
        {
            title: 'Khush Wedding — Editorial Feature',
            tag: 'Wedding Editorial',
            desc: 'Luxury wedding editorial retouching for Khush Magazine. Romantic, warm palette with immaculate bridal skin, jewellery enhancement, and couture garment perfection.',
            thumbFocus: 'center 16%',
            cover: B + '2800_webp/8756d0197633549.6633996f4a85a.jpeg',
            images: [
                B + '2800_webp/8756d0197633549.6633996f4a85a.jpeg',
                B + '2800_webp/c1af2d197633549.6633996f49f0b.jpeg',
                B + '2800_webp/5962e5197633549.6633996f475d6.jpeg',
            ]
        },
        {
            title: 'Vivo T2 — Campaign Retouch & Compositing',
            tag: 'Brand Compositing',
            desc: 'Lifestyle and product compositing for the Vivo T2 campaign. Youth-oriented energy, dynamic model retouching, and seamless device integration across multiple setups.',
            thumbFocus: '50% 50%',
            cover: B + 'max_1200/a26fd0186665535.657983aabbc6c.jpg',
            images: [
                B + 'max_1200/a26fd0186665535.657983aabbc6c.jpg',
                B + 'max_1200/a2b4ba186665535.66309fc2afba9.jpg',
                B + 'max_1200/9b57c7186665535.657983aabd600.jpg',
                B + 'max_1200/23756b186665535.657983aabed9f.jpg',
            ]
        },
        {
            title: 'The Hollywood Reporter — India Feature',
            tag: 'Press & Publication',
            desc: 'International press editorial retouching for The Hollywood Reporter India. Clean, authoritative retouching style meeting the exacting standards of global entertainment journalism.',
            thumbFocus: 'center 95%',
            cover: B + 'max_1200/19c2cc211699845.67288f601da5c.jpg',
            images: [
                B + 'max_1200/19c2cc211699845.67288f601da5c.jpg',
                B + 'max_1200/759f79211699845.67288f601c2bc.jpg',
                B + 'max_1200/257b42211699845.67288f601e7af.jpg',
                B + 'max_1200/749f51211699845.67288f601e1f5.jpg',
            ]
        },
        {
            title: 'Vogue × Mercedes-Maybach — Campaign',
            tag: 'Luxury Compositing',
            desc: 'Ultra-luxury compositing and retouching for a Vogue India x Mercedes-Maybach collaboration. Fashion-meets-automotive elegance, flawless skin, and opulent, editorial color grading.',
            thumbFocus: '8% 50%',
            cover: B + 'max_1200/81ccdb196605491.66226dcb2d2eb.jpg',
            images: [
                B + 'max_1200/81ccdb196605491.66226dcb2d2eb.jpg',
                B + 'max_1200/58e93a196605491.66226f3d1a75d.png',
                B + 'max_1200/82cb8c196605491.66226dcb2cd99.jpg',
                B + 'max_1200/02575b196605491.66226dcb2c680.jpg',
            ]
        },
        {
            title: 'Editorial Retouch — Studio Series Vol. I',
            tag: 'Fashion Editorial',
            desc: 'Fashion editorial retouching series — Vol. I. Vibrant colour, high-contrast drama, and meticulous styling preservation across a multi-look studio production.',
            thumbFocus: 'center 16%',
            cover: B + 'max_1200/7376a2120538107.60b3e44815c99.jpg',
            images: [
                B + 'max_1200/7376a2120538107.60b3e44815c99.jpg',
                B + 'max_1200/cad30e120538107.60b3e44816f9e.jpg',
                B + 'max_1200/5f7408120538107.60b3e448168cd.jpg',
                B + 'max_1200/de6e4c120538107.60b3e44817556.jpg',
            ]
        },
        {
            title: 'Editorial Retouch — Studio Series Vol. II',
            tag: 'Fashion Editorial',
            desc: 'Fashion editorial retouching series — Vol. II. A continuation with darker moodier tones, sophisticated colour language, and precision detail work across the full series.',
            thumbFocus: 'center 16%',
            cover: B + 'max_1200/9210e6113207465.60231f57c4dbe.jpg',
            images: [
                B + 'max_1200/9210e6113207465.60231f57c4dbe.jpg',
                B + 'max_1200/dd9384113207465.60231f57c40f8.jpg',
                B + 'max_1200/0f9072113207465.60231f57c39cb.jpg',
            ]
        },
        {
            title: 'Pooja Hegde — Forever New Campaign',
            tag: 'Celebrity x Brand',
            desc: 'Brand editorial retouching for Pooja Hegde\'s Forever New campaign. Soft luminous skin, fashion-forward colour grading, and consistent brand visual language throughout.',
            thumbFocus: '38% 50%',
            cover: B + 'max_1200/408482215662483.68e5679a715d6.jpg',
            images: [
                B + 'max_1200/408482215662483.68e5679a715d6.jpg',
                B + 'max_1200/85487f215662483.677119396a6da.jpg',
                B + 'max_1200/76ae1e215662483.6771193969f81.jpg',
                B + 'max_1200/36d5db215662483.677119396ae32.jpg',
            ]
        },
        {
            title: 'GIVA × Anushka Sharma — Campaign',
            tag: 'Jewellery & Luxury',
            desc: 'Jewellery campaign retouching for GIVA featuring Anushka Sharma. Precise jewellery enhancement, radiant skin, and a refined colour palette elevating the brand\'s luxury positioning.',
            thumbFocus: 'center 14%',
            thumbScale: 1.6,
            thumbOrigin: '50% 5%',
            cover: B + 'max_1200/331d46212390569.6734455067b11.jpg',
            images: [
                B + 'max_1200/331d46212390569.6734455067b11.jpg',
            ]
        },
    ],
    'ai-commercials': [
        { title: 'AI Auto Ad — Generated in 48 Hours', tag: 'AI Commercial' },
        { title: 'Dreamscape — Full AI Short Film', tag: 'AI Filmmaking' },
        { title: 'Synthwave Promo — AI x VFX', tag: 'AI + VFX' },
        { title: 'Fragrance Visual — AI Generation', tag: 'AI Product Film' },
        { title: 'Brand Manifesto — AI Narrative', tag: 'AI Storytelling' },
        { title: 'Fashion Film — AI Models', tag: 'AI Fashion' },
        { title: 'Concept Film — Dystopia', tag: 'AI Cinematic' },
        { title: 'Music Video — AI Visual Effects', tag: 'AI Music Video' },
        { title: 'Product Reveal — AI Animation', tag: 'AI Motion' },
        { title: 'Social Reel — AI Content Engine', tag: 'AI Social Media' },
    ],
    'ai-design': [
        {
            title: 'SOLVEA — AI Brand Campaign',
            tag: 'AI Brand Design',
            desc: 'A complete AI-generated brand campaign for SOLVEA, a botanical skincare brand. From product renders to lifestyle compositions — every frame generated, crafted, and art-directed end-to-end using AI.',
            horizontal: true,
            thumbFocus: 'center center',
            cover: '/images/portfolio/ai-design/solvea/01.webp',
            images: [
                '/images/portfolio/ai-design/solvea/01.webp',
                '/images/portfolio/ai-design/solvea/02.webp',
                '/images/portfolio/ai-design/solvea/03.webp',
                '/images/portfolio/ai-design/solvea/04.webp',
                '/images/portfolio/ai-design/solvea/05.webp',
                '/images/portfolio/ai-design/solvea/06.webp',
                '/images/portfolio/ai-design/solvea/07.webp',
                '/images/portfolio/ai-design/solvea/08.webp',
                '/images/portfolio/ai-design/solvea/09.webp',
                '/images/portfolio/ai-design/solvea/10.webp',
                '/images/portfolio/ai-design/solvea/11.webp',
                '/images/portfolio/ai-design/solvea/12.webp',
            ]
        },
        {
            title: 'Redmi Pad — AI Commercial',
            tag: 'AI Commercial',
            desc: 'A full AI-generated commercial campaign for the Redmi Pad — lifestyle shoots, product hero shots, and typographic key visuals, all produced using generative AI tools without a camera.',
            horizontal: true,
            thumbFocus: 'center center',
            cover: '/images/portfolio/ai-design/redmi-pad/01.webp',
            images: [
                '/images/portfolio/ai-design/redmi-pad/01.webp',
                '/images/portfolio/ai-design/redmi-pad/02.webp',
                '/images/portfolio/ai-design/redmi-pad/03.webp',
                '/images/portfolio/ai-design/redmi-pad/04.webp',
                '/images/portfolio/ai-design/redmi-pad/05.webp',
                '/images/portfolio/ai-design/redmi-pad/06.webp',
                '/images/portfolio/ai-design/redmi-pad/07.webp',
                '/images/portfolio/ai-design/redmi-pad/08.webp',
                '/images/portfolio/ai-design/redmi-pad/09.webp',
                '/images/portfolio/ai-design/redmi-pad/10.webp',
                '/images/portfolio/ai-design/redmi-pad/11.webp',
                '/images/portfolio/ai-design/redmi-pad/12.webp',
                '/images/portfolio/ai-design/redmi-pad/13.webp',
                '/images/portfolio/ai-design/redmi-pad/14.webp',
            ]
        },
    ],
    'vibe-coding': [
        { title: 'Interactive 3D Portfolio Gallery', tag: 'Web App · Three.js' },
        { title: 'Halftone Video Generator', tag: 'Creative Tool · Canvas' },
        { title: 'ASCII Art Video Converter', tag: 'Web Tool · FFmpeg' },
        { title: 'Particle System — Hand Controlled', tag: 'Interactive · ML' },
        { title: 'AI Neural Network Visualizer', tag: 'Data Viz · WebGL' },
        { title: 'Brand Website — Nova Brew', tag: 'Web Design · Scroll' },
        { title: 'Chain Reaction — Game', tag: 'Game · Electron' },
        { title: 'Client Dashboard — SaaS', tag: 'Web App · React' },
        { title: 'Portfolio CMS — Custom', tag: 'Full Stack · Node' },
        { title: 'Creative Toolkit — Desktop App', tag: 'Desktop · Electron' },
    ],
    art: [
        { title: 'Kolkata Streets — Dawn Patrol', tag: 'Street Photography' },
        { title: 'Monsoon Textures', tag: 'Street Photography' },
        { title: 'Faces of the Market', tag: 'Street Photography' },
        { title: 'Oil on Canvas — Solitude', tag: 'Oil Painting' },
        { title: 'Oil on Canvas — Urban Decay', tag: 'Oil Painting' },
        { title: 'Oil on Canvas — Portrait Study', tag: 'Oil Painting' },
        { title: 'TouchDesigner — Fluid Simulation', tag: 'Interactive Art' },
        { title: 'TouchDesigner — Audio Reactive', tag: 'Interactive Art' },
        { title: 'Light Painting — Long Exposure', tag: 'Experimental' },
        { title: 'Abstract Series — Mixed Media', tag: 'Mixed Media' },
    ],
};

// ─── CDN URL helpers ───
// Behance CDN supports multiple size tiers. Use max_1200 for thumbnails (cards)
// and keep originals for lightbox full-res.
function toThumb(url) {
    if (!url || url.startsWith('/')) return url; // local file — keep as-is
    return url
        .replace('/max_3840_webp/', '/max_1200/')
        .replace('/2800_webp/', '/max_1200/')
        .replace('/fs_webp/', '/max_1200/');
}

const COLORS = {
    retouching: ['2a1f3d', '3d2a4a', '1f2d3d', '2d3d1f', '3d1f2a', '1f3d3d', '3d3d1f', '2a3d1f', '1f2a3d', '3d2a1f'],
    'ai-commercials': ['1a2a4a', '2a3a5a', '0d1f3a', '1a3a4a', '2a1a4a', '3a2a5a', '0d2a3a', '1a4a3a', '2a4a1a', '3a1a2a'],
    'ai-design': ['3d1a2a', '4a2a3a', '3a0d1f', '4a1a3a', '3d2a1a', '5a3a2a', '3a0d2a', '3a1a4a', '4a1a2a', '2a3a1a'],
    'vibe-coding': ['0d2a1f', '1a3a2a', '0d3a1f', '1a4a2a', '0d2a3a', '1a3a4a', '0d4a2a', '1a2a4a', '0d3a3a', '1a4a3a'],
    art: ['3d2a0d', '4a3a1a', '3a2a0d', '4a3a0d', '3d3a1a', '5a4a2a', '3a3a0d', '4a2a1a', '3d1a0d', '2a3a0d'],
};

// ─── Lightbox State ───
let lightboxProject = null;
let lightboxIndex = 0;
let lightboxCategory = null;
let lightboxProjectIndex = 0;

function openLightbox(project, startIndex = 0, category = null, projectIndex = 0) {
    lightboxProject = project;
    lightboxIndex = startIndex;
    lightboxCategory = category;
    lightboxProjectIndex = projectIndex;
    const lb = document.getElementById('work-lightbox');
    if (!lb) return;
    lb.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    renderLightbox();
}

function closeLightbox() {
    const lb = document.getElementById('work-lightbox');
    if (!lb) return;
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
    lightboxProject = null;
}

function renderLightbox() {
    if (!lightboxProject) return;
    const { title, tag, desc, images } = lightboxProject;
    const imgUrl = images[lightboxIndex];
    const total = images.length;

    document.getElementById('lb-title').textContent = title;
    document.getElementById('lb-tag').textContent = tag;
    document.getElementById('lb-desc').textContent = desc || '';
    document.getElementById('lb-counter').textContent = `${lightboxIndex + 1} / ${total}`;

    const imgEl = document.getElementById('lb-main-img');
    const spinner = document.getElementById('lb-spinner');

    // Show spinner immediately; hide image until loaded
    imgEl.style.opacity = '0';
    if (spinner) spinner.style.display = 'flex';

    const newImg = new Image();
    newImg.src = imgUrl;
    newImg.onload = () => {
        imgEl.src = imgUrl;
        imgEl.style.transition = 'opacity 0.3s ease';
        imgEl.style.opacity = '1';
        if (spinner) spinner.style.display = 'none';
    };
    newImg.onerror = () => {
        if (spinner) spinner.style.display = 'none';
    };
    // Already cached — show immediately
    if (newImg.complete && newImg.naturalWidth > 0) {
        imgEl.src = imgUrl;
        imgEl.style.opacity = '1';
        if (spinner) spinner.style.display = 'none';
    }

    // Update nav buttons
    document.getElementById('lb-prev').style.opacity = total > 1 ? '1' : '0.2';
    document.getElementById('lb-next').style.opacity = total > 1 ? '1' : '0.2';

    // Thumbnails — use toThumb() for the background (small = fast)
    const strip = document.getElementById('lb-thumbs');
    strip.innerHTML = '';
    images.forEach((url, i) => {
        const t = document.createElement('button');
        t.className = 'lb-thumb' + (i === lightboxIndex ? ' active' : '');
        t.setAttribute('aria-label', `Image ${i + 1}`);
        t.style.backgroundImage = `url(${toThumb(url)})`;
        t.addEventListener('click', () => { lightboxIndex = i; renderLightbox(); });
        strip.appendChild(t);
    });

    // Next Project button
    const nextBtn = document.getElementById('lb-next-project');
    const nextTitleEl = document.getElementById('lb-next-project-title');
    if (nextBtn && lightboxCategory) {
        const categoryProjects = PROJECTS[lightboxCategory] || [];
        const nextProject = categoryProjects[lightboxProjectIndex + 1];
        if (nextProject?.images?.length > 0) {
            nextTitleEl.textContent = nextProject.title;
            nextBtn.style.display = 'flex';
            nextBtn.onclick = () => openLightbox(nextProject, 0, lightboxCategory, lightboxProjectIndex + 1);
        } else {
            nextBtn.style.display = 'none';
        }
    } else if (nextBtn) {
        nextBtn.style.display = 'none';
    }
}

function lightboxNav(dir) {
    if (!lightboxProject) return;
    const total = lightboxProject.images.length;
    lightboxIndex = (lightboxIndex + dir + total) % total;
    renderLightbox();
}

function injectLightbox() {
    if (document.getElementById('work-lightbox')) return;
    const lb = document.createElement('div');
    lb.id = 'work-lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.innerHTML = `
      <div class="lb-backdrop"></div>
      <div class="lb-panel">
        <button class="lb-close" id="lb-close" aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div class="lb-image-area">
          <button class="lb-nav lb-nav--prev" id="lb-prev" aria-label="Previous">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <polyline points="15,18 9,12 15,6"/>
            </svg>
          </button>

          <div class="lb-img-wrap">
            <div id="lb-spinner" class="lb-spinner">
              <div class="lb-spinner-ring"></div>
            </div>
            <img id="lb-main-img" src="" alt="" />
          </div>

          <button class="lb-nav lb-nav--next" id="lb-next" aria-label="Next">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <polyline points="9,18 15,12 9,6"/>
            </svg>
          </button>
        </div>

        <div class="lb-info">
          <div class="lb-info-top">
            <div>
              <div class="lb-tag" id="lb-tag"></div>
              <div class="lb-title" id="lb-title"></div>
            </div>
            <div class="lb-counter" id="lb-counter"></div>
          </div>
          <div class="lb-desc" id="lb-desc"></div>
          <div class="lb-thumbs" id="lb-thumbs"></div>
          <button class="lb-next-project" id="lb-next-project" aria-label="Next project">
            <span class="lb-next-project__label">Next Project</span>
            <span class="lb-next-project__title" id="lb-next-project-title"></span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <polyline points="9,18 15,12 9,6"/>
            </svg>
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(lb);

    // Event listeners
    document.getElementById('lb-close').addEventListener('click', closeLightbox);
    lb.querySelector('.lb-backdrop').addEventListener('click', closeLightbox);
    document.getElementById('lb-prev').addEventListener('click', () => lightboxNav(-1));
    document.getElementById('lb-next').addEventListener('click', () => lightboxNav(1));

    // Keyboard nav
    document.addEventListener('keydown', (e) => {
        if (!document.getElementById('work-lightbox').classList.contains('is-open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') lightboxNav(-1);
        if (e.key === 'ArrowRight') lightboxNav(1);
    });

    // Touch/swipe
    let touchStartX = 0;
    const imgArea = lb.querySelector('.lb-image-area');
    imgArea.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    imgArea.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 50) lightboxNav(dx < 0 ? 1 : -1);
    });
}

function createCard(project, category, index) {
    const card = document.createElement('div');
    card.className = 'work__card';

    const hasImage = project.cover && (project.cover.startsWith('/') || project.cover.startsWith('http'));
    const color = COLORS[category]?.[index % 10] || '333333';
    const thumbSrc = hasImage ? toThumb(project.cover) : null;
    const placeholderSrc = `https://placehold.co/420x525/${color}/555?text=&font=inter`;
    const position = project.thumbFocus || 'center center';

    card.innerHTML = `
    <div class="work__card-image">
      <div class="work__card-image-wrap">
        <img
          data-src="${thumbSrc || placeholderSrc}"
          alt="${project.title}"
          class="lazy-img"
          style="object-position: ${position}"
        />
      </div>
    </div>
    <div class="work__card-overlay">
      <div class="work__card-title">${project.title}</div>
      <div class="work__card-tag">${project.tag}</div>
    </div>
  `;

    if (project.horizontal) {
        card.classList.add('work__card--horizontal');
    }

    if (project.thumbScale) {
        card.style.setProperty('--thumb-scale', project.thumbScale);
        card.style.setProperty('--thumb-origin', project.thumbOrigin || 'center center');
    }

    if (project.images && project.images.length > 0) {
        card.addEventListener('click', () => openLightbox(project, 0, category, index));
    }

    return card;
}

// ─── Lusion-style scroll reveal — the spec ───
// Each card has a tiny baseline tilt (-2°…+2°) so the grid feels organically
// imperfect. On entry it eases from { y:80, opacity:0, scale:0.96, rotateZ:tilt*1.5 }
// to { y:0, opacity:1, scale:1, rotateZ:tilt }. The image inside has a
// scroll-linked yPercent parallax (-8 → 8) the whole time it's on screen.
// Hover lift is GSAP-driven too so it composes with the tilt without conflict.

// Pre-set tilts repeated through the deck — feels random, stays deterministic.
const TILTS = [-1.4, 1.2, -0.7, 1.6, -1.8, 0.9, 1.4, -1.1, -0.6, 1.8, -1.3, 0.8];

function setupCardScrollFX(card, tiltIndex) {
    if (card.dataset.fxAttached === '1') return;
    card.dataset.fxAttached = '1';

    const tilt = TILTS[tiltIndex % TILTS.length];
    const wrap = card.querySelector('.work__card-image-wrap');

    // Initial state — applied immediately so the card never flashes visible.
    gsap.set(card, {
        y: 80,
        opacity: 0,
        scale: 0.96,
        rotateZ: tilt * 1.5,
    });

    // Entry — one-time, smooth, premium ease.
    gsap.to(card, {
        y: 0,
        opacity: 1,
        scale: 1,
        rotateZ: tilt,
        duration: 1.4,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
        }
    });

    // Image parallax — yPercent -8 → 8 across the card's full transit.
    if (wrap) {
        gsap.fromTo(wrap,
            { yPercent: -4 },
            {
                yPercent: 4,
                ease: 'none',
                scrollTrigger: {
                    trigger: card,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                    invalidateOnRefresh: true,
                }
            }
        );
    }

    // Hover lift + cursor-direction 3D tilt — GSAP so it composes with rotateZ cleanly.
    const MAX_TILT = 7;
    let tiltRaf = 0;
    let txTarget = 0, tyTarget = 0, txCur = 0, tyCur = 0;

    function tickTilt() {
        txCur += (txTarget - txCur) * 0.18;
        tyCur += (tyTarget - tyCur) * 0.18;
        gsap.set(card, { rotateX: txCur, rotateY: tyCur, transformPerspective: 900 });
        if (Math.abs(txTarget - txCur) > 0.05 || Math.abs(tyTarget - tyCur) > 0.05) {
            tiltRaf = requestAnimationFrame(tickTilt);
        } else {
            tiltRaf = 0;
        }
    }

    card.addEventListener('mouseenter', () => {
        gsap.to(card, { y: -8, duration: 0.55, ease: 'power3.out', overwrite: 'auto' });
    });

    card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        txTarget =  (0.5 - (e.clientY - r.top)  / r.height) * MAX_TILT * 2;
        tyTarget = ((e.clientX - r.left) / r.width - 0.5) * MAX_TILT * 2;
        if (!tiltRaf) tiltRaf = requestAnimationFrame(tickTilt);
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, { y: 0, duration: 0.55, ease: 'power3.out', overwrite: 'auto' });
        txTarget = 0; tyTarget = 0;
        if (!tiltRaf) tiltRaf = requestAnimationFrame(tickTilt);
    });
}

// ─── Pagination ───
const PAGE_SIZE = 9;            // 3 cols × 3 rows
const PAGE_INCREMENT = 9;       // each "Show More" reveals one more page

export function initWorkFilter() {
    injectLightbox();

    const filterBtns = document.querySelectorAll('.work__filter-btn');
    const galleries = document.querySelectorAll('.work__gallery');

    // Generate cards + Show More button for each category
    Object.entries(PROJECTS).forEach(([category, projects]) => {
        const gallery = document.querySelector(`[data-gallery="${category}"]`);
        const container = gallery?.querySelector('.work__scroll-container');
        if (!container) return;

        projects.forEach((project, i) => {
            const card = createCard(project, category, i);
            if (i >= PAGE_SIZE) card.classList.add('is-hidden');
            container.appendChild(card);
        });

        // Set up scroll-driven reveal for the initial visible batch. Hidden
        // cards get their FX attached when "Show More" reveals them so
        // ScrollTrigger measures the right offsets.
        container.querySelectorAll('.work__card:not(.is-hidden)').forEach((card, i) => {
            setupCardScrollFX(card, i);
        });

        // Add "Show More" button if there are more than PAGE_SIZE
        if (projects.length > PAGE_SIZE) {
            const wrap = document.createElement('div');
            wrap.className = 'work__see-more-wrap';

            const remaining = projects.length - PAGE_SIZE;
            const btn = document.createElement('button');
            btn.className = 'work__see-more';
            btn.dataset.shown = String(PAGE_SIZE);
            btn.innerHTML = `Show More <span class="work__see-more-count">(${remaining})</span>`;

            btn.addEventListener('click', () => {
                const shown = parseInt(btn.dataset.shown, 10);
                const next = Math.min(shown + PAGE_INCREMENT, projects.length);
                const cards = container.querySelectorAll('.work__card');
                for (let i = shown; i < next; i++) {
                    cards[i].classList.remove('is-hidden');
                    const lazyImg = cards[i].querySelector('.lazy-img');
                    if (lazyImg) imgObserver.observe(lazyImg);
                }
                btn.dataset.shown = String(next);
                const left = projects.length - next;
                if (left <= 0) {
                    btn.classList.add('is-hidden');
                } else {
                    btn.querySelector('.work__see-more-count').textContent = `(${left})`;
                }

                // Now that newly-revealed cards have layout, attach FX + recompute
                // ScrollTrigger offsets so the scrubs use correct positions.
                requestAnimationFrame(() => {
                    for (let i = shown; i < next; i++) setupCardScrollFX(cards[i], i);
                    ScrollTrigger.refresh();
                });
            });

            wrap.appendChild(btn);
            gallery.appendChild(wrap);
        }
    });

    // ─── Lazy-load card images ───
    const imgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const img = entry.target;
            const src = img.dataset.src;
            if (src) {
                img.src = src;
                img.removeAttribute('data-src');
                img.classList.remove('lazy-img');
            }
            imgObserver.unobserve(img);
        });
    }, { rootMargin: '0px 0px 400px 0px', threshold: 0 });

    document.querySelectorAll('.lazy-img').forEach(img => imgObserver.observe(img));

    // ─── Filter switching ───
    // ScrollTrigger handles reveals; switching galleries just needs a refresh
    // so triggers re-measure against the newly visible cards.
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            galleries.forEach(g => g.classList.toggle('active', g.dataset.gallery === category));

            requestAnimationFrame(() => {
                const active = document.querySelector(`.work__gallery[data-gallery="${category}"]`);
                if (!active) return;
                active.querySelectorAll('.lazy-img').forEach(img => imgObserver.observe(img));
                active.querySelectorAll('.work__card:not(.is-hidden)').forEach((card, i) => {
                    setupCardScrollFX(card, i);
                });
                ScrollTrigger.refresh();
            });
        });
    });
}

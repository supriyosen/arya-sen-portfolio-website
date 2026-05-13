// ─── Featured Work Wall — Static Masonry Column Grid ───

const B = 'https://mir-s3-cdn-cf.behance.net/project_modules/';

// 27 curated images — mixed portrait retouching + landscape AI design
// Ordered so round-robin distribution gives each column a natural variety
const WALL_IMAGES = [
    { src: B + 'max_1200/1f6e56204393641.66a86a2de1914.jpg',        title: 'Ambani Wedding',            tag: 'Celebrity Retouching'    },
    { src: '/images/portfolio/ai-design/solvea/07.webp',             title: 'SOLVEA — AI Brand',         tag: 'AI Brand Design'         },
    { src: B + 'max_1200/0830dc241643445.695cf49a6fea7.jpg',         title: 'Janhvi Kapoor — TIFF',      tag: 'Celebrity & Editorial'   },
    { src: '/images/portfolio/ai-design/aeris-wearables/08.webp',    title: 'AERIS Wearables',           tag: 'AI Brand Design'         },
    { src: B + 'max_1200/9d5929137429993.620b5ff791cfa.jpg',         title: 'Money Heist — Netflix',     tag: 'Entertainment & OTT'     },
    { src: '/images/portfolio/ai-design/loewe-lego/02.webp',         title: 'LOEWE × LEGO',             tag: 'AI Brand Collab'         },
    { src: B + 'max_1200/5c3337186663405.65797c462c95d.jpg',         title: 'Malavika Mohanan',          tag: 'Celebrity Editorial'     },
    { src: '/images/portfolio/ai-design/crystal-bloom/11.webp',      title: 'Crystal Bloom',             tag: 'AI Storyboard'           },
    { src: B + 'max_1200/81ccdb196605491.66226dcb2d2eb.jpg',         title: 'Vogue × Mercedes-Maybach', tag: 'Luxury Compositing'      },
    { src: '/images/portfolio/ai-design/tresemme/08.webp',           title: 'TRESemmé Hydra Matrix',    tag: 'AI Commercial'           },
    { src: B + '2800_webp/369b60135757497.61eda93bef49f.jpg',        title: 'Kiara Advani',              tag: 'Celebrity Editorial'     },
    { src: '/images/portfolio/ai-design/renaissance-ai/10.webp',     title: 'Renaissance Reboot',        tag: 'AI Concept Art'          },
    { src: B + 'max_1200/19c2cc211699845.67288f601da5c.jpg',         title: 'Hollywood Reporter India',  tag: 'Press & Publication'     },
    { src: '/images/portfolio/ai-design/corona/01.webp',             title: 'Corona Extra',              tag: 'AI Commercial'           },
    { src: '/images/portfolio/ai-design/redmi-pad/01.webp',          title: 'Redmi Pad',                 tag: 'AI Commercial'           },
    { src: B + '2800_webp/0f56a6176339499.64c2ce76ae1e2.png',        title: 'POCO — CGI Compositing',    tag: 'Product CGI'             },
    { src: '/images/portfolio/ai-design/bureau-of-burdens/16.webp',  title: 'Bureau of Burdens',         tag: 'AI Character Design'     },
    { src: B + 'fs_webp/01fe8d176339353.64c2cdef58a37.png',          title: 'Reebok Campaign',            tag: 'Sports & Lifestyle'      },
    { src: B + 'max_1200/56982f186664533.6579803d7acd4.jpg',         title: 'TITAN Campaign',             tag: 'Luxury Brand'            },
    { src: '/images/portfolio/ai-design/melon-kings/03.webp',        title: 'Melon Kings',               tag: 'AI Character Design'     },
    { src: B + '2800_webp/3de5c0121205149.60c0f1f134e99.jpg',        title: 'Celio Campaign',             tag: 'Fashion & Menswear'      },
    { src: '/images/portfolio/ai-design/violette/01.webp',           title: 'VIOLETTE Fashion',           tag: 'AI Fashion Campaign'     },
    { src: B + 'max_1200/408482215662483.68e5679a715d6.jpg',         title: 'Pooja Hegde — Forever New', tag: 'Celebrity × Brand'       },
    { src: '/images/portfolio/ai-design/maggi-rebrand/01.webp',      title: 'Maggi Rebrand',             tag: 'AI Brand Strategy'       },
    { src: B + 'max_1200/593600230573091.6879090c60866.jpeg',        title: 'AJIO Campaign',              tag: 'Fashion Commercial'      },
    { src: '/images/portfolio/ai-design/bureau-of-burdens/01.webp',  title: 'Bureau of Burdens',         tag: 'AI Character Design'     },
    { src: B + 'max_1200/331d46212390569.6734455067b11.jpg',         title: 'GIVA × Anushka Sharma',    tag: 'Jewellery & Luxury'      },
];

function createCard(item) {
    const card = document.createElement('a');
    card.className = 'fw-card';
    card.href = '#work';
    card.setAttribute('aria-label', item.title);
    card.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
    });

    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.title;
    img.className = 'fw-card__img';
    img.loading = 'lazy';
    img.decoding = 'async';

    const overlay = document.createElement('div');
    overlay.className = 'fw-card__overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = `
        <span class="fw-card__title">${item.title}</span>
        <span class="fw-card__tag">${item.tag}</span>
    `;

    card.appendChild(img);
    card.appendChild(overlay);
    return card;
}

export function initFeaturedWork() {
    const stage = document.getElementById('fw-stage');
    if (!stage) return;

    const colCount = window.innerWidth >= 1024 ? 6
                   : window.innerWidth >= 600  ? 4
                   : 2;

    const grid = document.createElement('div');
    grid.className = 'fw-grid';

    // Create columns
    const cols = Array.from({ length: colCount }, () => {
        const col = document.createElement('div');
        col.className = 'fw-col';
        grid.appendChild(col);
        return col;
    });

    // Distribute images round-robin, cycling through the list multiple times so
    // every column overflows the grid height at natural aspect ratios — no cropping.
    // overflow:hidden on .fw-grid clips the excess; the mask gradient fades the bottom.
    const totalSlots = colCount * 10; // 10 images per column guarantees overflow
    for (let i = 0; i < totalSlots; i++) {
        cols[i % colCount].appendChild(createCard(WALL_IMAGES[i % WALL_IMAGES.length]));
    }

    stage.appendChild(grid);
}

import { INDONESIAN_FOODS } from '@/Data/IndonesianFoods';

/* ═══════════════════════════════════════════════════════════
   FOOD LOOKUP
   ═══════════════════════════════════════════════════════════ */
const FM = {};
for (const [, items] of Object.entries(INDONESIAN_FOODS)) {
    for (const f of items) FM[f.name] = f;
}
function gf(names) { return names.map(n => FM[n]).filter(Boolean); }

/* ═══════════════════════════════════════════════════════════
   DISPLAY NAMES
   ═══════════════════════════════════════════════════════════ */
const DN = {
    'Gado-gado (Bumbu dipisah)': 'Gado-gado', 'Bubur Ayam (Tanpa Kuah)': 'Bubur Ayam',
    'Dada Ayam (Rebus/Panggang)': 'Dada Ayam Panggang', 'Paha Ayam Tnp Kulit': 'Paha Ayam',
    'Sate Ayam (Tanpa Bumbu Kacang)': 'Sate Ayam', 'Daging Sapi (Has Dalam/Tenderloin)': 'Daging Sapi Tenderloin',
    'Daging Sapi (Cincang)': 'Daging Sapi Cincang', 'Tempe (Kukus/Panggang)': 'Tempe Kukus',
    'Tahu Putih (Kukus)': 'Tahu Kukus', 'Oatmeal (Mentah)': 'Oatmeal',
    'Mie Telur (Rebus)': 'Mie Telur', 'Pasta Spaghetti (Rebus)': 'Pasta Spaghetti',
    'Bubur Kacang Hijau (Tanpa Santan)': 'Bubur Kacang Hijau', 'Terong Balado (sedikit minyak)': 'Terong Balado',
    'Sayur Sop (Wortel, Buncis, Kol)': 'Sayur Sop', 'Pisang Sunpride / Cavendish': 'Pisang Cavendish',
    'Susu Protein / Whey': 'Whey Protein', 'Susu Sapi Cair Full Cream': 'Susu Full Cream',
    'Susu Sapi Cair Low Fat': 'Susu Low Fat', 'Cah Kangkung Saus Tiram': 'Cah Kangkung',
    'Kubis / Kol Rebus': 'Kol Rebus', 'Lontong / Ketupat': 'Lontong',
    'Telur Ceplok (Mata Sapi)': 'Telur Ceplok', 'Jagung Manis Rebus': 'Jagung Manis',
    'Bihun Jagung (Mentah)': 'Bihun Jagung', 'Misoa (Mentah)': 'Misoa',
    'Ikan Nila Panggang': 'Ikan Nila Bakar', 'Kacang Hijau Rebus': 'Kacang Hijau',
    'Kacang Kedelai Goreng': 'Kacang Kedelai', 'Teri Medan Kering': 'Teri Goreng',
    'Kerang Dara Rebus': 'Kerang Rebus', 'Makaroni Gandum': 'Makaroni',
    'Telur Puyuh Rebus': 'Telur Puyuh', 'Mashed Potato (Kentang Tumbuk)': 'Mashed Potato',
    'Roti Tawar Gandum Panggang': 'Roti Gandum Panggang', 'Dada Ayam Filet Tepung (Katsu)': 'Chicken Katsu',
};

/* ═══════════════════════════════════════════════════════════
   NATURAL UNIT SIZES
   ═══════════════════════════════════════════════════════════ */
const NU = {
    // Carbs
    'Nasi Putih':{u:'porsi',g:150},'Nasi Merah':{u:'porsi',g:150},'Nasi Jagung':{u:'porsi',g:150},
    'Nasi Uduk':{u:'porsi',g:150},'Nasi Goreng':{u:'piring',g:200},'Lontong / Ketupat':{u:'potong',g:100},
    'Bubur Ayam (Tanpa Kuah)':{u:'mangkuk',g:250},'Kentang Rebus':{u:'buah',g:150},
    'Ubi Jalar Rebus':{u:'buah',g:150},'Singkong Rebus':{u:'potong',g:100},'Talas Rebus':{u:'potong',g:100},
    'Oatmeal (Mentah)':{u:'porsi',g:40},'Mie Telur (Rebus)':{u:'porsi',g:150},
    'Pasta Spaghetti (Rebus)':{u:'porsi',g:150},'Jagung Manis Rebus':{u:'tongkol',g:150},
    'Roti Gandum':{u:'lembar',g:30},'Roti Putih':{u:'lembar',g:30},
    'Bihun Jagung (Mentah)':{u:'porsi',g:50},'Misoa (Mentah)':{u:'porsi',g:50},
    'Makaroni Gandum':{u:'porsi',g:50},'Mie Goreng':{u:'piring',g:200},
    'Bihun Goreng':{u:'piring',g:200},'Kwetiau Goreng':{u:'piring',g:200},
    'Nasi Kuning':{u:'porsi',g:150},'Nasi Bakar':{u:'bungkus',g:150},'Nasi Liwet':{u:'porsi',g:150},
    'Nasi Shirataki':{u:'porsi',g:150},'Soun Goreng':{u:'piring',g:100},'Ketan Putih (Kukus)':{u:'porsi',g:100},
    'Ketan Hitam':{u:'porsi',g:100},'Roti Tawar Gandum Panggang':{u:'lembar',g:30},
    'Mashed Potato (Kentang Tumbuk)':{u:'porsi',g:150},'Perkedel Kentang':{u:'buah',g:50},
    'Perkedel Jagung':{u:'buah',g:50},
    // Proteins
    'Dada Ayam (Rebus/Panggang)':{u:'potong',g:100},'Paha Ayam Tnp Kulit':{u:'potong',g:100},
    'Ayam Goreng Paha':{u:'potong',g:100},'Bebek Goreng':{u:'potong',g:100},
    'Sate Ayam (Tanpa Bumbu Kacang)':{u:'tusuk',g:20},'Sate Kambing':{u:'tusuk',g:20},
    'Tempe (Kukus/Panggang)':{u:'potong',g:50},'Tempe Goreng':{u:'potong',g:50},
    'Tahu Putih (Kukus)':{u:'potong',g:50},'Tahu Goreng':{u:'potong',g:50},
    'Rendang Sapi':{u:'potong',g:50},'Daging Sapi (Has Dalam/Tenderloin)':{u:'potong',g:100},
    'Daging Sapi (Cincang)':{u:'porsi',g:100},
    'Ikan Nila Panggang':{u:'ekor',g:150},'Ikan Lele Bakar':{u:'ekor',g:100},
    'Ikan Lele Goreng':{u:'ekor',g:100},'Ikan Tuna':{u:'potong',g:100},
    'Ikan Tongkol':{u:'potong',g:100},'Ikan Kembung':{u:'ekor',g:80},
    'Ikan Gurame Bakar':{u:'ekor',g:150},'Ikan Patin':{u:'potong',g:100},
    'Bandeng Presto':{u:'ekor',g:100},'Udang Rebus':{u:'ekor',g:15},
    'Cumi-cumi':{u:'porsi',g:100},'Kerang Dara Rebus':{u:'porsi',g:100},
    'Teri Medan Kering':{u:'sdm',g:15},
    'Telur Ayam Rebus':{u:'butir',g:50},'Telur Ceplok (Mata Sapi)':{u:'butir',g:50},
    'Telur Dadar':{u:'butir',g:50},'Telur Asin':{u:'butir',g:60},
    'Telur Puyuh Rebus':{u:'butir',g:10},'Putih Telur':{u:'butir',g:30},
    'Ayam Bakar Taliwang':{u:'potong',g:100},'Ayam Pop':{u:'potong',g:100},
    'Ayam Betutu':{u:'potong',g:100},'Dada Ayam Filet Tepung (Katsu)':{u:'potong',g:100},
    'Gulai Ayam':{u:'potong',g:100},'Bebek Bakar':{u:'potong',g:100},
    'Telur Balado':{u:'butir',g:60},'Telur Bumbu Rujak':{u:'butir',g:60},
    'Telur Orak-Arik':{u:'porsi',g:60},'Telur Puyuh Balado':{u:'butir',g:10},
    'Ikan Bandeng Bakar':{u:'ekor',g:100},'Ikan Bawal Bakar':{u:'ekor',g:100},
    'Ikan Dori Panggang':{u:'potong',g:100},'Ikan Salmon Panggang':{u:'potong',g:100},
    'Ikan Kakap Asam Manis':{u:'potong',g:100},'Cumi Saus Tiram':{u:'porsi',g:100},
    'Udang Balado':{u:'porsi',g:100},'Udang Goreng Mentega':{u:'porsi',g:100},
    'Sate Lilit Ayam':{u:'tusuk',g:20},'Sate Padang':{u:'tusuk',g:20},
    'Sop Daging Sapi':{u:'mangkuk',g:150},'Empal Goreng':{u:'potong',g:50},
    'Dendeng Balado':{u:'potong',g:50},'Semur Daging Sapi':{u:'porsi',g:100},
    'Rawon Daging Sapi':{u:'mangkuk',g:150},'Tongseng Kambing':{u:'mangkuk',g:150},
    'Gulai Kambing':{u:'mangkuk',g:150},'Tempe Bacem':{u:'potong',g:50},
    'Tempe Orek':{u:'porsi',g:50},'Tahu Bacem':{u:'potong',g:50},
    // Veggies
    'Bayam Bening':{u:'mangkuk',g:150},'Sayur Sop (Wortel, Buncis, Kol)':{u:'mangkuk',g:150},
    'Sayur Asem':{u:'mangkuk',g:150},'Sayur Lodeh':{u:'mangkuk',g:150},
    'Capcay Kuah':{u:'porsi',g:150},'Gado-gado (Bumbu dipisah)':{u:'porsi',g:200},
    'Pecel Sayur':{u:'porsi',g:150},'Daun Singkong Rebus':{u:'mangkuk',g:100},
    'Daun Pepaya Rebus':{u:'mangkuk',g:100},'Pare Rebus':{u:'potong',g:50},
    'Oyong Rebus':{u:'mangkuk',g:100},'Tomat Segar':{u:'buah',g:50},
    'Timun Segar':{u:'buah',g:100},'Bening Bayam Jagung':{u:'mangkuk',g:150},
    'Plecing Kangkung':{u:'porsi',g:100},'Tumis Sawi Putih Bakso':{u:'porsi',g:150},
    'Tumis Pakcoy Bawang Putih':{u:'porsi',g:100},'Tumis Daun Singkong':{u:'porsi',g:100},
    'Gulai Daun Singkong':{u:'mangkuk',g:150},'Tumis Bunga Pepaya':{u:'porsi',g:100},
    'Tumis Pare Belut':{u:'porsi',g:100},'Sop Oyong Sohun':{u:'mangkuk',g:150},
    'Sop Kimlo':{u:'mangkuk',g:150},'Sayur Nangka Muda (Gulai)':{u:'mangkuk',g:150},
    'Sayur Rebung':{u:'mangkuk',g:100},'Karedok':{u:'porsi',g:150},
    'Urap Sayur':{u:'porsi',g:100},'Trancam':{u:'porsi',g:100},
    'Asinan Sayur':{u:'porsi',g:150},'Acar Kuning':{u:'porsi',g:100},
    'Tumis Genjer':{u:'porsi',g:100},'Tumis Jamur Kancing':{u:'porsi',g:100},
    'Tumis Jamur Kuping':{u:'porsi',g:100},
    // Others
    'Buah Naga Merah':{u:'buah',g:300},'Mangga Harumanis':{u:'buah',g:250},
    'Semangka':{u:'potong',g:200},'Melon':{u:'potong',g:150},
    'Pepaya':{u:'potong',g:150},'Alpukat':{u:'buah',g:200},
    'Nanas':{u:'potong',g:100},'Jambu Biji':{u:'buah',g:150},
    'Kacang Tanah Sangrai':{u:'genggam',g:30},'Kacang Almond':{u:'genggam',g:20},
    'Edamame Rebus':{u:'porsi',g:100},'Kurma':{u:'butir',g:8},
    'Bubur Kacang Hijau (Tanpa Santan)':{u:'mangkuk',g:200},
    'Yogurt Plain':{u:'porsi',g:100},'Salad Buah':{u:'porsi',g:150},
    'Rujak Buah':{u:'porsi',g:150},'Asinan Buah':{u:'porsi',g:150},
    'Pudding Susu':{u:'cup',g:100},'Pudding Coklat':{u:'cup',g:100},
    'Kacang Mete Panggang':{u:'genggam',g:30},'Kacang Kenari':{u:'genggam',g:30},
    'Kuaci Bunga Matahari':{u:'genggam',g:30},'Sari Kacang Hijau':{u:'gelas',g:250},
    'Susu Kedelai':{u:'gelas',g:250},'Jus Alpukat':{u:'gelas',g:250},
    'Jus Jeruk':{u:'gelas',g:250},'Jus Apel':{u:'gelas',g:250},
    'Smoothie Pisang':{u:'gelas',g:250},'Oatmeal Cookies':{u:'keping',g:25},
    'Yogurt Buah':{u:'porsi',g:150}
};

/* ═══════════════════════════════════════════════════════════
   CUTTING FILTER
   ═══════════════════════════════════════════════════════════ */
const CUT_X = new Set([
    'Nasi Goreng','Nasi Uduk','Ayam Goreng Paha','Bebek Goreng','Tempe Goreng','Tahu Goreng',
    'Kentang Goreng','Mie Goreng','Bihun Goreng','Kwetiau Goreng','Rendang Sapi','Ikan Lele Goreng',
    'Telur Asin','Telur Dadar','Kacang Tanah Sangrai','Alpukat','Sayur Lodeh',
    'Gado-gado (Bumbu dipisah)','Pecel Sayur','Susu Sapi Cair Full Cream',
    'Nasi Kuning','Nasi Liwet','Nasi Bakar','Dada Ayam Filet Tepung (Katsu)','Gulai Ayam','Bebek Bakar',
    'Telur Balado','Ikan Salmon Panggang','Udang Goreng Mentega','Empal Goreng','Tongseng Kambing','Gulai Kambing',
    'Sayur Nangka Muda (Gulai)','Gulai Daun Singkong','Pudding Coklat','Kacang Mete Panggang','Kuaci Bunga Matahari',
    'Jus Alpukat','Smoothie Pisang','Oatmeal Cookies','Rujak Buah','Asinan Buah','Salad Buah'
]);
function fg(names, goal) {
    if (goal !== 'cutting') return names;
    const r = names.filter(n => !CUT_X.has(n));
    return r.length > 0 ? r : names;
}

/* ═══════════════════════════════════════════════════════════
   RANDOM — Mulberry32
   ═══════════════════════════════════════════════════════════ */
function sr(seed) {
    let t = (seed + 0x6D2B79F5) | 0;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
function pk(arr, seed) { return (!arr || !arr.length) ? null : arr[Math.floor(sr(seed) * arr.length)]; }
function cl(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

/* ═══════════════════════════════════════════════════════════
   PORTION FORMATTING
   ═══════════════════════════════════════════════════════════ */
function ebg(p) {
    const m1 = p.match(/\((\d+)g\)/); if (m1) return +m1[1];
    const m2 = p.match(/^(\d+)g$/); if (m2) return +m2[1];
    const m3 = p.match(/(\d+)ml/); if (m3) return +m3[1];
    const m4 = p.match(/(\d+)g/); if (m4) return +m4[1];
    return 100;
}

function fp(food, scale) {
    const tg = Math.round(ebg(food.portion) * scale);
    const eu = food.portion.match(/^([\d.]+)\s*(buah|lembar|butir|tusuk|scoop|ekor|tongkol|sdm|bungkus|cup|keping|gelas)/i);
    if (eu) return fc(parseFloat(eu[1]) * scale, eu[2], tg);
    const n = NU[food.name]; if (n) return fc(tg / n.g, n.u, tg);
    if (food.portion.includes('ml')) return `± ${tg}ml`;
    return `± ${tg}g`;
}

function fc(count, unit, grams) {
    const isDiscrete = /buah|butir|ekor|lembar|tongkol|tusuk|scoop|sdm|bungkus|cup|keping|gelas/i.test(unit);
    
    let step = 0.25;
    if (isDiscrete) {
        if (count >= 2.75) step = 1.0; 
        else step = 0.5;               
    } else {
        if (count >= 4.75) step = 1.0;      
        else if (count >= 2.75) step = 0.5; 
        else step = 0.25;                   
    }

    let r = Math.round(count / step) * step;
    if (r <= 0) r = isDiscrete ? 0.5 : 0.25;
    
    const exactGrams = Math.round((grams / count) * r);
    let s;
    if (r === 0.25) s = '¼';
    else if (r === 0.5) s = '½';
    else if (r === 0.75) s = '¾';
    else if (r % 1 === 0.25) s = `${Math.floor(r)}¼`;
    else if (r % 1 === 0.5) s = `${Math.floor(r)}½`;
    else if (r % 1 === 0.75) s = `${Math.floor(r)}¾`;
    else s = `${Math.round(r)}`;
    
    return `± ${s} ${unit} (${exactGrams}g)`;
}

/* ═══════════════════════════════════════════════════════════
   ITEM & SUM HELPERS
   ═══════════════════════════════════════════════════════════ */
function getMR(split) {
    if (split === 'Lower Carb') return { p: 0.40, f: 0.40, c: 0.20 };
    if (split === 'Higher Carb') return { p: 0.30, f: 0.20, c: 0.50 };
    return { p: 0.30, f: 0.35, c: 0.35 };
}
function mi(food, scale) {
    const s = cl(scale, 0.25, 3.5);
    return { name: food.name, displayName: DN[food.name] || food.name, scaledPortion: fp(food, s),
        scale: Math.round(s * 100) / 100, protein: Math.round(food.protein * s * 10) / 10,
        carbs: Math.round(food.carbs * s * 10) / 10, fats: Math.round(food.fats * s * 10) / 10,
        calories: Math.round(food.cals * s) };
}
function si(items) {
    return items.reduce((a, i) => ({ protein: a.protein + i.protein, carbs: a.carbs + i.carbs, fats: a.fats + i.fats, calories: a.calories + i.calories }), { protein: 0, carbs: 0, fats: 0, calories: 0 });
}

/* ═══════════════════════════════════════════════════════════
   MACRO OPTIMIZER (Coordinate Descent)
   ═══════════════════════════════════════════════════════════ */
function balanceMealMacros(items, targets) {
    const foods = items.map(i => FM[i.name]);
    let scales = items.map(i => Math.max(0.25, Math.min(3.5, i.scale || 1.0)));

    function getLoss(s) {
        let p = 0, c = 0, f = 0;
        for(let i=0; i<foods.length; i++) {
            if(!foods[i]) continue;
            p += foods[i].protein * s[i];
            c += foods[i].carbs * s[i];
            f += foods[i].fats * s[i];
        }
        const dP = p - targets.protein;
        const dC = c - targets.carbs;
        const dF = f - targets.fats;
        return (dP * dP * 1.0) + (dC * dC * 1.5) + (dF * dF * 0.2);
    }

    const stepSizes = [0.5, 0.1, 0.05];
    for (const step of stepSizes) {
        let improved = true;
        let iter = 0;
        while(improved && iter < 100) {
            improved = false;
            iter++;
            for(let i=0; i<scales.length; i++) {
                if(!foods[i]) continue;
                let currentLoss = getLoss(scales);
                scales[i] += step;
                if (scales[i] <= 3.5 && getLoss(scales) < currentLoss) {
                    currentLoss = getLoss(scales); improved = true;
                } else scales[i] -= step;
                
                scales[i] -= step;
                if (scales[i] >= 0.25 && getLoss(scales) < currentLoss) {
                    currentLoss = getLoss(scales); improved = true;
                } else scales[i] += step;
            }
        }
    }

    items = items.map((item, i) => { const food = foods[i]; return food ? mi(food, scales[i]) : item; });

    let finalCals = si(items).calories;
    if (finalCals > 0) {
        const ratioCal = (targets.calories * 0.99) / finalCals;
        if (Math.abs(ratioCal - 1) > 0.02) {
            items = items.map(item => { const food = FM[item.name]; return food ? mi(food, cl(item.scale * ratioCal, 0.25, 3.5)) : item; });
        }
    }

    let checkCals = si(items).calories;
    if (checkCals > targets.calories) {
        const factor = targets.calories / checkCals;
        items = items.map(item => { const food = FM[item.name]; return food ? mi(food, item.scale * factor) : item; });
    }

    return items;
}

/* ═══════════════════════════════════════════════════════════
   MEAL SLOTS
   ═══════════════════════════════════════════════════════════ */
export const MEAL_SLOTS = [
    { time: '07:00', type: 'Sarapan', pct: 0.25, gen: 'breakfast' },
    { time: '10:00', type: 'Camilan Pagi', pct: 0.10, gen: 'snack' },
    { time: '13:00', type: 'Makan Siang', pct: 0.30, gen: 'lunch' },
    { time: '16:00', type: 'Camilan Sore', pct: 0.10, gen: 'snack' },
    { time: '19:30', type: 'Makan Malam', pct: 0.25, gen: 'dinner' },
];

/* ═══════════════════════════════════════════════════════════
   FOOD POOLS PER MEAL TIME
   ═══════════════════════════════════════════════════════════ */
const BREAKFAST = {
    carbs: ['Nasi Putih', 'Nasi Uduk', 'Nasi Goreng', 'Bubur Ayam (Tanpa Kuah)', 'Roti Gandum', 'Roti Putih', 'Roti Tawar Gandum Panggang', 'Oatmeal (Mentah)', 'Lontong / Ketupat', 'Ubi Jalar Rebus', 'Singkong Rebus', 'Kentang Rebus', 'Mashed Potato (Kentang Tumbuk)', 'Talas Rebus', 'Mie Goreng', 'Bihun Goreng', 'Nasi Kuning', 'Ketan Putih (Kukus)'],
    defaultProteins: ['Telur Ayam Rebus', 'Telur Ceplok (Mata Sapi)', 'Telur Dadar', 'Telur Asin', 'Telur Puyuh Rebus', 'Putih Telur', 'Tempe (Kukus/Panggang)', 'Tempe Goreng', 'Tahu Putih (Kukus)', 'Tahu Goreng', 'Telur Balado', 'Telur Bumbu Rujak', 'Telur Orak-Arik'],
    defaultSides: ['Pisang Ambon', 'Pisang Sunpride / Cavendish', 'Apel', 'Jeruk Manis', 'Pepaya', 'Mangga Harumanis', 'Semangka', 'Melon', 'Timun Segar', 'Tomat Segar'],
};

const LUNCH = {
    carbs: ['Nasi Putih', 'Nasi Merah', 'Nasi Jagung', 'Nasi Goreng', 'Nasi Uduk', 'Mie Telur (Rebus)', 'Mie Goreng', 'Bihun Goreng', 'Kwetiau Goreng', 'Bihun Jagung (Mentah)', 'Misoa (Mentah)', 'Soun Goreng', 'Pasta Spaghetti (Rebus)', 'Makaroni Gandum', 'Kentang Rebus', 'Lontong / Ketupat', 'Ubi Jalar Rebus', 'Singkong Rebus', 'Jagung Manis Rebus', 'Nasi Kuning', 'Nasi Bakar', 'Nasi Liwet', 'Nasi Shirataki', 'Ketan Hitam', 'Mashed Potato (Kentang Tumbuk)', 'Perkedel Kentang', 'Perkedel Jagung'],
    defaultProteins: ['Dada Ayam (Rebus/Panggang)', 'Paha Ayam Tnp Kulit', 'Ayam Goreng Paha', 'Bebek Goreng', 'Ayam Bakar Taliwang', 'Ayam Pop', 'Ayam Betutu', 'Dada Ayam Filet Tepung (Katsu)', 'Gulai Ayam', 'Bebek Bakar', 'Ikan Nila Panggang', 'Ikan Lele Bakar', 'Ikan Lele Goreng', 'Ikan Tuna', 'Ikan Tongkol', 'Ikan Gurame Bakar', 'Ikan Kembung', 'Ikan Patin', 'Bandeng Presto', 'Ikan Bandeng Bakar', 'Ikan Bawal Bakar', 'Ikan Dori Panggang', 'Ikan Salmon Panggang', 'Ikan Kakap Asam Manis', 'Teri Medan Kering', 'Udang Rebus', 'Udang Balado', 'Udang Goreng Mentega', 'Cumi-cumi', 'Cumi Saus Tiram', 'Kerang Dara Rebus', 'Daging Sapi (Has Dalam/Tenderloin)', 'Rendang Sapi', 'Daging Sapi (Cincang)', 'Sop Daging Sapi', 'Empal Goreng', 'Dendeng Balado', 'Semur Daging Sapi', 'Rawon Daging Sapi', 'Tempe (Kukus/Panggang)', 'Tempe Goreng', 'Tempe Bacem', 'Tempe Orek', 'Tahu Putih (Kukus)', 'Tahu Goreng', 'Tahu Bacem', 'Telur Ayam Rebus', 'Telur Dadar', 'Telur Asin', 'Telur Ceplok (Mata Sapi)', 'Telur Puyuh Rebus', 'Telur Balado', 'Telur Bumbu Rujak', 'Telur Orak-Arik', 'Telur Puyuh Balado', 'Putih Telur', 'Sate Ayam (Tanpa Bumbu Kacang)', 'Sate Lilit Ayam', 'Sate Kambing', 'Sate Padang', 'Tongseng Kambing', 'Gulai Kambing'],
    defaultSides: ['Bayam Rebus', 'Bayam Bening', 'Bening Bayam Jagung', 'Kangkung Tumis Air', 'Cah Kangkung Saus Tiram', 'Plecing Kangkung', 'Brokoli Kukus', 'Kembang Kol Rebus', 'Wortel Rebus', 'Buncis Rebus', 'Tumis Kacang Panjang', 'Sawi Hijau', 'Sawi Putih', 'Tumis Sawi Putih Bakso', 'Tumis Pakcoy Bawang Putih', 'Tauge Rebus', 'Kubis / Kol Rebus', 'Labu Siam Kukus', 'Terong Balado (sedikit minyak)', 'Sayur Sop (Wortel, Buncis, Kol)', 'Sayur Asem', 'Sayur Lodeh', 'Capcay Kuah', 'Tomat Segar', 'Timun Segar', 'Daun Singkong Rebus', 'Tumis Daun Singkong', 'Gulai Daun Singkong', 'Daun Pepaya Rebus', 'Tumis Bunga Pepaya', 'Pare Rebus', 'Tumis Pare Belut', 'Oyong Rebus', 'Sop Oyong Sohun', 'Sop Kimlo', 'Sayur Nangka Muda (Gulai)', 'Sayur Rebung', 'Pecel Sayur', 'Gado-gado (Bumbu dipisah)', 'Karedok', 'Urap Sayur', 'Trancam', 'Asinan Sayur', 'Acar Kuning', 'Tumis Genjer', 'Tumis Jamur Kancing', 'Tumis Jamur Kuping'],
};

const DINNER = {
    carbs: ['Nasi Putih', 'Nasi Merah', 'Nasi Jagung', 'Nasi Goreng', 'Mie Telur (Rebus)', 'Mie Goreng', 'Bihun Goreng', 'Kwetiau Goreng', 'Bihun Jagung (Mentah)', 'Misoa (Mentah)', 'Soun Goreng', 'Pasta Spaghetti (Rebus)', 'Makaroni Gandum', 'Kentang Rebus', 'Ubi Jalar Rebus', 'Singkong Rebus', 'Lontong / Ketupat', 'Jagung Manis Rebus', 'Nasi Shirataki', 'Mashed Potato (Kentang Tumbuk)'],
    defaultProteins: ['Dada Ayam (Rebus/Panggang)', 'Paha Ayam Tnp Kulit', 'Ayam Goreng Paha', 'Ayam Bakar Taliwang', 'Ayam Betutu', 'Ikan Nila Panggang', 'Ikan Tuna', 'Ikan Tongkol', 'Ikan Gurame Bakar', 'Ikan Lele Bakar', 'Ikan Lele Goreng', 'Ikan Kembung', 'Ikan Patin', 'Bandeng Presto', 'Ikan Bandeng Bakar', 'Ikan Bawal Bakar', 'Ikan Dori Panggang', 'Ikan Salmon Panggang', 'Teri Medan Kering', 'Udang Rebus', 'Cumi-cumi', 'Kerang Dara Rebus', 'Daging Sapi (Has Dalam/Tenderloin)', 'Daging Sapi (Cincang)', 'Sop Daging Sapi', 'Semur Daging Sapi', 'Tempe (Kukus/Panggang)', 'Tempe Goreng', 'Tempe Bacem', 'Tempe Orek', 'Tahu Putih (Kukus)', 'Tahu Goreng', 'Tahu Bacem', 'Telur Ayam Rebus', 'Telur Dadar', 'Telur Ceplok (Mata Sapi)', 'Telur Puyuh Rebus', 'Telur Balado', 'Telur Bumbu Rujak', 'Telur Orak-Arik', 'Telur Puyuh Balado', 'Putih Telur', 'Sate Ayam (Tanpa Bumbu Kacang)', 'Sate Lilit Ayam', 'Sate Kambing', 'Sate Padang'],
    defaultSides: ['Bayam Rebus', 'Bayam Bening', 'Bening Bayam Jagung', 'Kangkung Tumis Air', 'Cah Kangkung Saus Tiram', 'Plecing Kangkung', 'Brokoli Kukus', 'Kembang Kol Rebus', 'Wortel Rebus', 'Buncis Rebus', 'Tumis Kacang Panjang', 'Sawi Hijau', 'Sawi Putih', 'Tumis Sawi Putih Bakso', 'Tumis Pakcoy Bawang Putih', 'Tauge Rebus', 'Kubis / Kol Rebus', 'Labu Siam Kukus', 'Sayur Sop (Wortel, Buncis, Kol)', 'Sayur Asem', 'Capcay Kuah', 'Tomat Segar', 'Timun Segar', 'Daun Singkong Rebus', 'Tumis Daun Singkong', 'Daun Pepaya Rebus', 'Tumis Bunga Pepaya', 'Pare Rebus', 'Tumis Pare Belut', 'Oyong Rebus', 'Sop Oyong Sohun', 'Sop Kimlo', 'Sayur Rebung', 'Urap Sayur', 'Trancam', 'Acar Kuning', 'Tumis Genjer', 'Tumis Jamur Kancing', 'Tumis Jamur Kuping'],
};

/* ═══════════════════════════════════════════════════════════
   CARB COMPATIBILITY OVERRIDES (CC)
   ═══════════════════════════════════════════════════════════ */
const CC = {
    'Oatmeal (Mentah)': { proteins: ['Susu Sapi Cair Low Fat', 'Susu Sapi Cair Full Cream', 'Yogurt Plain', 'Susu Protein / Whey'], sides: ['Pisang Ambon', 'Pisang Sunpride / Cavendish', 'Apel', 'Mangga Harumanis', 'Buah Naga Merah', 'Jeruk Manis', 'Pepaya', 'Alpukat', 'Semangka', 'Melon'] },
    'Roti Gandum': { proteins: ['Telur Ayam Rebus', 'Telur Ceplok (Mata Sapi)', 'Telur Dadar', 'Telur Orak-Arik', 'Susu Sapi Cair Low Fat', 'Yogurt Plain'], sides: ['Pisang Ambon', 'Pisang Sunpride / Cavendish', 'Apel', 'Jeruk Manis', 'Pepaya', 'Mangga Harumanis', 'Semangka'] },
    'Roti Putih': { proteins: ['Telur Ayam Rebus', 'Telur Ceplok (Mata Sapi)', 'Telur Dadar', 'Telur Orak-Arik', 'Susu Sapi Cair Low Fat', 'Yogurt Plain'], sides: ['Pisang Ambon', 'Apel', 'Jeruk Manis', 'Pepaya', 'Melon', 'Semangka'] },
    'Roti Tawar Gandum Panggang': { proteins: ['Telur Ayam Rebus', 'Telur Ceplok (Mata Sapi)', 'Telur Dadar', 'Telur Orak-Arik', 'Susu Sapi Cair Low Fat', 'Yogurt Plain'], sides: ['Pisang Ambon', 'Apel', 'Jeruk Manis', 'Pepaya', 'Melon', 'Semangka'] },
    'Bubur Ayam (Tanpa Kuah)': { proteins: ['Telur Ayam Rebus', 'Telur Puyuh Rebus', 'Sate Ayam (Tanpa Bumbu Kacang)'], sides: [] },
    'Nasi Goreng': { proteins: ['Telur Ceplok (Mata Sapi)', 'Telur Dadar', 'Ayam Goreng Paha', 'Paha Ayam Tnp Kulit', 'Sate Ayam (Tanpa Bumbu Kacang)', 'Ayam Bakar Taliwang'], sides: ['Timun Segar', 'Tomat Segar', 'Kubis / Kol Rebus', 'Acar Kuning'] },
    'Nasi Kuning': { proteins: ['Telur Dadar', 'Ayam Goreng Paha', 'Ayam Bakar Taliwang', 'Telur Balado', 'Telur Bumbu Rujak', 'Perkedel Kentang'], sides: ['Timun Segar', 'Tomat Segar'] },
    'Nasi Liwet': { proteins: ['Ayam Goreng Paha', 'Ayam Bakar Taliwang', 'Ikan Bandeng Bakar', 'Ikan Lele Goreng', 'Telur Balado'], sides: ['Timun Segar', 'Tomat Segar', 'Daun Singkong Rebus'] },
    'Mie Goreng': { proteins: ['Telur Ceplok (Mata Sapi)', 'Telur Dadar', 'Ayam Goreng Paha', 'Udang Rebus', 'Daging Sapi (Cincang)'], sides: ['Sawi Hijau', 'Sawi Putih', 'Tomat Segar', 'Timun Segar', 'Tauge Rebus'] },
    'Bihun Goreng': { proteins: ['Telur Ceplok (Mata Sapi)', 'Telur Dadar', 'Ayam Goreng Paha', 'Udang Rebus'], sides: ['Sawi Hijau', 'Sawi Putih', 'Wortel Rebus'] },
    'Kwetiau Goreng': { proteins: ['Telur Ceplok (Mata Sapi)', 'Telur Dadar', 'Ayam Goreng Paha', 'Udang Rebus'], sides: ['Sawi Hijau', 'Sawi Putih', 'Tauge Rebus'] },
    'Soun Goreng': { proteins: ['Telur Ceplok (Mata Sapi)', 'Telur Dadar', 'Ayam Goreng Paha', 'Udang Rebus'], sides: ['Sawi Hijau', 'Sawi Putih', 'Wortel Rebus'] },
    'Nasi Uduk': { proteins: ['Telur Ceplok (Mata Sapi)', 'Telur Dadar', 'Ayam Goreng Paha', 'Tempe Goreng', 'Tahu Goreng', 'Paha Ayam Tnp Kulit', 'Telur Ayam Rebus', 'Telur Asin', 'Semur Daging Sapi'], sides: ['Timun Segar', 'Tomat Segar', 'Acar Kuning'] },
    'Lontong / Ketupat': { proteins: ['Telur Ayam Rebus', 'Tempe (Kukus/Panggang)', 'Tempe Goreng', 'Tahu Putih (Kukus)', 'Tahu Goreng', 'Sate Ayam (Tanpa Bumbu Kacang)', 'Telur Asin', 'Daging Sapi (Has Dalam/Tenderloin)'], sides: ['Sayur Lodeh', 'Pecel Sayur', 'Gado-gado (Bumbu dipisah)', 'Sayur Sop (Wortel, Buncis, Kol)', 'Capcay Kuah', 'Labu Siam Kukus'] },
    'Mie Telur (Rebus)': { proteins: ['Telur Ayam Rebus', 'Dada Ayam (Rebus/Panggang)', 'Paha Ayam Tnp Kulit', 'Udang Rebus', 'Cumi-cumi', 'Telur Dadar', 'Telur Ceplok (Mata Sapi)', 'Tumis Sawi Putih Bakso'], sides: ['Brokoli Kukus', 'Sawi Hijau', 'Sawi Putih', 'Capcay Kuah', 'Kangkung Tumis Air', 'Tauge Rebus', 'Kembang Kol Rebus'] },
    'Pasta Spaghetti (Rebus)': { proteins: ['Dada Ayam (Rebus/Panggang)', 'Daging Sapi (Cincang)', 'Udang Rebus', 'Telur Ayam Rebus', 'Cumi-cumi'], sides: ['Brokoli Kukus', 'Wortel Rebus', 'Sawi Hijau', 'Tomat Segar', 'Kembang Kol Rebus'] },
    'Makaroni Gandum': { proteins: ['Dada Ayam (Rebus/Panggang)', 'Daging Sapi (Cincang)', 'Susu Sapi Cair Full Cream', 'Telur Ayam Rebus'], sides: ['Brokoli Kukus', 'Wortel Rebus'] },
    
    // Diet / Root Carbs Overrides (To prevent them pairing with heavy normal dishes)
    'Jagung Manis Rebus': { proteins: ['Telur Ayam Rebus', 'Susu Sapi Cair Low Fat', 'Yogurt Plain'], sides: ['Bayam Bening', 'Bening Bayam Jagung'] },
    'Singkong Rebus': { proteins: ['Telur Ayam Rebus', 'Susu Sapi Cair Low Fat', 'Yogurt Plain', 'Teri Medan Kering'], sides: [] },
    'Ubi Jalar Rebus': { proteins: ['Telur Ayam Rebus', 'Susu Sapi Cair Low Fat', 'Yogurt Plain'], sides: [] },
    'Talas Rebus': { proteins: ['Telur Ayam Rebus'], sides: [] },
    'Kentang Rebus': { proteins: ['Dada Ayam (Rebus/Panggang)', 'Ikan Tuna', 'Telur Ayam Rebus', 'Daging Sapi (Has Dalam/Tenderloin)'], sides: ['Brokoli Kukus', 'Wortel Rebus', 'Buncis Rebus'] },
    'Mashed Potato (Kentang Tumbuk)': { proteins: ['Dada Ayam (Rebus/Panggang)', 'Ikan Salmon Panggang', 'Daging Sapi (Has Dalam/Tenderloin)'], sides: ['Brokoli Kukus', 'Wortel Rebus', 'Buncis Rebus'] },
};

/* ═══════════════════════════════════════════════════════════
   PROTEIN COMPATIBILITY OVERRIDES (PC)
   ═══════════════════════════════════════════════════════════ */
const PC = {
    // Prevent double soup (Kuah + Kuah) or force specific pairings
    'Semur Daging Sapi': { sides: ['Tumis Sawi Putih Bakso', 'Tumis Pakcoy Bawang Putih', 'Tumis Daun Singkong', 'Bayam Rebus', 'Kangkung Tumis Air', 'Buncis Rebus', 'Tumis Kacang Panjang'] },
    'Sop Daging Sapi': { sides: ['Perkedel Kentang', 'Perkedel Jagung', 'Tempe Goreng', 'Tahu Goreng', 'Tempe Bacem'] },
    'Rawon Daging Sapi': { sides: ['Tauge Rebus', 'Telur Asin', 'Tempe Goreng'] },
    'Tongseng Kambing': { sides: ['Tomat Segar', 'Kubis / Kol Rebus', 'Timun Segar'] },
    'Gulai Kambing': { sides: ['Daun Singkong Rebus', 'Tumis Daun Singkong', 'Timun Segar'] },
    'Gulai Ayam': { sides: ['Daun Singkong Rebus', 'Tumis Daun Singkong', 'Timun Segar'] },
    'Sayur Nangka Muda (Gulai)': { sides: ['Daun Singkong Rebus', 'Tumis Daun Singkong'] },
    'Ayam Bakar Taliwang': { sides: ['Plecing Kangkung', 'Timun Segar', 'Tomat Segar'] },
    'Ayam Betutu': { sides: ['Plecing Kangkung', 'Urap Sayur', 'Tumis Kacang Panjang'] },
    'Ikan Bandeng Bakar': { sides: ['Sayur Asem', 'Sayur Lodeh', 'Kangkung Tumis Air', 'Tomat Segar', 'Timun Segar'] },
    'Ikan Lele Bakar': { sides: ['Tomat Segar', 'Timun Segar', 'Kubis / Kol Rebus', 'Sayur Asem'] },
    'Ikan Lele Goreng': { sides: ['Tomat Segar', 'Timun Segar', 'Kubis / Kol Rebus', 'Sayur Asem'] },
    'Ayam Goreng Paha': { sides: ['Sayur Asem', 'Sayur Lodeh', 'Tomat Segar', 'Timun Segar'] },
    'Rendang Sapi': { sides: ['Daun Singkong Rebus', 'Tumis Daun Singkong', 'Timun Segar'] },
};

/* ═══════════════════════════════════════════════════════════
   SNACK POOLS
   ═══════════════════════════════════════════════════════════ */
const SNACK_FRUITS = ['Pisang Ambon', 'Pisang Sunpride / Cavendish', 'Apel', 'Jeruk Manis', 'Pepaya', 'Semangka', 'Melon', 'Mangga Harumanis', 'Jambu Biji', 'Buah Naga Merah', 'Nanas', 'Rambutan', 'Duku', 'Salak', 'Kelengkeng', 'Manggis', 'Jambu Air', 'Bengkoang', 'Salad Buah', 'Rujak Buah', 'Asinan Buah', 'Jus Alpukat', 'Jus Jeruk', 'Jus Apel', 'Smoothie Pisang'];
const SNACK_PROTEINS = ['Yogurt Plain', 'Yogurt Buah', 'Susu Sapi Cair Low Fat', 'Susu Protein / Whey', 'Edamame Rebus', 'Telur Ayam Rebus', 'Telur Puyuh Rebus', 'Pudding Susu', 'Pudding Coklat', 'Sari Kacang Hijau', 'Susu Kedelai'];
const SNACK_NUTS = ['Kacang Almond', 'Kacang Tanah Sangrai', 'Kacang Kedelai Goreng', 'Edamame Rebus', 'Kacang Mete Panggang', 'Kacang Kenari', 'Kuaci Bunga Matahari'];
const SNACK_OTHERS = ['Kurma', 'Air Kelapa Muda', 'Bubur Kacang Hijau (Tanpa Santan)', 'Kacang Hijau Rebus', 'Daging Kelapa Muda', 'Oatmeal Cookies'];

/* ═══════════════════════════════════════════════════════════
   BUILDERS
   ═══════════════════════════════════════════════════════════ */
function getPool(carbName, pool, field) {
    const c = CC[carbName];
    if (c && c[field] !== undefined) return c[field];
    return pool['default' + field.charAt(0).toUpperCase() + field.slice(1)] || [];
}

function getValidSides(carbName, protName, pool, goal) {
    let sides = pool.defaultSides || [];
    let ccSides = CC[carbName] && CC[carbName].sides ? CC[carbName].sides : undefined;
    let pcSides = PC[protName] && PC[protName].sides ? PC[protName].sides : undefined;
    
    if (ccSides && pcSides) {
        const intersection = ccSides.filter(s => pcSides.includes(s));
        sides = intersection.length > 0 ? intersection : ccSides; // Intersection priority
    } else if (ccSides) {
        sides = ccSides;
    } else if (pcSides) {
        sides = pcSides;
    }
    
    return fg(sides, goal);
}

function buildMealFromPool(pool, targets, seed, goal) {
    const carbs = fg(pool.carbs, goal);
    const carb = pk(gf(carbs), seed);
    if (!carb) return [];

    const protNames = fg(getPool(carb.name, pool, 'proteins'), goal);
    const prot = protNames.length ? pk(gf(protNames), seed + 31) : null;

    const sideNames = getValidSides(carb.name, prot ? prot.name : null, pool, goal);
    const side = sideNames.length ? pk(gf(sideNames), seed + 67) : null;

    const items = [];
    items.push(mi(carb, 1.0));
    if (prot) items.push(mi(prot, 1.0));
    if (side) items.push(mi(side, 1.0));

    return balanceMealMacros(items, targets);
}

function buildSnack(targets, seed, goal, splitType) {
    const r = sr(seed + 999);
    const fruits = fg(SNACK_FRUITS, goal);
    const proteins = fg(SNACK_PROTEINS, goal);
    const nuts = fg(SNACK_NUTS, goal);
    const others = fg(SNACK_OTHERS, goal);

    let pickFruit = false, pickProt = false, pickNut = false, pickOther = false;

    if (splitType === 'Lower Carb') {
        if (r < 0.1) pickFruit = true;
        else if (r < 0.3) { pickFruit = true; pickProt = true; }
        else if (r < 0.8) pickNut = true;
        else pickOther = true;
    } else if (splitType === 'Higher Carb') {
        if (r < 0.5) pickFruit = true;
        else if (r < 0.8) { pickFruit = true; pickProt = true; }
        else if (r < 0.9) pickNut = true;
        else pickOther = true;
    } else {
        if (r < 0.35) pickFruit = true;
        else if (r < 0.65) { pickFruit = true; pickProt = true; }
        else if (r < 0.85) pickNut = true;
        else pickOther = true;
    }

    const items = [];
    if (pickFruit && !pickProt) {
        const f = pk(gf(fruits), seed + 31);
        if (f) items.push(mi(f, 1.0));
    } else if (pickFruit && pickProt) {
        const f = pk(gf(fruits), seed + 31);
        const p = pk(gf(proteins), seed + 67);
        if (f) items.push(mi(f, 1.0));
        if (p) items.push(mi(p, 1.0));
    } else if (pickNut) {
        const n = pk(gf(nuts), seed + 31);
        if (n) items.push(mi(n, 1.0));
    } else {
        const o = pk(gf(others), seed + 31);
        if (o) items.push(mi(o, 1.0));
    }

    return balanceMealMacros(items, targets);
}

function buildMeal(type, targets, seed, goal, splitType) {
    switch (type) {
        case 'breakfast': return buildMealFromPool(BREAKFAST, targets, seed, goal);
        case 'lunch':     return buildMealFromPool(LUNCH, targets, seed, goal);
        case 'dinner':    return buildMealFromPool(DINNER, targets, seed, goal);
        case 'snack':     return buildSnack(targets, seed, goal, splitType);
        default:          return buildMealFromPool(LUNCH, targets, seed, goal);
    }
}

/* ═══════════════════════════════════════════════════════════
   PUBLIC API
   ═══════════════════════════════════════════════════════════ */
export function generateWeeklyMealPlan(targetCalories, dailySplits, goal = 'maintenance') {
    return dailySplits.map((split, dayIdx) => {
        const r = getMR(split.split);
        const dayP = (targetCalories * r.p) / 4, dayC = (targetCalories * r.c) / 4, dayF = (targetCalories * r.f) / 9;

        const meals = MEAL_SLOTS.map((slot, mealIdx) => {
            const t = { calories: targetCalories * slot.pct, protein: dayP * slot.pct, carbs: dayC * slot.pct, fats: dayF * slot.pct };
            const seed = dayIdx * 7919 + mealIdx * 6271 + 1009;
            const items = buildMeal(slot.gen, t, seed, goal, split.split);
            const totals = si(items);
            return { time: slot.time, type: slot.type, items, menu: items.map(i => `${i.scaledPortion} ${i.displayName}`).join(' + '),
                protein: Math.round(totals.protein), carbs: Math.round(totals.carbs), fats: Math.round(totals.fats), calories: Math.round(totals.calories),
                _seed: seed, _gen: slot.gen, _targets: t, _goal: goal, _splitType: split.split };
        });
        return { day: split.label, date: split.date, splitType: split.split, meals };
    });
}

export function rerollMeal(meal) {
    const ns = meal._seed + Math.floor(Math.random() * 5000) + 500;
    const items = buildMeal(meal._gen, meal._targets, ns, meal._goal || 'maintenance', meal._splitType || 'Moderate Carb');
    const totals = si(items);
    return { ...meal, items, menu: items.map(i => `${i.scaledPortion} ${i.displayName}`).join(' + '),
        protein: Math.round(totals.protein), carbs: Math.round(totals.carbs), fats: Math.round(totals.fats), calories: Math.round(totals.calories), _seed: ns };
}

export function rerollMealItem(meal, itemIndex) {
    if (meal._gen === 'snack') return rerollMeal(meal);

    let pool;
    if (meal._gen === 'breakfast') pool = BREAKFAST;
    else if (meal._gen === 'lunch') pool = LUNCH;
    else if (meal._gen === 'dinner') pool = DINNER;
    else return meal;
    
    const goal = meal._goal || 'maintenance';
    const ns = meal._seed + Math.floor(Math.random() * 5000) + itemIndex * 100;
    
    if (itemIndex === 0) {
        // Reroll Carb with Cascade Validation
        const currentProt = meal.items[1] ? meal.items[1].name : null;
        const currentSide = meal.items[2] ? meal.items[2].name : null;
        const allCarbs = fg(pool.carbs, goal);
        
        let availableNames = allCarbs.filter(cName => {
            const c = CC[cName];
            if (!c) return true;
            if (currentProt && c.proteins && !c.proteins.includes(currentProt)) return false;
            if (currentSide && c.sides && !c.sides.includes(currentSide)) return false;
            return true;
        });
        
        const currentItemName = meal.items[itemIndex].name;
        let filteredNames = availableNames.filter(n => n !== currentItemName);
        
        if (filteredNames.length === 0) {
            // No strict match found, fallback to any valid carb and cascade updates
            filteredNames = allCarbs.filter(n => n !== currentItemName);
        }
        
        const newCarbBase = pk(gf(filteredNames), ns);
        if (!newCarbBase) return meal;
        meal.items[0] = mi(newCarbBase, 1.0);
        
        // Cascade check Protein
        const validProts = fg(getPool(newCarbBase.name, pool, 'proteins'), goal);
        if (meal.items[1] && !validProts.includes(meal.items[1].name)) {
            const newProtBase = pk(gf(validProts), ns + 1);
            if (newProtBase) meal.items[1] = mi(newProtBase, 1.0);
        }
        
        // Cascade check Side
        const finalProtName = meal.items[1] ? meal.items[1].name : null;
        const validSides = getValidSides(newCarbBase.name, finalProtName, pool, goal);
        if (meal.items[2] && !validSides.includes(meal.items[2].name)) {
            const newSideBase = pk(gf(validSides), ns + 2);
            if (newSideBase) meal.items[2] = mi(newSideBase, 1.0);
        }

    } else if (itemIndex === 1) {
        // Reroll Protein with Cascade Validation
        const carbName = meal.items[0].name;
        let availableNames = fg(getPool(carbName, pool, 'proteins'), goal);
        
        const currentItemName = meal.items[itemIndex].name;
        const filteredNames = availableNames.filter(n => n !== currentItemName);
        const finalNames = filteredNames.length > 0 ? filteredNames : availableNames;
        
        const newProtBase = pk(gf(finalNames), ns);
        if (!newProtBase) return meal;
        meal.items[1] = mi(newProtBase, 1.0);
        
        // Cascade check Side
        const validSides = getValidSides(carbName, newProtBase.name, pool, goal);
        if (meal.items[2] && !validSides.includes(meal.items[2].name)) {
            const newSideBase = pk(gf(validSides), ns + 1);
            if (newSideBase) meal.items[2] = mi(newSideBase, 1.0);
        }

    } else if (itemIndex === 2) {
        // Reroll Side (Safest, requires no cascade)
        const carbName = meal.items[0].name;
        const protName = meal.items[1] ? meal.items[1].name : null;
        let availableNames = getValidSides(carbName, protName, pool, goal);
        
        const currentItemName = meal.items[itemIndex].name;
        const filteredNames = availableNames.filter(n => n !== currentItemName);
        const finalNames = filteredNames.length > 0 ? filteredNames : availableNames;
        
        const newSideBase = pk(gf(finalNames), ns);
        if (!newSideBase) return meal;
        meal.items[2] = mi(newSideBase, 1.0);
    }
    
    // Balance macros precisely against the meal's target macros (which inherently align with TDEE splits)
    const newItems = balanceMealMacros(meal.items, meal._targets);
    const totals = si(newItems);
    
    return { ...meal, items: newItems, menu: newItems.map(i => `${i.scaledPortion} ${i.displayName}`).join(' + '),
        protein: Math.round(totals.protein), carbs: Math.round(totals.carbs), fats: Math.round(totals.fats), calories: Math.round(totals.calories), _seed: ns };
}

const fs = require('fs');

const queries = [
    // Bolos
    { name: "Bolo Chocolate Belga", q: "chocolate-cake" },
    { name: "Bolo Red Velvet", q: "red-velvet-cake" },
    { name: "Bolo Festa Morango", q: "strawberry-cake" },
    { name: "Bolo Cenoura Trufado", q: "carrot-cake-chocolate" },
    { name: "Bolo Limão Siciliano", q: "lemon-cake" },
    
    // Chocolates
    { name: "Caixa Bombons Finos", q: "box-of-chocolates" },
    { name: "Barra Chocolate Artesanal", q: "chocolate-bar" },
    { name: "Trufas Sortidas", q: "chocolate-truffles" },
    { name: "Brigadeiro Gourmet", q: "brigadeiro" },
    { name: "Coração de Chocolate", q: "chocolate-heart" },

    // Donuts
    { name: "Donut Glaceado", q: "glazed-donut" },
    { name: "Donut Chocolate", q: "chocolate-donut" },
    { name: "Donut Morango Granulado", q: "strawberry-donut" },
    { name: "Caixa 6 Donuts", q: "donuts-box" },
    { name: "Donut Recheado Nutella", q: "stuffed-donut" },

    // Cookies
    { name: "Cookie Tradicional", q: "chocolate-chip-cookie" },
    { name: "Cookie Triplo Chocolate", q: "double-chocolate-cookie" },
    { name: "Cookie Red Velvet", q: "red-velvet-cookie" },
    { name: "Caixa 10 Cookies", q: "stack-of-cookies" },
    { name: "Cookie Recheado", q: "stuffed-cookie" },

    // Tortas
    { name: "Torta de Limão", q: "lemon-tart" },
    { name: "Torta Holandesa", q: "chocolate-pie" },
    { name: "Cheesecake Frutas Vermelhas", q: "berry-cheesecake" },
    { name: "Banoffee Pie", q: "banoffee-pie" },
    { name: "Torta de Maçã", q: "apple-pie" },

    // Macarons
    { name: "Caixa 5 Macarons", q: "macarons-box" },
    { name: "Torre de Macarons", q: "macaron-tower" },
    { name: "Macaron Pistache", q: "green-macaron" },
    { name: "Caixa 12 Macarons Sortidos", q: "assorted-macarons" },
    { name: "Macaron Framboesa", q: "pink-macaron" },

    // Sobremesas
    { name: "Pudim de Leite", q: "flan-dessert" },
    { name: "Mousse de Maracujá", q: "passion-fruit-mousse" },
    { name: "Taça da Felicidade", q: "dessert-glass" },
    { name: "Pavê Tradicional", q: "layered-dessert" },
    { name: "Brownie com Sorvete", q: "brownie-ice-cream" },

    // Kits Festa
    { name: "Kit Festa P", q: "party-food-table" },
    { name: "Kit Festa M", q: "birthday-party-table" },
    { name: "Kit Festa G", q: "event-catering-dessert" },
    { name: "Kit Degustação Noivas", q: "wedding-cake-tasting" },
    { name: "Kit Mesversário", q: "small-birthday-cake" }
];

async function run() {
    const results = {};
    for (const item of queries) {
        try {
            const r = await fetch(`https://unsplash.com/s/photos/${item.q}`);
            const t = await r.text();
            const matches = [...new Set(t.match(/https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9\-]+/g))];
            
            let url = null;
            if (matches && matches.length > 0) {
                // Remove some known non-photo matches or icons if any, usually first is fine
                url = matches[0] + '?auto=format&fit=crop&w=300&q=80';
            }
            results[item.name] = url;
            console.log(`Fetched ${item.name} -> ${url}`);
        } catch (e) {
            console.error(`Error for ${item.name}`, e);
        }
        // sleep a bit
        await new Promise(res => setTimeout(res, 500));
    }
    fs.writeFileSync('unsplash_urls.json', JSON.stringify(results, null, 2));
    console.log('Done.');
}

run();

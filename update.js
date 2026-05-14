const fs = require('fs');

const productsDB = [
    // Bolos
    { name: "Bolo Chocolate Belga", price: "120,00", rating: "4.9", category: "Bolos", image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=300&q=80" },
    { name: "Bolo Red Velvet", price: "110,00", rating: "4.8", category: "Bolos", image: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=300&q=80" },
    { name: "Bolo Festa Morango", price: "150,00", rating: "5.0", category: "Bolos", image: "https://images.unsplash.com/photo-1602663491496-73f07481dbea?auto=format&fit=crop&w=300&q=80" },
    { name: "Bolo Cenoura Trufado", price: "90,00", rating: "4.7", category: "Bolos", image: "https://images.unsplash.com/photo-1622419015886-5e773bf6006e?auto=format&fit=crop&w=300&q=80" },
    { name: "Bolo Limão Siciliano", price: "95,00", rating: "4.6", category: "Bolos", image: "https://images.unsplash.com/photo-1691242720281-9269de4d9f86?auto=format&fit=crop&w=300&q=80" },
    
    // Chocolates
    { name: "Caixa Bombons Finos", price: "80,00", rating: "4.9", category: "Chocolates", image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=300&q=80" },
    { name: "Barra Chocolate Artesanal", price: "35,00", rating: "4.8", category: "Chocolates", image: "https://images.unsplash.com/photo-1623660053975-cf75a8be0908?auto=format&fit=crop&w=300&q=80" },
    { name: "Trufas Sortidas", price: "45,00", rating: "4.7", category: "Chocolates", image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=300&q=80" },
    { name: "Brigadeiro Gourmet", price: "40,00", rating: "5.0", category: "Chocolates", image: "https://images.unsplash.com/photo-1702982852429-e0d0b27eb990?auto=format&fit=crop&w=300&q=80" },
    { name: "Coração de Chocolate", price: "65,00", rating: "4.9", category: "Chocolates", image: "https://images.unsplash.com/photo-1582176604856-e824b4736522?auto=format&fit=crop&w=300&q=80" },

    // Donuts
    { name: "Donut Glaceado", price: "12,00", rating: "4.5", category: "Donuts", image: "https://images.unsplash.com/photo-1527904324834-3bda86da6771?auto=format&fit=crop&w=300&q=80" },
    { name: "Donut Chocolate", price: "15,00", rating: "4.8", category: "Donuts", image: "https://images.unsplash.com/photo-1551106652-a5bcf4b29ab6?auto=format&fit=crop&w=300&q=80" },
    { name: "Donut Morango Granulado", price: "15,00", rating: "4.6", category: "Donuts", image: "https://images.unsplash.com/photo-1533910534207-90f31029a78e?auto=format&fit=crop&w=300&q=80" },
    { name: "Caixa 6 Donuts", price: "60,00", rating: "4.9", category: "Donuts", image: "https://images.unsplash.com/photo-1618411640018-972400a01458?auto=format&fit=crop&w=300&q=80" },
    { name: "Donut Recheado Nutella", price: "18,00", rating: "5.0", category: "Donuts", image: "https://images.unsplash.com/photo-1631143070457-c1aecc92abbc?auto=format&fit=crop&w=300&q=80" },

    // Cookies
    { name: "Cookie Tradicional", price: "10,00", rating: "4.7", category: "Cookies", image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=300&q=80" },
    { name: "Cookie Triplo Chocolate", price: "14,00", rating: "4.9", category: "Cookies", image: "https://images.unsplash.com/photo-1600147566401-c2056eb69479?auto=format&fit=crop&w=300&q=80" },
    { name: "Cookie Red Velvet", price: "15,00", rating: "4.8", category: "Cookies", image: "https://images.unsplash.com/photo-1714386148315-2f0e3eebcd5a?auto=format&fit=crop&w=300&q=80" },
    { name: "Caixa 10 Cookies", price: "85,00", rating: "5.0", category: "Cookies", image: "https://images.unsplash.com/photo-1557310717-d6bea9f36682?auto=format&fit=crop&w=300&q=80" },
    { name: "Cookie Recheado", price: "16,00", rating: "4.9", category: "Cookies", image: "https://images.unsplash.com/photo-1609501886186-d4de01248beb?auto=format&fit=crop&w=300&q=80" },

    // Tortas
    { name: "Torta de Limão", price: "80,00", rating: "4.8", category: "Tortas", image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=300&q=80" },
    { name: "Torta Holandesa", price: "95,00", rating: "4.9", category: "Tortas", image: "https://images.unsplash.com/photo-1546898976-9850b9bba1e3?auto=format&fit=crop&w=300&q=80" },
    { name: "Cheesecake Frutas Vermelhas", price: "110,00", rating: "5.0", category: "Tortas", image: "https://images.unsplash.com/photo-1676300185983-d5f242babe34?auto=format&fit=crop&w=300&q=80" },
    { name: "Banoffee Pie", price: "90,00", rating: "4.8", category: "Tortas", image: "https://images.unsplash.com/photo-1546898976-9850b9bba1e3?auto=format&fit=crop&w=300&q=80" },
    { name: "Torta de Maçã", price: "85,00", rating: "4.7", category: "Tortas", image: "https://images.unsplash.com/photo-1621743478914-cc8a86d7e7b5?auto=format&fit=crop&w=300&q=80" },

    // Macarons
    { name: "Caixa 5 Macarons", price: "35,00", rating: "4.7", category: "Macarons", image: "https://images.unsplash.com/photo-1570476922354-81227cdbb76c?auto=format&fit=crop&w=300&q=80" },
    { name: "Torre de Macarons", price: "150,00", rating: "5.0", category: "Macarons", image: "https://images.unsplash.com/photo-1746095818283-f9c71fdcf5bc?auto=format&fit=crop&w=300&q=80" },
    { name: "Macaron Pistache", price: "8,00", rating: "4.9", category: "Macarons", image: "https://images.unsplash.com/photo-1741887275771-607caf65d19a?auto=format&fit=crop&w=300&q=80" },
    { name: "Caixa 12 Macarons Sortidos", price: "75,00", rating: "4.8", category: "Macarons", image: "https://images.unsplash.com/photo-1558326567-98ae2405596b?auto=format&fit=crop&w=300&q=80" },
    { name: "Macaron Framboesa", price: "8,00", rating: "4.8", category: "Macarons", image: "https://images.unsplash.com/photo-1612198790700-0ff08cb726e5?auto=format&fit=crop&w=300&q=80" },

    // Sobremesas
    { name: "Pudim de Leite", price: "40,00", rating: "4.9", category: "Sobremesas", image: "https://images.unsplash.com/photo-1702728109878-c61a98d80491?auto=format&fit=crop&w=300&q=80" },
    { name: "Mousse de Maracujá", price: "15,00", rating: "4.7", category: "Sobremesas", image: "https://images.unsplash.com/photo-1616077498072-ccba9b178fa5?auto=format&fit=crop&w=300&q=80" },
    { name: "Taça da Felicidade", price: "50,00", rating: "5.0", category: "Sobremesas", image: "https://images.unsplash.com/photo-1567691334394-c0d00a7716db?auto=format&fit=crop&w=300&q=80" },
    { name: "Pavê Tradicional", price: "60,00", rating: "4.8", category: "Sobremesas", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=300&q=80" },
    { name: "Brownie com Sorvete", price: "25,00", rating: "4.9", category: "Sobremesas", image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=300&q=80" },

    // Kits Festa
    { name: "Kit Festa P", price: "150,00", rating: "4.8", category: "Kits Festa", image: "https://images.unsplash.com/photo-1463183547458-6a2c760d0912?auto=format&fit=crop&w=300&q=80" },
    { name: "Kit Festa M", price: "280,00", rating: "4.9", category: "Kits Festa", image: "https://images.unsplash.com/photo-1630845253081-563d2be188ec?auto=format&fit=crop&w=300&q=80" },
    { name: "Kit Festa G", price: "450,00", rating: "5.0", category: "Kits Festa", image: "https://images.unsplash.com/photo-1567691334394-c0d00a7716db?auto=format&fit=crop&w=300&q=80" },
    { name: "Kit Degustação Noivas", price: "80,00", rating: "4.9", category: "Kits Festa", image: "https://images.unsplash.com/photo-1655762755958-cc0e10095c24?auto=format&fit=crop&w=300&q=80" },
    { name: "Kit Mesversário", price: "120,00", rating: "4.8", category: "Kits Festa", image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?auto=format&fit=crop&w=300&q=80" }
];

let code = fs.readFileSync('script.js', 'utf8');
code = code.replace(/const productsDB = \[[\s\S]*?\];/, 'const productsDB = ' + JSON.stringify(productsDB, null, 4).replace(/"name": /g, 'name: ').replace(/"price": /g, 'price: ').replace(/"rating": /g, 'rating: ').replace(/"category": /g, 'category: ').replace(/"image": /g, 'image: ') + ';');
fs.writeFileSync('script.js', code);

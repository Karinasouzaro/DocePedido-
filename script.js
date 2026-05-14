// Variáveis globais de estado
let currentUserRole = null; // 'client' | 'baker'
let cartCount = 0;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Aplicar tema salvo
    const savedTheme = localStorage.getItem('docepedido_theme') || 'dark'; // Iniciando no dark mode by default para ver o efeito premium
    setTheme(savedTheme);

    // 2. Event Listeners para Navbars
    setupNavbarListeners('.bottom-nav#nav-client .nav-item', 'client');
    setupNavbarListeners('.bottom-nav#nav-baker .nav-item', 'baker');

    // 3. Event Listeners para Filtros (Pills e Categorias)
    setupPills('.pill');
    setupPills('.category-item');

    // Inicializar catálogos dinâmicos
    renderCatalog('Todos', 'client');
    renderCatalog('Todos', 'baker');
});

// === FLUXO DE LOGIN ===

function loginAsClient() {
    currentUserRole = 'client';
    document.getElementById('profile-role-text').textContent = 'Cliente';
    
    // Esconde Login
    document.getElementById('login-screen').classList.remove('active');
    
    // Mostra Nav de Cliente
    document.getElementById('nav-client').style.display = 'flex';
    document.getElementById('nav-baker').style.display = 'none';
    
    // Mostra Tela Inicial de Cliente
    switchTab('inicio', 'client');
}

function loginAsBaker() {
    currentUserRole = 'baker';
    document.getElementById('profile-role-text').textContent = 'Confeiteira';
    
    // Esconde Login
    document.getElementById('login-screen').classList.remove('active');
    
    // Mostra Nav de Confeiteira
    document.getElementById('nav-client').style.display = 'none';
    document.getElementById('nav-baker').style.display = 'flex';
    
    // Mostra Dashboard
    switchTab('baker-dashboard', 'baker');
}

function logout() {
    currentUserRole = null;
    
    // Esconde todas as telas
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.classList.remove('active'));
    
    // Esconde Navbars
    document.getElementById('nav-client').style.display = 'none';
    document.getElementById('nav-baker').style.display = 'none';
    
    // Mostra tela de login
    document.getElementById('login-screen').classList.add('active');
}

// === NAVEGAÇÃO INTERNA ===

function setupNavbarListeners(selector, role) {
    const navItems = document.querySelectorAll(selector);
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-target');
            switchTab(targetId, role);
        });
    });
}

function switchTab(targetId, role) {
    // Apenas telas principais, não esconde o detalhes do produto se estiver navegando normal
    const screens = document.querySelectorAll('.screen:not(.details-screen):not(#login-screen)');
    
    screens.forEach(screen => screen.classList.remove('active'));
    
    const targetScreen = document.getElementById(targetId);
    if (targetScreen) targetScreen.classList.add('active');

    // Atualiza a Nav ativa
    const navId = role === 'client' ? 'nav-client' : 'nav-baker';
    const navItems = document.querySelectorAll(`#${navId} .nav-item`);
    
    navItems.forEach(nav => {
        if(nav.getAttribute('data-target') === targetId) {
            nav.classList.add('active');
        } else {
            nav.classList.remove('active');
        }
    });
}

// UI Helpers: Toggle classe ativa em botoes pequenos (Pills / Categorias)
function setupPills(selector) {
    const items = document.querySelectorAll(selector);
    items.forEach(item => {
        item.addEventListener('click', (e) => {
            // Acha os irmaos
            const siblings = e.currentTarget.parentElement.querySelectorAll(selector);
            siblings.forEach(s => s.classList.remove('active'));
            e.currentTarget.classList.add('active');

            // Se for filtro do catálogo, atualizar a lista
            const category = e.currentTarget.getAttribute('data-category');
            if (category) {
                // Descobrir se é pill da confeiteira ou do cliente
                const isBakerPill = e.currentTarget.closest('#baker-catalog-pills');
                if (isBakerPill) {
                    renderCatalog(category, 'baker');
                } else {
                    renderCatalog(category, 'client');
                }
            }
        });
    });
}

// === PRODUTO E CARRINHO ===

function openProduct(productJson) {
    const product = JSON.parse(decodeURIComponent(productJson));
    
    document.getElementById('detail-img').src = product.image;
    document.getElementById('detail-title').textContent = product.name;
    document.getElementById('detail-price').textContent = `R$ ${product.price}`;
    document.getElementById('detail-rating').textContent = product.rating;
    document.getElementById('detail-description').textContent = product.description;
    
    document.getElementById('produto').classList.add('active');
}

function closeProduct() {
    document.getElementById('produto').classList.remove('active');
}

function toggleFav(event, btn) {
    event.stopPropagation();
    const icon = btn.querySelector('i');
    
    if (icon.classList.contains('ph-heart')) {
        icon.classList.replace('ph-heart', 'ph-fill');
        icon.classList.add('ph-heart'); // Mantem ref pro css caso precise
        btn.classList.add('active');
        
        // Micro-interacao de pulsar
        btn.style.transform = 'scale(1.2)';
        setTimeout(() => btn.style.transform = 'scale(1)', 150);
    } else {
        icon.classList.replace('ph-fill', 'ph-heart');
        btn.classList.remove('active');
    }
}

function addToCart(event) {
    event.stopPropagation();
    processCartAddition();
}

function addToCartAnimation() {
    processCartAddition();
    setTimeout(() => {
        closeProduct();
    }, 600);
}

function processCartAddition() {
    showToast();
    cartCount++;
    const badge = document.getElementById('cart-badge');
    if (badge) {
        badge.style.display = 'flex';
        badge.textContent = cartCount;
        // Anima o badge
        badge.style.transform = 'scale(1.3)';
        setTimeout(() => badge.style.transform = 'scale(1)', 200);
    }
}

function showToast() {
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// === TEMAS (DARK/LIGHT) ===

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('docepedido_theme', theme);
    
    const btnLight = document.getElementById('btn-theme-light');
    const btnDark = document.getElementById('btn-theme-dark');
    
    if(btnLight && btnDark) {
        if(theme === 'dark') {
            btnDark.classList.add('active');
            btnLight.classList.remove('active');
        } else {
            btnLight.classList.add('active');
            btnDark.classList.remove('active');
        }
    }
}

// === CATÁLOGO DINÂMICO ===
const productsDB = [
    // Bolos
    {
        name: "Bolo Chocolate Belga",
        price: "120,00",
        rating: "4.9",
        category: "Bolos",
        image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=300&q=80",
        description: "Delicioso bolo de chocolate amargo belga com camadas de ganache cremosa e cobertura aveludada."
    },
    {
        name: "Bolo Red Velvet",
        price: "110,00",
        rating: "4.8",
        category: "Bolos",
        image: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=300&q=80",
        description: "O clássico americano com massa levemente achocolatada de cor vibrante, recheado com creme de cream cheese."
    },
    {
        name: "Bolo Festa Morango",
        price: "150,00",
        rating: "5.0",
        category: "Bolos",
        image: "https://images.unsplash.com/photo-1602663491496-73f07481dbea?auto=format&fit=crop&w=300&q=80",
        description: "Massa pão de ló super fofinha, recheada com pedaços generosos de morango fresco e chantilly artesanal."
    },
    {
        name: "Bolo Cenoura Trufado",
        price: "90,00",
        rating: "4.7",
        category: "Bolos",
        image: "https://images.unsplash.com/photo-1622419015886-5e773bf6006e?auto=format&fit=crop&w=300&q=80",
        description: "Massa úmida de cenoura com cobertura espessa de chocolate meio amargo trufado."
    },
    {
        name: "Bolo Limão Siciliano",
        price: "95,00",
        rating: "4.6",
        category: "Bolos",
        image: "https://images.unsplash.com/photo-1691242720281-9269de4d9f86?auto=format&fit=crop&w=300&q=80",
        description: "Bolo cítrico e refrescante com raspas de limão siciliano e calda de açúcar cristalizada."
    },
    {
        name: "Caixa Bombons Finos",
        price: "80,00",
        rating: "4.9",
        category: "Chocolates",
        image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=300&q=80",
        description: "Seleção premium de bombons artesanais com recheios variados: caramelo salgado, avelã e ganache de café."
    },
    {
        name: "Barra Chocolate Artesanal",
        price: "35,00",
        rating: "4.8",
        category: "Chocolates",
        image: "https://images.unsplash.com/photo-1623660053975-cf75a8be0908?auto=format&fit=crop&w=300&q=80",
        description: "Barra de chocolate 70% cacau produzida com amêndoas selecionadas e um toque de flor de sal."
    },
    {
        name: "Trufas Sortidas",
        price: "45,00",
        rating: "4.7",
        category: "Chocolates",
        image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=300&q=80",
        description: "Trufas de chocolate nobre que derretem na boca, nos sabores clássico, maracujá e licor."
    },
    {
        name: "Brigadeiro Gourmet",
        price: "40,00",
        rating: "5.0",
        category: "Chocolates",
        image: "https://images.unsplash.com/photo-1702982852429-e0d0b27eb990?auto=format&fit=crop&w=300&q=80",
        description: "O favorito brasileiro feito com chocolate belga, manteiga de primeira linha e granulado gourmet."
    },
    {
        name: "Coração de Chocolate",
        price: "65,00",
        rating: "4.9",
        category: "Chocolates",
        image: "https://images.unsplash.com/photo-1582176604856-e824b4736522?auto=format&fit=crop&w=300&q=80",
        description: "Coração lapidado de chocolate ao leite recheado com bombons sortidos. O presente perfeito."
    },
    {
        name: "Donut Glaceado",
        price: "12,00",
        rating: "4.5",
        category: "Donuts",
        image: "https://images.unsplash.com/photo-1527904324834-3bda86da6771?auto=format&fit=crop&w=300&q=80",
        description: "Massa leve e fofinha com cobertura clássica de açúcar que derrete na boca."
    },
    {
        name: "Donut Chocolate",
        price: "15,00",
        rating: "4.8",
        category: "Donuts",
        image: "https://images.unsplash.com/photo-1551106652-a5bcf4b29ab6?auto=format&fit=crop&w=300&q=80",
        description: "Donut coberto com ganache de chocolate ao leite e finalizado com granulado colorido."
    },
    {
        name: "Donut Morango Granulado",
        price: "15,00",
        rating: "4.6",
        category: "Donuts",
        image: "https://images.unsplash.com/photo-1533910534207-90f31029a78e?auto=format&fit=crop&w=300&q=80",
        description: "Donut com cobertura de morango silvestre e granulado crocante."
    },
    {
        name: "Caixa 6 Donuts",
        price: "60,00",
        rating: "4.9",
        category: "Donuts",
        image: "https://images.unsplash.com/photo-1618411640018-972400a01458?auto=format&fit=crop&w=300&q=80",
        description: "Mix com nossos 6 donuts mais vendidos para compartilhar com quem você ama."
    },
    {
        name: "Donut Recheado Nutella",
        price: "18,00",
        rating: "5.0",
        category: "Donuts",
        image: "https://images.unsplash.com/photo-1631143070457-c1aecc92abbc?auto=format&fit=crop&w=300&q=80",
        description: "Donut generosamente recheado com Nutella original e polvilhado com açúcar de confeiteiro."
    },
    {
        name: "Cookie Tradicional",
        price: "10,00",
        rating: "4.7",
        category: "Cookies",
        image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=300&q=80",
        description: "Cookie crocante por fora e macio por dentro, com gotas generosas de chocolate ao leite."
    },
    {
        name: "Cookie Triplo Chocolate",
        price: "14,00",
        rating: "4.9",
        category: "Cookies",
        image: "https://images.unsplash.com/photo-1600147566401-c2056eb69479?auto=format&fit=crop&w=300&q=80",
        description: "Massa de chocolate com gotas de chocolate branco, ao leite e meio amargo."
    },
    {
        name: "Cookie Red Velvet",
        price: "15,00",
        rating: "4.8",
        category: "Cookies",
        image: "https://images.unsplash.com/photo-1714386148315-2f0e3eebcd5a?auto=format&fit=crop&w=300&q=80",
        description: "Massa Red Velvet com gotas de chocolate branco, inspirado no clássico bolo."
    },
    {
        name: "Caixa 10 Cookies",
        price: "85,00",
        rating: "5.0",
        category: "Cookies",
        image: "https://images.unsplash.com/photo-1557310717-d6bea9f36682?auto=format&fit=crop&w=300&q=80",
        description: "Nossa famosa lata com 10 unidades de cookies variados, perfeitos para o lanche."
    },
    {
        name: "Cookie Recheado",
        price: "16,00",
        rating: "4.9",
        category: "Cookies",
        image: "https://images.unsplash.com/photo-1609501886186-d4de01248beb?auto=format&fit=crop&w=300&q=80",
        description: "Cookie de baunilha com recheio cremoso de doce de leite artesanal."
    },
    {
        name: "Torta de Limão",
        price: "80,00",
        rating: "4.8",
        category: "Tortas",
        image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=300&q=80",
        description: "Massa sucrée crocante com recheio cremoso de limão taiti e merengue suíço maçaricado."
    },
    {
        name: "Torta Holandesa",
        price: "95,00",
        rating: "4.9",
        category: "Tortas",
        image: "https://images.unsplash.com/photo-1546898976-9850b9bba1e3?auto=format&fit=crop&w=300&q=80",
        description: "Base de biscoito, creme leve de baunilha e cobertura de ganache de chocolate meio amargo."
    },
    {
        name: "Cheesecake Frutas Vermelhas",
        price: "110,00",
        rating: "5.0",
        category: "Tortas",
        image: "https://images.unsplash.com/photo-1676300185983-d5f242babe34?auto=format&fit=crop&w=300&q=80",
        description: "Cheesecake assada lentamente com calda artesanal de morango, framboesa e amora."
    },
    {
        name: "Banoffee Pie",
        price: "90,00",
        rating: "4.8",
        category: "Tortas",
        image: "https://images.unsplash.com/photo-1546898976-9850b9bba1e3?auto=format&fit=crop&w=300&q=80",
        description: "Combinação perfeita de banana, doce de leite caseiro e chantilly com toque de canela."
    },
    {
        name: "Torta de Maçã",
        price: "85,00",
        rating: "4.7",
        category: "Tortas",
        image: "https://images.unsplash.com/photo-1621743478914-cc8a86d7e7b5?auto=format&fit=crop&w=300&q=80",
        description: "Torta clássica com maçãs caramelizadas e massa folhada amanteigada."
    },
    {
        name: "Caixa 5 Macarons",
        price: "35,00",
        rating: "4.7",
        category: "Macarons",
        image: "https://images.unsplash.com/photo-1570476922354-81227cdbb76c?auto=format&fit=crop&w=300&q=80",
        description: "Delicados biscoitos franceses de amêndoas com recheios gourmet selecionados."
    },
    {
        name: "Torre de Macarons",
        price: "150,00",
        rating: "5.0",
        category: "Macarons",
        image: "https://images.unsplash.com/photo-1746095818283-f9c71fdcf5bc?auto=format&fit=crop&w=300&q=80",
        description: "Linda torre decorativa com 20 macarons em degradê de cores e sabores."
    },
    {
        name: "Macaron Pistache",
        price: "8,00",
        rating: "4.9",
        category: "Macarons",
        image: "https://images.unsplash.com/photo-1741887275771-607caf65d19a?auto=format&fit=crop&w=300&q=80",
        description: "Macaron verde suave recheado com creme intenso de pistache iraniano."
    },
    {
        name: "Caixa 12 Macarons Sortidos",
        price: "75,00",
        rating: "4.8",
        category: "Macarons",
        image: "https://images.unsplash.com/photo-1558326567-98ae2405596b?auto=format&fit=crop&w=300&q=80",
        description: "Presente sofisticado com uma explosão de cores e sabores franceses."
    },
    {
        name: "Macaron Framboesa",
        price: "8,00",
        rating: "4.8",
        category: "Macarons",
        image: "https://images.unsplash.com/photo-1612198790700-0ff08cb726e5?auto=format&fit=crop&w=300&q=80",
        description: "Macaron rosa vibrante com recheio azedinho de geleia de framboesa natural."
    },
    {
        name: "Pudim de Leite",
        price: "40,00",
        rating: "4.9",
        category: "Sobremesas",
        image: "https://images.unsplash.com/photo-1702728109878-c61a98d80491?auto=format&fit=crop&w=300&q=80",
        description: "O clássico pudim de leite condensado, lisinho e com calda de caramelo dourada."
    },
    {
        name: "Mousse de Maracujá",
        price: "15,00",
        rating: "4.7",
        category: "Sobremesas",
        image: "https://images.unsplash.com/photo-1616077498072-ccba9b178fa5?auto=format&fit=crop&w=300&q=80",
        description: "Mousse leve e aerada feita com a fruta fresca e sementes crocantes."
    },
    {
        name: "Taça da Felicidade",
        price: "50,00",
        rating: "5.0",
        category: "Sobremesas",
        image: "https://images.unsplash.com/photo-1567691334394-c0d00a7716db?auto=format&fit=crop&w=300&q=80",
        description: "Montada em camadas com creme de cupuaçu, chocolate e pedaços de biscoito."
    },
    {
        name: "Pavê Tradicional",
        price: "60,00",
        rating: "4.8",
        category: "Sobremesas",
        image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=300&q=80",
        description: "Camadas de biscoito champanhe embebidas em calda, creme de baunilha e chocolate."
    },
    {
        name: "Brownie com Sorvete",
        price: "25,00",
        rating: "4.9",
        category: "Sobremesas",
        image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=300&q=80",
        description: "Brownie morno de chocolate com nozes, acompanhado de uma bola de sorvete de baunilha."
    },
    {
        name: "Kit Festa P",
        price: "150,00",
        rating: "4.8",
        category: "Kits Festa",
        image: "https://images.unsplash.com/photo-1463183547458-6a2c760d0912?auto=format&fit=crop&w=300&q=80",
        description: "Ideal para 5 pessoas: Bolo de 1kg, 25 salgadinhos e 15 docinhos tradicionais."
    },
    {
        name: "Kit Festa M",
        price: "280,00",
        rating: "4.9",
        category: "Kits Festa",
        image: "https://images.unsplash.com/photo-1630845253081-563d2be188ec?auto=format&fit=crop&w=300&q=80",
        description: "Para até 10 pessoas: Bolo de 2kg, 50 salgadinhos e 30 docinhos variados."
    },
    {
        name: "Kit Festa G",
        price: "450,00",
        rating: "5.0",
        category: "Kits Festa",
        image: "https://images.unsplash.com/photo-1567691334394-c0d00a7716db?auto=format&fit=crop&w=300&q=80",
        description: "Festa completa para 20 pessoas: Bolo de 3kg, 100 salgadinhos e 60 docinhos."
    },
    {
        name: "Kit Degustação Noivas",
        price: "80,00",
        rating: "4.9",
        category: "Kits Festa",
        image: "https://images.unsplash.com/photo-1655762755958-cc0e10095c24?auto=format&fit=crop&w=300&q=80",
        description: "Seleção de nossos melhores bolos e doces finos para escolha do cardápio do seu casamento."
    },
    {
        name: "Kit Mesversário",
        price: "120,00",
        rating: "4.8",
        category: "Kits Festa",
        image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?auto=format&fit=crop&w=300&q=80",
        description: "Bolo pequeno decorado e 10 docinhos temáticos para celebrar cada mês do seu bebê."
    }
];

function renderCatalog(category, role) {
    const gridId = role === 'client' ? 'client-catalog-grid' : 'baker-catalog-grid';
    const grid = document.getElementById(gridId);
    
    if (!grid) return;
    
    grid.innerHTML = ''; // Limpa os cards atuais

    // Filtra os produtos
    const filteredProducts = category === 'Todos' 
        ? productsDB 
        : productsDB.filter(p => p.category === category);

    // Renderiza cada produto
    filteredProducts.forEach(product => {
        const actionButton = role === 'client' 
            ? `<button class="add-btn hover-scale" onclick="addToCart(event)"><i class="ph ph-plus"></i></button>`
            : `<button class="add-btn hover-scale" style="background: var(--surface); color: var(--text-primary); border: 1px solid var(--border);" onclick="event.stopPropagation()"><i class="ph ph-pencil-simple"></i></button>`;
        
        const favButton = role === 'client'
            ? `<button class="fav-btn" onclick="toggleFav(event, this)"><i class="ph ph-heart"></i></button>`
            : `<button class="fav-btn" style="background: rgba(0,0,0,0.5);"><i class="ph ph-eye-slash"></i></button>`;

        // Codifica o objeto do produto para passar como string no onclick
        const productData = encodeURIComponent(JSON.stringify(product));

        const html = `
            <div class="product-card hover-scale-card">
                <div class="product-img" onclick="openProduct('${productData}')">
                    <img src="${product.image}" alt="${product.name}">
                    ${favButton}
                </div>
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <div class="product-rating"><i class="ph-fill ph-star"></i> ${product.rating}</div>
                    <div class="product-price-row">
                        <span class="price">R$ ${product.price}</span>
                        ${actionButton}
                    </div>
                </div>
            </div>
        `;
        grid.insertAdjacentHTML('beforeend', html);
    });
}
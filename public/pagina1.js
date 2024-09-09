$(document).ready(function () {
    let allProducts = []; // Variável global para armazenar os produtos

    $('.menu-toggle').on('click', function () {
        $('.nav ul').toggleClass('active');
    });

    // Carregar produtos da API
    function loadProducts() {
        $.ajax({
            url: '/api/products', // Rota da API para obter os produtos
            method: 'GET',
            success: function (products) {
                console.log(products); // Debug: Exibir produtos no console

                allProducts = products; // Armazenar produtos na variável global
                renderProducts('all', products);
            },
            error: function (error) {
                console.error('Erro ao carregar os produtos:', error);
            }
        });
    }

    // Renderizar produtos na página
    function renderProducts(filter, products) {
        const container = $('#productContainer');
        container.empty();
        const filteredProducts = products.filter(product => filter === 'all' || product.Categoria === filter);
        
        if (filteredProducts.length === 0) {
            container.append('<p>Produto não encontrado</p>');
        } else {
            filteredProducts.forEach(product => {
                const productCard = `
                    <div class="product-card">
                        <img src="default.jpg" alt="${product.Produto}">
                        <h3>${product.Produto}</h3>
                        <p>${product.Categoria}</p>
                        <button class="add-to-cart" data-id="${product.Produto}" data-category="${product.Categoria}">Adicionar ao Carrinho</button>
                    </div>
                `;
                container.append(productCard);
            });
        }
    }

    // Carregar os produtos ao carregar a página
    loadProducts();

    // Filtrar produtos por categoria
    $('.filter-item').on('click', function () {
        const filter = $(this).data('filter');
        renderProducts(filter, allProducts); // Usar a lista global de produtos
        $('.filter-item').removeClass('active');
        $(this).addClass('active');
    });

    // Pesquisar produtos por nome
    $('#searchForm').on('submit', function (e) {
        e.preventDefault();
        const searchTerm = $('#searchInput').val().toLowerCase();
        const filteredProducts = allProducts.filter(product => product.Produto.toLowerCase().includes(searchTerm));
        renderProducts('all', filteredProducts);
    });

    // Adicionar produto ao carrinho
    $(document).on('click', '.add-to-cart', function () {
        const id = $(this).data('id');
        const product = allProducts.find(p => p.Produto === id);

        // Fazer a requisição para a API de adicionar ao carrinho
        $.ajax({
            url: '/api/cart', // Rota da API para adicionar ao carrinho
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                produto: product.Produto,
                categoria: product.Categoria,
                quantidade: 1
            }),
            success: function (response) {
                if (response.message) {
                    console.log('Produto adicionado ao carrinho:', { Produto: product.Produto, Categoria: product.Categoria, quantidade: 1 });
                    showPopup('Adicionado ao carrinho');
                } else {
                    alert('Erro ao adicionar o produto ao carrinho.');
                }
            },
            error: function (error) {
                console.error('Erro ao adicionar o produto ao carrinho:', error);
            }
        });
    });

    // Função para exibir popup de confirmação
    function showPopup(message) {
        const popup = $('<div class="popup"></div>').text(message);
        $('body').append(popup);
        popup.fadeIn(400).delay(1500).fadeOut(400, function() {
            $(this).remove();
        });
    }
});

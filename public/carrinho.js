$(document).ready(function () {
    renderCart();

    // Função para renderizar o carrinho
    function renderCart() {
        // Fazendo requisição para buscar os produtos no carrinho a partir da API
        $.ajax({
            url: `/api/cart`, // Rota da API para obter o carrinho
            method: 'GET',
            success: function (cart) {
                console.log('Carrinho renderizado:', cart);
                const cartContainer = $('#cartItems');
                cartContainer.empty();

                if (cart.length === 0) {
                    cartContainer.append('<p>Seu carrinho está vazio.</p>');
                    return;
                }

                // Renderizar os itens do carrinho
                cart.forEach(product => {
                    const cartItem = `
                        <div class="cart-item">
                            <h3>${product.produto}</h3>
                            <p>${product.categoria}</p>
                            <div class="quantity-wrapper">
                                <p>Quantidade: <input type="number" class="quantity" data-id="${product.id}" value="${product.quantidade}" min="1" max="3"></p>
                            </div>
                            <button class="remove-from-cart" data-id="${product.id}">Remover</button>
                        </div>
                    `;
                    cartContainer.append(cartItem);
                });

                // Atualizar quantidade
                $('.quantity').on('change', function () {
                    const id = $(this).data('id');
                    let newQuantity = parseInt($(this).val());

                    if (newQuantity > 3) {
                        alert('Você não pode adicionar mais de 3 unidades deste produto.');
                        newQuantity = 3;
                        $(this).val(3);
                    } else if (newQuantity < 1) {
                        newQuantity = 1;
                        $(this).val(1);
                    }

                    updateCartItemQuantity(id, newQuantity);
                });

                // Remover item do carrinho
                $('.remove-from-cart').on('click', function () {
                    const id = $(this).data('id');
                    removeCartItem(id);
                });
            },
            error: function (error) {
                console.error('Erro ao carregar o carrinho:', error);
            }
        });
    }

    // Função para atualizar a quantidade do item no carrinho
    function updateCartItemQuantity(id, quantity) {
        $.ajax({
            url: '/api/cart/update-quantity', // Rota da API para atualizar a quantidade
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ id, quantity }),
            success: function () {
                renderCart(); // Recarregar o carrinho após a atualização
            },
            error: function (error) {
                console.error('Erro ao atualizar a quantidade do item:', error);
            }
        });
    }

    // Função para remover item do carrinho
    function removeCartItem(id) {
        $.ajax({
            url: '/api/cart/remove-item', // Rota da API para remover item
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ id }),
            success: function () {
                renderCart(); // Recarregar o carrinho após a remoção
            },
            error: function (error) {
                console.error('Erro ao remover o item do carrinho:', error);
            }
        });
    }

    // Função para confirmar o pedido
    $('#confirmOrderBtn').on('click', function () {
        $.ajax({
            url: '/api/cart/confirm', // Rota da API para confirmar o pedido
            method: 'POST',
            contentType: 'application/json',
            success: function () {
                alert('Pedido confirmado! Será enviado para sua conta.');
                renderCart(); // Recarregar o carrinho após a confirmação do pedido
            },
            error: function (error) {
                console.error('Erro ao confirmar o pedido:', error);
            }
        });
    });
});

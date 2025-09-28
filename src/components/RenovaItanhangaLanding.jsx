import React, { useState, useEffect, useRef } from 'react';
import { Instagram, Facebook, ShoppingCart, Clock, Star, Shield, Truck, CreditCard, Menu, X, Plus, Minus, Trash2, MessageCircle, ChevronUp, ChevronDown } from 'lucide-react';

// Componente CartModal
const CartModal = ({ setShowCart, cartItems, updateQuantity, removeFromCart, getCartItemCount, getCartTotal, sendWhatsAppOrder, cartScrollRef, clientName, setClientName, deliveryMethod, setDeliveryMethod, paymentMethod, setPaymentMethod }) => {
  const [isCheckoutExpanded, setIsCheckoutExpanded] = useState(false);

  // Verificação para evitar erro de renderização
  if (!cartItems) {
    console.error('Erro: cartItems não está definido');
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] flex flex-col">
        {/* Header fixo do carrinho */}
        <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Carrinho ({getCartItemCount ? getCartItemCount() : 0} {getCartItemCount && getCartItemCount() === 1 ? 'item' : 'itens'})
          </h2>
          <button onClick={() => setShowCart(false)} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 sm:w-6 h-5 sm:h-6" />
          </button>
        </div>

        {/* Área de scroll do carrinho */}
        <div 
          ref={cartScrollRef} 
          className="flex-1 overflow-y-auto p-4 sm:p-6"
          style={{ scrollBehavior: 'auto' }}
        >
          {cartItems.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <ShoppingCart className="w-12 sm:w-16 h-12 sm:h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-base sm:text-lg">Seu carrinho está vazio</p>
              <button
                onClick={() => setShowCart(false)}
                className="mt-4 bg-green-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-green-700 text-sm sm:text-base"
              >
                Continuar Comprando
              </button>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {cartItems.map(item => (
                <div key={`cart-item-${item.id}`} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                  <div className="relative flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-12 sm:w-14 h-12 sm:h-14 object-cover rounded-lg" />
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                      -{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{item.name}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                      <p className="text-green-600 font-bold text-sm sm:text-base">R$ {item.price.toFixed(2)}</p>
                      <p className="text-gray-500 line-through text-xs sm:text-sm">R$ {item.originalPrice.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 py-1 bg-white border rounded text-center min-w-[2rem] sm:min-w-[2.5rem] text-sm">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-gray-900 text-sm sm:text-base">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button 
                      onClick={() => removeFromCart(item.id)} 
                      className="text-red-600 hover:text-red-800 mt-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer fixo com total, inputs e botão de finalizar */}
        {cartItems.length > 0 && (
          <div className="border-t pt-4 sm:pt-6 p-4 sm:p-6 flex-shrink-0 bg-white">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <button
                onClick={() => setIsCheckoutExpanded(!isCheckoutExpanded)}
                className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors text-sm sm:text-base font-semibold"
              >
                <span>
                  {isCheckoutExpanded ? 'Visualizar Produtos' : 'Click aqui Conferir Dados'}
                </span>
                {isCheckoutExpanded ? (
                  <ChevronUp className="w-4 sm:w-5 h-4 sm:h-5" />
                ) : (
                  <ChevronDown className="w-4 sm:w-5 h-4 sm:h-5" />
                )}
              </button>
              <div className="flex items-center space-x-2 shrink-0">
                <span className="text-base sm:text-xl font-semibold text-gray-900">Total:</span>
                <span className="text-lg sm:text-2xl font-bold text-green-600">R$ {getCartTotal ? getCartTotal().toFixed(2) : '0.00'}</span>
              </div>
            </div>

            {isCheckoutExpanded && (
              <div className="space-y-3 sm:space-y-4 mb-4">
                <div>
                  <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-1">
                    Seu Nome
                  </label>
                  <input
                    type="text"
                    id="clientName"
                    value={clientName || ''}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Digite seu nome"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label htmlFor="deliveryMethod" className="block text-sm font-medium text-gray-700 mb-1">
                    Método de Entrega
                  </label>
                  <select
                    id="deliveryMethod"
                    value={deliveryMethod || ''}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-sm sm:text-base"
                  >
                    <option value="">Selecione uma opção</option>
                    <option value="Retirada na Loja">Retirada na Loja</option>
                    <option value="Entrega">Entrega</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
                    Forma de Pagamento
                  </label>
                  <select
                    id="paymentMethod"
                    value={paymentMethod || ''}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-sm sm:text-base"
                  >
                    <option value="">Selecione uma opção</option>
                    <option value="Pix">Pix</option>
                    <option value="Cartão de Débito">Cartão de Débito</option>
                    <option value="Cartão de Crédito">Cartão de Crédito</option>
                    <option value="Dinheiro">Dinheiro</option>
                  </select>
                </div>
              </div>
            )}

            <button
              onClick={sendWhatsAppOrder}
              disabled={!clientName?.trim() || !deliveryMethod || !paymentMethod}
              className={`w-full bg-green-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg text-sm sm:text-lg font-semibold transition-colors flex items-center justify-center space-x-2 ${
                !clientName?.trim() || !deliveryMethod || !paymentMethod ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
              }`}
            >
              <MessageCircle className="w-4 sm:w-5 h-4 sm:h-5" />
              <span>Finalizar Pedido via WhatsApp</span>
            </button>
            
            <p className="text-center text-xs sm:text-sm text-gray-500 mt-3">
              Você será direcionado para o WhatsApp com seu pedido pronto
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente Principal
const RenovaItanhangaLanding = () => {
  // Estados principais
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [activeCategory, setActiveCategory] = useState('promocoes');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [clientName, setClientName] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  // Ref para scroll do carrinho
  const cartScrollRef = useRef(null);

  // Configurações
  const WHATSAPP_NUMBER = '5521979100303';
  const STORE_NAME = 'Renova Itanhangá';

  // Dados dos banners
  const banners = [
    {
      id: 1,
      title: "MEGA PROMOÇÃO DE INVERNO",
      subtitle: "Até 40% OFF em materiais selecionados",
      image: "/Renova/images/fotobanner/image.png",
      ctaText: "Aproveitar Oferta",
      ctaLink: "#produtos"
    },
    {
      id: 2,
      title: "ESTOQUE LIMITADO DE TIJOLOS",
      subtitle: "Garanta antes que acabe – últimas unidades disponíveis",
      image: "/Renova/images/fotobanner/fotobanner3.png",
      ctaText: "Comprar Agora",
      ctaLink: "#produtos"
    },
    {
      id: 3,
      title: "QUALIDADE GARANTIDA",
      subtitle: "Marcas líderes aprovadas por engenheiros e mestres de obra",
      image: "/Renova/images/fotobanner/fotobanner2.jpeg",
      ctaText: "Ver Produtos",
      ctaLink: "#produtos"
    },
    {
      id: 4,
      title: "LANÇAMENTO EXCLUSIVO",
      subtitle: "Novos modelos de ferramentas para facilitar sua obra",
      image: "/Renova/images/fotobanner/lancamento.jpg",
      ctaText: "Conferir Novidades",
      ctaLink: "#produtos"
    }
  ];

  // Dados dos produtos por categoria
  const productCategories = {
    promocoes: {
      title: "🔥 Promoções Imperdíveis",
      subtitle: "Aproveite nossas ofertas especiais com preços incríveis",
      products: [
        {
          id: 1,
          name: "Cimento CP-II 50kg",
          originalPrice: 32.90,
          price: 24.90,
          image: "/Renova/images/produtos/cimentoP2.jpg",
          bestseller: true
        },
        {
          id: 2,
          name: "Tijolo Cerâmico 8 Furos",
          originalPrice: 0.89,
          price: 0.69,
          image: "/Renova/images/produtos/tijolo.png",
          bestseller: false
        },
        {
          id: 3,
          name: "Argamassa AC-III 20kg",
          originalPrice: 18.50,
          price: 14.90,
          image: "/Renova/images/produtos/Argamassa.png",
          bestseller: true
        },
        {
          id: 4,
          name: "Areia Média - m³",
          originalPrice: 45.00,
          price: 39.90,
          image: "/Renova/images/produtos/areia.png",
          bestseller: false
        },
        {
          id: 5,
          name: "Cal Hidratada 20kg",
          originalPrice: 12.90,
          price: 9.90,
          image: "/Renova/images/produtos/cimentoItau.png",
          bestseller: false
        },
        {
          id: 6,
          name: "Pedra Brita 1 - m³",
          originalPrice: 62.00,
          price: 52.90,
          image: "/Renova/images/produtos/britas.png",
          bestseller: true
        }
      ]
    },
    estrutural: {
      title: "🏗️ Material Estrutural",
      subtitle: "Materiais essenciais para a base da sua construção",
      products: [
        {
          id: 7,
          name: "Vergalhão 10mm - 12m",
          originalPrice: 42.00,
          price: 36.90,
          image: "/Renova/images/produtos/ferro.png",
          bestseller: true
        },
        {
          id: 8,
          name: "Bloco de Concreto 14x19x39",
          originalPrice: 3.20,
          price: 2.85,
          image: "/Renova/images/produtos/bloco.jpg",
          bestseller: false
        },
        {
          id: 9,
          name: "Brita 1 - m³",
          originalPrice: 55.00,
          price: 49.90,
          image: "/Renova/images/produtos/britas.png",
          bestseller: false
        },
        {
          id: 10,
          name: "Cimento CP-IV 50kg",
          originalPrice: 29.90,
          price: 26.90,
          image: "/Renova/images/produtos/cimentoVotoran.png",
          bestseller: true
        },
        {
          id: 11,
          name: "Vergalhão 8mm - 12m",
          originalPrice: 28.50,
          price: 25.90,
          image: "/Renova/images/produtos/ferro.png",
          bestseller: false
        },
        {
          id: 12,
          name: "Laje Treliçada 12cm",
          originalPrice: 89.00,
          price: 79.90,
          image: "/Renova/images/produtos/lajeTrelica.png",
          bestseller: true
        },
        {
          id: 13,
          name: "Porcelanato Marmorizado 61x61cm",
          originalPrice: 56.90,
          price: 49.73,
          image: "/Renova/images/produtos/ceramica.png",
          bestseller: false
        },
        {
          id: 14,
          name: "Concreto Usinado FCK25",
          originalPrice: 285.00,
          price: 265.90,
          image: "/Renova/images/produtos/concreto.png",
          bestseller: true
        }
      ]
    },
    ferragens: {
      title: "🔧 Ferragens & Fixação",
      subtitle: "Tudo para fixar e conectar sua obra",
      products: [
        {
          id: 15,
          name: "Parafuso Phillips 6x100 - 50un",
          originalPrice: 24.90,
          price: 19.90,
          image: "/Renova/images/produtos/parafuso.png",
          bestseller: false
        },
        {
          id: 16,
          name: "Bucha S8 - Pacote 100un",
          originalPrice: 18.00,
          price: 14.50,
          image: "/Renova/images/produtos/buchadeParafuso.png",
          bestseller: true
        },
        {
          id: 17,
          name: "Dobradiça 3.1/2\" Cromada",
          originalPrice: 15.90,
          price: 12.90,
          image: "/Renova/images/produtos/dobradiça.png",
          bestseller: false
        },
        {
          id: 18,
          name: "Fechadura Externa Cromada",
          originalPrice: 89.90,
          price: 69.90,
          image: "/Renova/images/produtos/fechadura.png",
          bestseller: true
        },
        {
          id: 19,
          name: "Prego 18x30 - 1kg",
          originalPrice: 14.50,
          price: 11.90,
          image: "/Renova/images/produtos/pregos.png",
          bestseller: false
        },
        {
          id: 20,
          name: "Chumbador M10x80",
          originalPrice: 3.80,
          price: 2.90,
          image: "/Renova/images/produtos/buchaPresao.png",
          bestseller: true
        }
      ]
    },
    acabamento: {
      title: "🎨 Acabamento & Pintura",
      subtitle: "Para finalizar sua obra com qualidade e beleza",
      products: [
        {
          id: 21,
          name: "Tinta Acrílica Branca 18L",
          originalPrice: 125.00,
          price: 98.90,
          image: "/Renova/images/produtos/tinta.png",
          bestseller: true
        },
        {
          id: 22,
          name: "Rejunte Flexível Cinza 1kg",
          originalPrice: 12.50,
          price: 9.90,
          image: "/Renova/images/produtos/rejunte.png",
          bestseller: false
        },
        {
          id: 23,
          name: "Rolo de Pintura 23cm",
          originalPrice: 8.90,
          price: 6.90,
          image: "/Renova/images/produtos/rolodePinta.png",
          bestseller: false
        },
        {
          id: 24,
          name: "Pincel Trincha 4\"",
          originalPrice: 22.00,
          price: 17.90,
          image: "/Renova/images/produtos/pincel.png",
          bestseller: true
        },
        {
          id: 25,
          name: "Tinta Látex Fosco 18L",
          originalPrice: 89.90,
          price: 72.90,
          image: "/Renova/images/produtos/tintaprotege.png",
          bestseller: false
        },
        {
          id: 26,
          name: "Lixa d'Água 150 - Kit 10un",
          originalPrice: 25.00,
          price: 19.90,
          image: "/Renova/images/produtos/lixa.png",
          bestseller: true
        }
      ]
    },
    hidraulica: {
      title: "🚿 Hidráulica & Elétrica",
      subtitle: "Instalações completas para sua casa",
      products: [
        {
          id: 27,
          name: "Cano PVC 100mm - 6m",
          originalPrice: 45.90,
          price: 38.90,
          image: "/Renova/images/produtos/tuboPVC.png",
          bestseller: true
        },
        {
          id: 28,
          name: "Registro Gaveta 1/2\"",
          originalPrice: 28.50,
          price: 22.90,
          image: "/Renova/images/produtos/registro.png",
          bestseller: false
        },
        {
          id: 29,
          name: "Caixa d'Água 1000L",
          originalPrice: 485.00,
          price: 425.90,
          image: "/Renova/images/produtos/caixadeagua.png",
          bestseller: true
        },
        {
          id: 30,
          name: "Fio Elétrico 2.5mm - 100m",
          originalPrice: 89.90,
          price: 76.90,
          image: "/Renova/images/produtos/fio.png",
          bestseller: false
        }
      ]
    }
  };

  // Configurações de categorias
  const categoryTabs = [
    { key: 'promocoes', label: '🔥 Promoções' },
    { key: 'estrutural', label: '🏗️ Estrutural' },
    { key: 'ferragens', label: '🔧 Ferragens' },
    { key: 'acabamento', label: '🎨 Acabamento' },
    { key: 'hidraulica', label: '🚿 Hidráulica' }
  ];

  // Timer de promoção
  const [promoTimer, setPromoTimer] = useState({
    endTime: Date.now() + (24 * 60 * 60 * 1000),
    hours: 24,
    minutes: 0
  });

  // Efeitos
  useEffect(() => {
    if (showCart) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showCart]);

  useEffect(() => {
    const handleScroll = () => {
      const productsSection = document.getElementById('produtos');
      if (productsSection) {
        const rect = productsSection.getBoundingClientRect();
        setShowScrollButton(rect.top < -100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const timeLeft = promoTimer.endTime - now;
      if (timeLeft > 0) {
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        setPromoTimer(prev => ({ ...prev, hours, minutes }));
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [promoTimer.endTime]);

  useEffect(() => {
    if (showCart) return;

    const interval = setInterval(() => {
      setCurrentBannerIndex(prev => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length, showCart]);

  // Funções auxiliares
  const getCategoryColor = (categoryKey) => {
    const colors = {
      promocoes: 'bg-red-500 border-red-200',
      estrutural: 'bg-blue-500 border-blue-200', 
      ferragens: 'bg-yellow-500 border-yellow-200',
      acabamento: 'bg-purple-500 border-purple-200',
      hidraulica: 'bg-green-600 border-green-200'
    };
    return colors[categoryKey] || 'bg-gray-500 border-gray-200';
  };

  const scrollToProducts = () => {
    const productsSection = document.getElementById('produtos');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const currentProducts = productCategories[activeCategory]?.products || [];
  const currentCategoryInfo = productCategories[activeCategory] || {};

  // Funções do carrinho
  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      const product = cartItems.find(item => item.id === productId);
      setShowDeleteConfirm({
        productId,
        productName: product?.name || 'Item'
      });
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const confirmRemoveFromCart = () => {
    if (showDeleteConfirm) {
      setCartItems(prevItems => prevItems.filter(item => item.id !== showDeleteConfirm.productId));
      setShowDeleteConfirm(null);
    }
  };

  const removeFromCart = (productId) => {
    const product = cartItems.find(item => item.id === productId);
    setShowDeleteConfirm({
      productId,
      productName: product?.name || 'Item'
    });
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const sendWhatsAppOrder = () => {
    if (cartItems.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }
    if (!clientName.trim()) {
      alert('Por favor, insira seu nome antes de finalizar o pedido.');
      return;
    }
    if (!deliveryMethod) {
      alert('Por favor, selecione o método de entrega.');
      return;
    }
    if (!paymentMethod) {
      alert('Por favor, selecione a forma de pagamento.');
      return;
    }

    let message = `🏗️ *NOVO PEDIDO - ${STORE_NAME}*\n\n`;
    message += `👤 *Cliente*: ${clientName}\n`;
    message += `🚚 *Método de Entrega*: ${deliveryMethod}\n`;
    message += `💳 *Forma de Pagamento*: ${paymentMethod}\n\n`;
    message += `📋 *ITENS DO PEDIDO:*\n`;
    
    cartItems.forEach((item, index) => {
      message += `${index + 1}. *${item.name}*\n`;
      message += `   📦 Quantidade: ${item.quantity}\n\n`;
    });

    message += `📞 Por favor, confirme os valores e detalhes de entrega e pagamento.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    
    setCartItems([]);
    setShowCart(false);
    setClientName('');
    setDeliveryMethod('');
    setPaymentMethod('');
  };

  // Modal de confirmação de exclusão
  const DeleteConfirmModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-[60] flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-lg max-w-sm w-full p-4 sm:p-6 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-10 sm:h-12 w-10 sm:w-12 rounded-full bg-red-100 mb-4">
            <Trash2 className="h-5 sm:h-6 w-5 sm:w-6 text-red-600" />
          </div>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Confirmar Remoção</h3>
          <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
            Tem certeza que deseja remover "<span className="font-semibold">{showDeleteConfirm?.productName}</span>" do carrinho?
          </p>
          <div className="flex space-x-2 sm:space-x-3">
            <button
              onClick={() => setShowDeleteConfirm(null)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base"
            >
              Cancelar
            </button>
            <button
              onClick={confirmRemoveFromCart}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base"
            >
              Sim, Remover
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const currentBanner = banners[currentBannerIndex];
  const [showEntrega, setShowEntrega] = useState(false);
  const [showTrocas, setShowTrocas] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <h1 className="text-xl sm:text-2xl font-bold text-green-600">Renova Itanhangá</h1>
              <span className="hidden sm:inline text-xs sm:text-sm text-gray-500">Materiais de Construção</span>
            </div>

            <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
              <a href="#produtos" className="text-gray-700 hover:text-green-600 transition-colors text-sm lg:text-base">Produtos</a>
              <a href="#sobre" className="text-gray-700 hover:text-green-600 transition-colors text-sm lg:text-base">Sobre</a>
              <a href="#contato" className="text-gray-700 hover:text-green-600 transition-colors text-sm lg:text-base">Contato</a>
              
              <button onClick={() => setShowCart(true)} className="bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-700 transition-colors relative text-sm lg:text-base">
                <ShoppingCart className="w-4 h-4 inline mr-1 sm:mr-2" />
                Carrinho
                {getCartItemCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 sm:w-6 h-5 sm:h-6 flex items-center justify-center">
                    {getCartItemCount()}
                  </span>
                )}
              </button>
            </nav>

            <div className="md:hidden flex items-center space-x-2">
              <button onClick={() => setShowCart(true)} className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors relative">
                <ShoppingCart className="w-4 sm:w-5 h-4 sm:h-5" />
                {getCartItemCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 sm:w-5 h-4 sm:h-5 flex items-center justify-center">
                    {getCartItemCount()}
                  </span>
                )}
              </button>
              
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                {mobileMenuOpen ? <X className="w-5 sm:w-6 h-5 sm:h-6" /> : <Menu className="w-5 sm:w-6 h-5 sm:h-6" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 sm:px-4 py-2 space-y-2">
              <a href="#produtos" className="block py-2 text-gray-700 hover:text-green-600 text-sm sm:text-base">Produtos</a>
              <a href="#sobre" className="block py-2 text-gray-700 hover:text-green-600 text-sm sm:text-base">Sobre</a>
              <a href="#contato" className="block py-2 text-gray-700 hover:text-green-600 text-sm sm:text-base">Contato</a>
            </div>
          </div>
        )}
      </header>

      {/* HERO BANNER */}
      <section className="relative h-[50vh] sm:h-[60vh] min-h-[350px] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center transition-all duration-1000" style={{ backgroundImage: `url(${currentBanner.image})` }}>
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 w-full">
            <div className="max-w-xl sm:max-w-2xl">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight">{currentBanner.title}</h2>
              <p className="text-base sm:text-lg md:text-xl text-white mb-4 sm:mb-6 opacity-90">{currentBanner.subtitle}</p>

              <div className="bg-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg inline-block mb-4 sm:mb-6 animate-pulse">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 sm:w-5 h-4 sm:h-5" />
                  <span className="font-bold text-sm sm:text-base">OFERTA EXPIRA EM: {promoTimer.hours}h {promoTimer.minutes}min</span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (currentBanner.ctaLink.startsWith("#")) {
                    document.querySelector(currentBanner.ctaLink)?.scrollIntoView({ behavior: "smooth" });
                  } else {
                    window.location.href = currentBanner.ctaLink;
                  }
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                {currentBanner.ctaText}
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBannerIndex(index)}
              className={`w-2 sm:w-3 h-2 sm:h-3 rounded-full transition-colors ${
                index === currentBannerIndex ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-14 sm:w-16 h-14 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Truck className="w-6 sm:w-8 h-6 sm:h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Frete Grátis</h3>
              <p className="text-xs sm:text-sm text-gray-600">Acima de R$ 200</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-14 sm:w-16 h-14 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Shield className="w-6 sm:w-8 h-6 sm:h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Garantia</h3>
              <p className="text-xs sm:text-sm text-gray-600">Em todos os produtos</p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 w-14 sm:w-16 h-14 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <CreditCard className="w-6 sm:w-8 h-6 sm:h-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Parcelamento</h3>
              <p className="text-xs sm:text-sm text-gray-600">Até 12x sem juros</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-14 sm:w-16 h-14 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Star className="w-6 sm:w-8 h-6 sm:h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Qualidade</h3>
              <p className="text-xs sm:text-sm text-gray-600">Produtos certificados</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUTOS POR CATEGORIA */}
      <section id="produtos" className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Promoções Imperdíveis</h2>
            <p className="text-base sm:text-lg text-gray-600">30 Ofertas Imperdíveis + Tudo Para Sua Obra</p>
          </div>

          <div className="flex flex-wrap justify-center mb-6 sm:mb-8 gap-2" id="category-tabs">
            {categoryTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveCategory(tab.key)}
                className={`px-2 sm:px-3 py-1 sm:py-2 md:px-4 md:py-3 rounded-lg text-xs sm:text-sm md:text-base font-semibold transition-all duration-300 border-2 ${
                  activeCategory === tab.key
                    ? `${getCategoryColor(tab.key)} text-white shadow-lg transform scale-105`
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">{currentCategoryInfo.title}</h3>
            <p className="text-base sm:text-lg text-gray-600">{currentCategoryInfo.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {currentProducts.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative">
                {product.bestseller && (
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10">
                    <div className="bg-red-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold animate-pulse">
                      Mais Vendido
                    </div>
                  </div>
                )}
                
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10">
                  <div className="bg-green-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold">
                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </div>
                </div>

                <div className="relative overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-40 sm:h-48 object-cover transition-transform duration-300 hover:scale-110" />
                </div>
                
                <div className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 h-10 sm:h-12 flex items-center">{product.name}</h3>
                  <div className="mb-3 sm:mb-4">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-lg sm:text-2xl font-bold text-green-600">R$ {product.price.toFixed(2)}</span>
                      <span className="text-sm sm:text-lg text-gray-500 line-through">R$ {product.originalPrice.toFixed(2)}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-green-600 font-medium">
                      Economia de R$ {(product.originalPrice - product.price).toFixed(2)}
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => addToCart(product)}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-2 sm:py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
                  >
                    Adicionar ao Carrinho
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-6 sm:mt-8">
            <p className="text-gray-600 text-sm sm:text-base">
              Mostrando <span className="font-bold text-green-600">{currentProducts.length}</span> produtos 
              da categoria <span className="font-bold">{currentCategoryInfo.title}</span>
            </p>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Pronto para começar sua obra?</h2>
          <p className="text-base sm:text-lg mb-6 sm:mb-8 opacity-90">Entre em contato conosco e receba um orçamento personalizado</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <button className="bg-white text-green-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-sm sm:text-lg font-semibold hover:bg-gray-100 transition-colors">
              Solicitar Orçamento
            </button>
            <button 
              onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Olá! Gostaria de mais informações sobre os produtos da ${STORE_NAME}.`, '_blank')}
              className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-sm sm:text-lg font-semibold hover:bg-white hover:text-green-600 transition-colors flex items-center justify-center space-x-2"
            >
              <MessageCircle className="w-4 sm:w-5 h-4 sm:h-5" />
              <span>Falar no WhatsApp</span>
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-green-400 mb-3 sm:mb-4">Renova Itanhangá</h3>
              <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">Sua loja de materiais de construção de confiança há mais de 20 anos.</p>
              <div className="text-gray-400 text-xs sm:text-sm">
                <p>📍 Itanhangá, Rio de Janeiro - RJ</p>
                <p>📞 (21) 979100303</p>
                <p>✉️ contato@renovaitanhanga.com.br</p>
              </div>
              <div className="mt-4 sm:mt-6">
                <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Siga-nos</h4>
                <ul className="space-y-2 text-gray-300 text-xs sm:text-sm">
                  <li>
                    <a
                      href="https://www.instagram.com/sua-conta-real"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center hover:text-green-400 transition-colors"
                    >
                      <Instagram className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.facebook.com/sua-conta-real"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center hover:text-green-400 transition-colors"
                    >
                      <Facebook className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                      Facebook
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Entrega Rápida Direto na Sua Residência</h4>
              <ul className="space-y-2 text-gray-300 text-xs sm:text-sm">
                <li>
                  <button
                    onClick={() => setShowEntrega(!showEntrega)}
                    className="hover:text-green-400 transition-colors flex items-center"
                  >
                    Política de Entrega
                    <span className={`ml-2 transform transition-transform ${showEntrega ? "rotate-180" : ""}`}>
                      ▼
                    </span>
                  </button>
                  {showEntrega && (
                    <p className="mt-2 text-xs sm:text-sm text-gray-400">
                      Nossas entregas são realizadas em até 3 horas após a confirmação do pagamento. O prazo pode variar conforme a região.
                    </p>
                  )}
                </li>
                <li>
                  <button
                    onClick={() => setShowTrocas(!showTrocas)}
                    className="hover:text-green-400 transition-colors flex items-center"
                  >
                    Devoluções & Trocas
                    <span className={`ml-2 transform transition-transform ${showTrocas ? "rotate-180" : ""}`}>
                      ▼
                    </span>
                  </button>
                  {showTrocas && (
                    <p className="mt-2 text-xs sm:text-sm text-gray-400">
                      Aceitamos devoluções e trocas em até 7 dias após a entrega, desde que o produto esteja em perfeitas condições.
                    </p>
                  )}
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Empresa</h4>
              <ul className="space-y-2 text-gray-300 text-xs sm:text-sm">
                <li><a href="#" className="hover:text-green-400 transition-colors">Sobre Nós</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Nossas Lojas</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Política de Privacidade</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Atendimento</h4>
              <ul className="space-y-2 text-gray-300 text-xs sm:text-sm">
                <li>Segunda a Sexta: 7h às 18h</li>
                <li>Sábado: 7h às 16h</li>
                <li>Domingo: 8h às 12h</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400 text-xs sm:text-sm">
            <p>&copy; 2025 Renova Itanhangá. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* BOTÃO FLUTUANTE PARA SUBIR */}
      {showScrollButton && (
        <button
          onClick={scrollToProducts}
          className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 bg-green-600 hover:bg-green-700 text-white p-3 sm:p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 z-40 animate-bounce"
          title="Voltar às categorias"
        >
          <ChevronUp className="w-5 sm:w-6 h-5 sm:h-6" />
        </button>
      )}

      {/* MODAL DO CARRINHO */}
      {showCart && (
        <CartModal 
          setShowCart={setShowCart} 
          cartItems={cartItems} 
          updateQuantity={updateQuantity} 
          removeFromCart={removeFromCart} 
          getCartItemCount={getCartItemCount} 
          getCartTotal={getCartTotal} 
          sendWhatsAppOrder={sendWhatsAppOrder} 
          cartScrollRef={cartScrollRef} 
          clientName={clientName}
          setClientName={setClientName}
          deliveryMethod={deliveryMethod}
          setDeliveryMethod={setDeliveryMethod}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
        />
      )}

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      {showDeleteConfirm && <DeleteConfirmModal />}
    </div>
  );
};

export default RenovaItanhangaLanding;
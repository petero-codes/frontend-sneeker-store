// Mock API utilities
const API_BASE_URL = 'https://api.seekon-apparel.com'; // Placeholder

// Helper function to simulate network errors
const simulateNetworkError = () => {
  // 5% chance of network error for demo purposes
  return Math.random() < 0.05;
};

// Helper function to handle API errors
const handleApiError = (error, context = 'API call') => {
  console.error(`${context} failed:`, error);
  throw new Error(error.message || 'Something went wrong. Please try again.');
};

// Mock API functions
export const api = {
  // Products
  getProducts: async (filters = {}) => {
    try {
      if (simulateNetworkError()) {
        throw new Error('Network error: Unable to fetch products');
      }
      // This will be handled by Redux async thunk
      return Promise.resolve([]);
    } catch (error) {
      handleApiError(error, 'Fetch products');
    }
  },

  getProduct: async (id) => {
    try {
      if (simulateNetworkError()) {
        throw new Error('Network error: Unable to fetch product details');
      }
      
      // Mock single product fetch
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        id: parseInt(id),
        name: 'Sample Product',
        brand: 'Nike',
        price: 19500,
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop',
        description: 'Sample product description',
      };
    } catch (error) {
      handleApiError(error, 'Fetch product');
    }
  },

  // User authentication
  login: async (credentials) => {
    try {
      if (simulateNetworkError()) {
        throw new Error('Network error: Unable to authenticate');
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Mock login logic handled in userSlice
      return { success: true };
    } catch (error) {
      handleApiError(error, 'User login');
    }
  },

  register: async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Mock register logic handled in userSlice
    return { success: true };
  },

  // Orders
  createOrder: async (orderData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      id: Date.now(),
      status: 'pending',
      total: orderData.total,
      items: orderData.items,
    };
  },

  getOrders: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: 1,
        date: '2024-01-15',
        status: 'delivered',
        total: 32500,
        items: [
          { name: 'Air Jordan 1', quantity: 1, price: 22100 },
          { name: 'Nike T-Shirt', quantity: 2, price: 5200 },
        ],
      },
    ];
  },

  // Enhanced AI Chat with comprehensive website intelligence
  sendChatMessage: async (message, userId) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const lowerMessage = message.toLowerCase();
    
    // Enhanced greeting responses with personalization
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return {
        message: `Hey there, fashion-forward friend! 🔥 Welcome to Seekon Apparel - where style meets substance! I'm Seekon, your personal style guru and shopping expert. I live and breathe fashion, and I'm here to help you discover pieces that'll make you look absolutely incredible!\n\n✨ **What I'm amazing at:**\n🛍️ **Curating**: Finding those perfect pieces that scream "YOU"\n📦 **Orders**: Tracking your style deliveries like a pro\n👤 **Account**: Making your profile as sharp as your outfits\n💳 **Payments**: Smooth transactions, zero hassle\n👗 **Style**: Outfit inspo that'll turn heads\n🔧 **Support**: Always here when you need me\n\nReady to elevate your wardrobe? Let's make some magic happen! ✨`,
        suggestions: ['Show me fresh Nike kicks', 'Track my order', 'Help me find my size', 'Style recommendations', 'What\'s trending?', 'Account help']
      };
    }
    
    // Enhanced price-based responses
    if (lowerMessage.includes('under') || lowerMessage.includes('cheap') || lowerMessage.includes('budget') || lowerMessage.includes('affordable') || lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return {
        message: "Oh honey, I've got the BEST deals for you! 💸 Let me show you how to score incredible style without breaking the bank:\n\n💰 **Smart Shopping**: I'll find those hidden gems that look expensive but aren't!\n🏷️ **Flash Sales**: Exclusive drops with insane discounts (like, seriously good)\n💎 **Bundle Magic**: Mix & match deals that'll make your wallet happy\n🎫 **Secret Codes**: Extra savings that most people miss\n⭐ **Style Steals**: High-quality pieces at unbelievable prices\n📊 **Price Drops**: I'll alert you when your wishlist items go on sale\n\nTell me your budget and I'll curate a collection that'll make you look like a million bucks! What's your style budget?",
        suggestions: ['Under KSh 5,000', 'Under KSh 10,000', 'Show me deals', 'Best value items', 'Bundle deals', 'Price alerts']
      };
    }
    
    // Comprehensive sizing help
    if (lowerMessage.includes('size') || lowerMessage.includes('fit') || lowerMessage.includes('measurement') || lowerMessage.includes('small') || lowerMessage.includes('large') || lowerMessage.includes('medium')) {
      return {
        message: "Perfect fit is EVERYTHING, babe! 👗✨ Let me be your personal fit expert and make sure you look absolutely flawless:\n\n📏 **Size Charts**: Detailed measurements for every brand (because they're all different!)\n👟 **Brand Secrets**: I know Nike runs small, Adidas runs true-to-size, and all the insider tips\n📱 **Virtual Try-On**: AR magic that shows you exactly how it'll look\n📝 **Your Fit Profile**: I remember your perfect sizes for every brand\n🔄 **Easy Swaps**: Free exchanges because we want you to LOVE your fit\n👥 **Style Squad**: Reviews from people with your exact body type\n\nNothing ruins a look like bad fit - let's get you sized up perfectly! What are you shopping for?",
        suggestions: ['Size guide', 'How do Nike sizes run?', 'Virtual fitting', 'Size history', 'Exchange policy', 'Community reviews']
      };
    }
    
    // Order tracking with full intelligence
    if (lowerMessage.includes('order') || lowerMessage.includes('track') || lowerMessage.includes('shipping') || lowerMessage.includes('delivery') || lowerMessage.includes('package') || lowerMessage.includes('where is')) {
      return {
        message: "Your style is on its way! 📦✨ Let me track down every detail of your fabulous order:\n\n📦 **Live Tracking**: Real-time updates on your package's journey\n🚚 **Delivery Details**: Carrier info, estimated arrival, and tracking numbers\n📍 **Flexible Delivery**: Express, standard, or pickup - whatever works for you!\n🔄 **Easy Changes**: Need to update address or delivery time? Done!\n📋 **Order History**: Your complete style journey and easy reorder options\n💬 **VIP Support**: Direct line to shipping partners for any issues\n\nI'm basically your personal delivery concierge! What's your order number or what would you like to know?",
        suggestions: ['Track my order', 'Where is my package?', 'Change delivery address', 'Order history', 'Delivery options', 'Contact carrier']
      };
    }
    
    // Cart management with intelligence
    if (lowerMessage.includes('cart') || lowerMessage.includes('add') || lowerMessage.includes('remove') || lowerMessage.includes('checkout') || lowerMessage.includes('buy') || lowerMessage.includes('purchase')) {
      return {
        message: "Let's curate that perfect cart! 🛒✨ I'm your personal shopping stylist, making sure every piece works together:\n\n🛒 **Smart Cart**: Add, remove, or adjust quantities with style\n💰 **Price Magic**: Real-time totals, taxes, and shipping (no surprises!)\n🎫 **Secret Discounts**: I'll find you the best promo codes and deals\n📦 **Complete the Look**: Perfect pairing suggestions for your items\n💾 **Style Wishlist**: Save items for later when you're ready\n🔄 **Seamless Sync**: Your cart follows you everywhere\n\nReady to build that dream wardrobe? What are you adding to your cart?",
        suggestions: ['Add to cart', 'Remove from cart', 'Apply discount', 'Bundle suggestions', 'Save for later', 'Proceed to checkout']
      };
    }
    
    // Style recommendations with AI intelligence
    if (lowerMessage.includes('style') || lowerMessage.includes('outfit') || lowerMessage.includes('match') || lowerMessage.includes('fashion') || lowerMessage.includes('look') || lowerMessage.includes('wear')) {
      return {
        message: "OMG, I LIVE for styling! 👗✨ I'm basically your personal fashion fairy godmother, and I'm about to make you look absolutely STUNNING:\n\n👗 **Outfit Magic**: Complete head-to-toe looks that'll make you feel like a million bucks\n🎨 **Color Genius**: I know exactly which colors make you glow and which ones to avoid\n📅 **Occasion Expert**: From boardroom boss to weekend warrior - I've got you covered\n👥 **Personal Touch**: Everything curated just for YOUR style and body type\n📸 **Visual Vibes**: See exactly how pieces work together before you buy\n🛍️ **One-Click Magic**: Add entire outfits to your cart in seconds\n\nReady to become a style icon? Tell me what vibe you're going for!",
        suggestions: ['Casual outfit', 'Work attire', 'Athletic wear', 'Formal look', 'Color matching', 'Complete outfit']
      };
    }
    
    // Running/sports specific with intelligence
    if (lowerMessage.includes('running') || lowerMessage.includes('gym') || lowerMessage.includes('workout') || lowerMessage.includes('sports') || lowerMessage.includes('athletic') || lowerMessage.includes('exercise')) {
      return {
        message: "Time to CRUSH those goals! 💪🔥 I'm your personal performance coach and gear expert:\n\n🏃 **Running Beast Mode**: Shoes and gear that'll make you faster, stronger, better\n💪 **Gym Warrior**: Workout clothes that move WITH you, not against you\n⚽ **Sport-Specific Magic**: Equipment tailored to YOUR game and style\n📊 **Performance Science**: Shoe tech that actually makes a difference\n👟 **Fit Perfection**: Gait analysis and recommendations that pros use\n🏆 **Elite Level**: What champions wear (and you can too!)\n\nReady to level up your game? What's your sport or fitness goal?",
        suggestions: ['Running shoes', 'Gym apparel', 'Basketball gear', 'Soccer equipment', 'Performance analysis', 'Pro recommendations']
      };
    }

    // Returns and exchanges
    if (lowerMessage.includes('return') || lowerMessage.includes('exchange') || lowerMessage.includes('refund') || lowerMessage.includes('cancel') || lowerMessage.includes('wrong size')) {
      return {
        message: "No worries, babe! We've got your back! 💕✨ Returns should be as easy as falling in love with our clothes:\n\n🔄 **Hassle-Free Returns**: Free shipping, no questions asked (seriously!)\n📦 **Quick Swaps**: Size or color exchanges in a flash\n💰 **Your Money Back**: Original payment or store credit - your choice!\n📅 **30-Day Grace**: Plenty of time to fall in love with your purchase\n📋 **Pre-Paid Labels**: We'll send you everything you need\n📞 **VIP Support**: Our returns team treats you like family\n\nWe want you to LOVE what you buy! What needs to go back?",
        suggestions: ['Start return', 'Exchange item', 'Check return status', 'Return policy', 'Refund timeline', 'Contact returns team']
      };
    }

    // Specific product requests with intelligence
    if (lowerMessage.includes('shoes') || lowerMessage.includes('sneakers') || lowerMessage.includes('boots') || lowerMessage.includes('sandals')) {
      return {
        message: "Shoe game STRONG! 👟✨ I'm your personal footwear expert and I know exactly what'll make your feet happy:\n\n👟 **Category Master**: Running beasts, casual kings, athletic legends, formal stunners\n🏷️ **Brand Whisperer**: Nike, Adidas, Jordan, Puma - I know them all inside out\n📏 **Fit Wizard**: Size guides that actually work (no more guessing!)\n💰 **Deal Hunter**: Best prices and steals that'll make your wallet smile\n⭐ **Review Guru**: Real feedback from people who actually wear them\n🆕 **Drop Alert**: Latest releases and limited editions (I'll hook you up!)\n\nReady to step up your shoe game? What's your vibe?",
        suggestions: ['Running shoes', 'Casual sneakers', 'Basketball shoes', 'Dress shoes', 'Size guide', 'Latest drops']
      };
    }
    
    // Apparel and clothing requests
    if (lowerMessage.includes('shirt') || lowerMessage.includes('hoodie') || lowerMessage.includes('jacket') || lowerMessage.includes('pants') || lowerMessage.includes('clothing') || lowerMessage.includes('apparel')) {
      return {
        message: "Clothing game about to be LEGENDARY! 👕✨ I'm your personal wardrobe curator and I know exactly what'll make you look fire:\n\n👕 **Style Categories**: Tees that slay, hoodies that hug, jackets that command respect\n🏷️ **Brand Expert**: Nike, Adidas, Jordan, Puma - I know every collection\n📏 **Fit Perfection**: Size charts that actually work (no more wardrobe malfunctions!)\n🎨 **Color Master**: I know which colors make you glow and which ones to skip\n💰 **Budget Boss**: Amazing pieces that won't break the bank\n⭐ **Styling Secrets**: How to mix, match, and create looks that turn heads\n\nReady to build a wardrobe that's absolutely iconic? What's your style?",
        suggestions: ['T-shirts', 'Hoodies', 'Jackets', 'Pants', 'Size guide', 'Style tips']
      };
    }
    
    // Accessories requests
    if (lowerMessage.includes('bag') || lowerMessage.includes('hat') || lowerMessage.includes('socks') || lowerMessage.includes('watch') || lowerMessage.includes('accessories')) {
      return {
        message: "Accessories are EVERYTHING! 🎒✨ I'm your personal finishing touches expert - those little details that make your look absolutely POP:\n\n🎒 **Bag Game Strong**: Backpacks that carry your dreams, gym bags that mean business\n🧢 **Hat Magic**: Caps that crown your style, beanies that hug your head perfectly\n🧦 **Sock Swagger**: Athletic socks that perform, casual ones that slay\n⌚ **Watch Wisdom**: Timepieces that tell your story and complete your vibe\n🎁 **Gift Genius**: Curated sets that'll make someone's day (or yours!)\n💰 **Bundle Brilliance**: Mix and match deals that save you money\n\nReady to accessorize like a pro? What's missing from your look?",
        suggestions: ['Backpacks', 'Baseball caps', 'Athletic socks', 'Smart watches', 'Gift sets', 'Bundle deals']
      };
    }

    // Account Management Intelligence
    if (lowerMessage.includes('account') || lowerMessage.includes('profile') || lowerMessage.includes('settings')) {
      return {
        message: "Let's make your account as fabulous as you are! 👤✨ I'm your personal account manager and I'll help you keep everything organized and secure:\n\n👤 **Profile Perfection**: Update your info, add that perfect profile pic\n📋 **Order History**: Your complete style journey and easy reorder options\n💳 **Payment Magic**: Manage cards, billing, and payment preferences\n📧 **Smart Notifications**: Get alerts for sales, new drops, and order updates\n🔒 **Security Shield**: Password updates, 2FA, and privacy controls\n📱 **Style Preferences**: Save your sizes, favorite brands, and wishlist\n\nReady to personalize your Seekon experience? What needs updating?",
        suggestions: ['Update profile', 'View order history', 'Change password', 'Manage addresses', 'Update preferences', 'Security settings']
      };
    }

    // Payment & Billing Intelligence
    if (lowerMessage.includes('payment') || lowerMessage.includes('billing') || lowerMessage.includes('card') || lowerMessage.includes('checkout')) {
      return {
        message: "Payment made EASY! 💳✨ I'm your personal finance wizard and I'll make sure your money works as hard as you do:\n\n💳 **Payment Power**: Add cards, use digital wallets, Apple Pay, Google Pay - you name it!\n💰 **Price Genius**: Real-time pricing, automatic discounts, and total calculations\n🧾 **Billing Boss**: Invoices, receipts, subscriptions - all organized and accessible\n🔄 **Refund Rocket**: Fast returns, instant refunds, and status tracking\n💎 **Rewards Royalty**: Points, cashback, and exclusive member perks\n🎫 **Coupon Queen**: Promo codes, special deals, and savings that actually work\n\nReady to make your payment process smooth as silk? What do you need help with?",
        suggestions: ['Add payment method', 'Apply discount code', 'Check order total', 'Process refund', 'View billing history', 'Redeem rewards']
      };
    }

    // Technical Support Intelligence
    if (lowerMessage.includes('problem') || lowerMessage.includes('issue') || lowerMessage.includes('error') || lowerMessage.includes('bug')) {
      return {
        message: "Don't worry, I've got your back! 🛠️✨ I'm your personal tech superhero and I'll fix whatever's bugging you:\n\n🌐 **Website Wizard**: Cache clearing, browser fixes, connection troubleshooting\n📱 **Mobile Master**: App updates, device restarts, permission fixes\n🛒 **Cart Crusader**: Cart clearing, page refreshes, login status checks\n💳 **Payment Protector**: Card verification, alternative methods, balance checks\n📦 **Shipping Sleuth**: Package tracking, carrier contact, address updates\n🔐 **Login Legend**: Password resets, email verification, cookie clearing\n\nNo tech problem is too big for me! What's giving you trouble?",
        suggestions: ['Website not loading', 'Cart not working', 'Payment failed', 'Can\'t login', 'Shipping delay', 'Mobile app issues']
      };
    }

    // Product Intelligence - Enhanced
    if (lowerMessage.includes('nike') || lowerMessage.includes('adidas') || lowerMessage.includes('puma') || lowerMessage.includes('converse')) {
      const brand = lowerMessage.includes('nike') ? 'Nike' : 
                   lowerMessage.includes('adidas') ? 'Adidas' : 
                   lowerMessage.includes('puma') ? 'Puma' : 'Converse';

      return {
        message: `Excellent choice! ${brand} is one of our premium brands. Here's what I can help you with:\n\n👟 **Latest Releases**: New ${brand} drops and limited editions\n💰 **Pricing**: Current prices, discounts, and bundle deals\n📏 **Sizing**: ${brand} size guides and fit recommendations\n⭐ **Reviews**: Customer ratings and detailed feedback\n📦 **Availability**: Stock levels and restock notifications\n🚚 **Shipping**: Delivery times and tracking for ${brand} products\n\nWhat specific ${brand} product interests you?`,
        suggestions: [`Show me ${brand} Air Max`, `What ${brand} shoes do you have?`, `${brand} size guide`, `${brand} latest drops`, `${brand} sale items`, `${brand} reviews`]
      };
    }
    
    // Price-based responses with intelligence
    if (lowerMessage.includes('under') || lowerMessage.includes('cheap') || lowerMessage.includes('budget') || lowerMessage.includes('affordable')) {
      return {
        message: "I'll help you find amazing deals within your budget! Here's what I can do:\n\n💰 **Price Filters**: Set maximum price limits\n🏷️ **Sale Items**: Current discounts and clearance deals\n💎 **Bundle Deals**: Multi-item discounts and packages\n🎫 **Coupon Codes**: Additional savings opportunities\n⭐ **Best Value**: Highest rated products in your price range\n📊 **Price Alerts**: Notify when items drop in price\n\nWhat's your budget range?",
        suggestions: ['Under KSh 5,000', 'Under KSh 10,000', 'Show me deals', 'Best value items', 'Bundle deals', 'Price alerts']
      };
    }
    
    // Size help with comprehensive guidance
    if (lowerMessage.includes('size') || lowerMessage.includes('fit') || lowerMessage.includes('measurement')) {
      return {
        message: "I'll help you find the perfect fit! Here's my comprehensive sizing assistance:\n\n📏 **Size Charts**: Detailed measurements for all brands\n👟 **Brand Differences**: How sizes vary between Nike, Adidas, etc.\n📱 **Virtual Fitting**: Try-on technology and AR features\n📝 **Size History**: Your previous purchases and fit notes\n🔄 **Easy Returns**: Free exchanges if size doesn't fit\n👥 **Community**: Reviews from customers with similar sizes\n\nWhat type of sizing help do you need?",
        suggestions: ['Size guide', 'How do Nike sizes run?', 'Virtual fitting', 'Size history', 'Exchange policy', 'Community reviews']
      };
    }
    
    // Order tracking with full intelligence
    if (lowerMessage.includes('order') || lowerMessage.includes('track') || lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
      return {
        message: "I can provide complete order tracking and management:\n\n📦 **Order Status**: Real-time tracking and delivery updates\n🚚 **Shipping Info**: Carrier details, estimated delivery, tracking numbers\n📍 **Delivery Options**: Express, standard, or pickup locations\n🔄 **Order Changes**: Modify addresses, delivery dates, or items\n📋 **Order History**: Complete purchase history and reorder options\n💬 **Support**: Direct contact with shipping partners\n\nWhat would you like to know about your order?",
        suggestions: ['Track my order', 'Where is my package?', 'Change delivery address', 'Order history', 'Delivery options', 'Contact carrier']
      };
    }
    
    // Cart management with intelligence
    if (lowerMessage.includes('cart') || lowerMessage.includes('add') || lowerMessage.includes('remove') || lowerMessage.includes('checkout')) {
      return {
        message: "I'll help you manage your cart efficiently:\n\n🛒 **Cart Management**: Add, remove, or modify quantities\n💰 **Price Calculation**: Real-time totals, taxes, and shipping\n🎫 **Discount Application**: Apply coupons and promo codes\n📦 **Bundle Suggestions**: Complete-the-look recommendations\n💾 **Save for Later**: Keep items for future purchase\n🔄 **Sync Across Devices**: Access cart from any device\n\nHow can I help with your cart?",
        suggestions: ['Add to cart', 'Remove from cart', 'Apply discount', 'Bundle suggestions', 'Save for later', 'Proceed to checkout']
      };
    }
    
    // Style recommendations with AI intelligence
    if (lowerMessage.includes('style') || lowerMessage.includes('outfit') || lowerMessage.includes('match') || lowerMessage.includes('fashion')) {
      return {
        message: "I'm your personal style consultant! Here's how I can help:\n\n👗 **Outfit Building**: Complete looks from head to toe\n🎨 **Color Coordination**: Matching colors and patterns\n📅 **Occasion Styling**: Work, casual, formal, or athletic wear\n👥 **Personalized**: Based on your preferences and body type\n📸 **Visual Examples**: See how items look together\n🛍️ **One-Click Shopping**: Add entire outfits to cart\n\nWhat style are you looking for?",
        suggestions: ['Casual outfit', 'Work attire', 'Athletic wear', 'Formal look', 'Color matching', 'Complete outfit']
      };
    }
    
    // Running/sports specific with intelligence
    if (lowerMessage.includes('running') || lowerMessage.includes('gym') || lowerMessage.includes('workout') || lowerMessage.includes('sports')) {
      return {
        message: "I'll help you gear up for peak performance!\n\n🏃 **Running Gear**: Shoes, apparel, and accessories for runners\n💪 **Gym Equipment**: Workout clothes and training gear\n⚽ **Sports Specific**: Equipment for different sports and activities\n📊 **Performance Data**: Shoe technology and performance metrics\n👟 **Fit Specialists**: Running gait analysis and shoe recommendations\n🏆 **Pro Recommendations**: What athletes and experts wear\n\nWhat's your sport or activity?",
        suggestions: ['Running shoes', 'Gym apparel', 'Basketball gear', 'Soccer equipment', 'Performance analysis', 'Pro recommendations']
      };
    }

    // Website Features Intelligence
    if (lowerMessage.includes('feature') || lowerMessage.includes('function') || lowerMessage.includes('how to') || lowerMessage.includes('tutorial')) {
      return {
        message: "I'll guide you through all our website features:\n\n🔍 **Search**: Advanced filters, visual search, AI recommendations\n👤 **Account**: Profile management, order tracking, preferences\n🛒 **Shopping**: Wishlist, compare products, size guides\n📱 **Mobile**: App features, mobile-optimized shopping\n🎁 **Gifts**: Gift wrapping, gift cards, wishlist sharing\n📞 **Support**: Live chat, help center, video tutorials\n\nWhich feature would you like to learn about?",
        suggestions: ['How to search', 'Account features', 'Mobile app', 'Gift options', 'Support center', 'Video tutorials']
      };
    }
    
    // Visual search and image analysis
    if (lowerMessage.includes('image') || lowerMessage.includes('photo') || lowerMessage.includes('picture') || lowerMessage.includes('visual search')) {
      return {
        message: "OMG, I LOVE analyzing style! 📸✨ I'm your personal visual search expert and I can analyze any image you send me:\n\n👗 **Style Analysis**: I'll break down the colors, patterns, and aesthetic vibes\n🏷️ **Brand Recognition**: I can spot Nike, Adidas, Jordan, and other brands instantly\n🎨 **Color Matching**: Find pieces that perfectly complement what you're wearing\n📏 **Fit Analysis**: I'll suggest similar cuts and silhouettes that'll flatter you\n✨ **Complete the Look**: Build entire outfits around your inspiration\n🛍️ **Instant Shopping**: Add matching pieces to your cart in seconds\n\nSend me any image and I'll work my magic! What style are you going for?",
        suggestions: ['Upload an image', 'Analyze my outfit', 'Find similar styles', 'Color match', 'Complete the look', 'Brand recognition']
      };
    }
    
    // Default responses with enhanced intelligence
    const defaultResponses = [
      "Hey gorgeous! I'm Seekon, your personal style guru and shopping bestie! 🔥 I'm here to make your shopping experience absolutely INCREDIBLE - from finding that perfect piece to tracking your orders, managing your account, and giving you style advice that'll make you look like a million bucks! What can I help you discover today?",
      "Welcome to Seekon Apparel, beautiful! I'm Seekon, your fashion-forward shopping companion! ✨ I live and breathe style, and I'm here to help you find products that'll make you feel absolutely STUNNING, track your orders like a pro, manage your account, and give you personalized recommendations that'll turn heads! Ready to elevate your wardrobe?",
      "Hi there, style icon! I'm Seekon, your personal shopping and style assistant! 👗 I know EVERYTHING about our products, website features, and I'm here to answer any questions you have with enthusiasm and expertise! What would you like to explore today?",
      "Ready to make some fashion magic happen? I'm Seekon, your personal shopping wizard! ✨ I can help you navigate our site like a pro, find the perfect products that scream 'YOU', manage your orders seamlessly, and provide personalized recommendations that'll make you look absolutely FABULOUS! What's your style vibe today?",
      "Hey there, fashion-forward friend! I'm Seekon, your all-in-one shopping and style expert! 🛍️ From product discovery that'll make your heart skip a beat to order management that's smooth as silk, account settings that work perfectly, and style advice that'll make you glow - I've got you covered! How can I make your day amazing?"
    ];
    
    return {
      message: defaultResponses[Math.floor(Math.random() * defaultResponses.length)],
      suggestions: ['Show me fresh Nike kicks', 'Track my order', 'Help me find my size', 'Style recommendations', 'What\'s trending?', 'Account help', 'Payment magic', 'Tech support']
    };
  },
};


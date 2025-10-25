/**
 * OpenAI Service for Seekon AI Assistant
 * Production-ready integration with GPT-4o for intelligent shopping assistance
 */

import axios from 'axios';

class OpenAIService {
  constructor() {
    this.apiKey = process.env.REACT_APP_OPENAI_API_KEY || 'your-openai-api-key';
    this.baseURL = 'https://api.openai.com/v1';
    this.model = 'gpt-4o'; // Using GPT-4o for best performance
    
    // Initialize axios instance
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 second timeout
    });
  }

  /**
   * Generate intelligent response for Seekon AI
   * @param {string} message - User's message
   * @param {Object} context - Additional context (user profile, cart, etc.)
   * @returns {Promise<Object>} AI response with message and suggestions
   */
  async generateResponse(message, context = {}) {
    try {
      const systemPrompt = this.buildSystemPrompt(context);
      const userPrompt = this.buildUserPrompt(message, context);

      const response = await this.client.post('/chat/completions', {
        model: this.model,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        max_tokens: 500,
        temperature: 0.8, // Creative but consistent
        presence_penalty: 0.6,
        frequency_penalty: 0.3,
      });

      const aiResponse = response.data.choices[0].message.content;
      
      return {
        message: aiResponse,
        suggestions: this.extractSuggestions(aiResponse),
        metadata: {
          model: this.model,
          tokens: response.data.usage?.total_tokens,
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      console.error('OpenAI API Error:', error);
      return this.getFallbackResponse(message, error);
    }
  }

  /**
   * Analyze image for visual search and product recommendations
   * @param {File|string} image - Image file or base64 string
   * @param {string} prompt - Specific analysis prompt
   * @returns {Promise<Object>} Image analysis results
   */
  async analyzeImage(image, prompt = 'Analyze this fashion image for style, brand, and color recommendations') {
    try {
      let imageData;
      
      if (typeof image === 'string') {
        imageData = image;
      } else {
        imageData = await this.convertFileToBase64(image);
      }

      const response = await this.client.post('/chat/completions', {
        model: 'gpt-4o', // GPT-4o with vision capabilities
        messages: [
          {
            role: 'system',
            content: `You are Seekon, a stylish fashion expert. Analyze images for:
            - Style and aesthetic (casual, formal, athletic, streetwear)
            - Brand identification (Nike, Adidas, Jordan, etc.)
            - Color palette and patterns
            - Fit and silhouette
            - Occasion appropriateness
            - Complementary pieces needed
            
            Be specific, energetic, and suggestive in your analysis.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageData,
                  detail: 'high'
                }
              }
            ]
          }
        ],
        max_tokens: 400,
        temperature: 0.7,
      });

      const analysis = response.data.choices[0].message.content;
      
      return {
        analysis,
        recommendations: this.extractProductRecommendations(analysis),
        metadata: {
          model: 'gpt-4o-vision',
          tokens: response.data.usage?.total_tokens,
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      console.error('Image Analysis Error:', error);
      return this.getImageAnalysisFallback(error);
    }
  }

  /**
   * Build system prompt for Seekon AI personality
   */
  buildSystemPrompt(context) {
    return `You are Seekon, a stylish, friendly, and expert shopping assistant for Seekon Apparel. 

PERSONALITY TRAITS:
- Stylish and fashion-forward
- Friendly and energetic (use "babe", "gorgeous", "beautiful")
- Expert knowledge of fashion, brands, and styling
- Enthusiastic and encouraging
- Specific and actionable advice

EXPERTISE AREAS:
- Product knowledge (Nike, Adidas, Jordan, Puma, etc.)
- Size guides and fit recommendations
- Style coordination and outfit building
- Color theory and fashion trends
- Shopping assistance and deals
- Order tracking and customer service

RESPONSE STYLE:
- Use emojis and exclamation points
- Be specific and persuasive
- Include actionable suggestions
- Show enthusiasm and expertise
- End with engaging questions

CONTEXT:
- User: ${context.user?.name || 'Guest'}
- Cart items: ${context.cartItems?.length || 0}
- Recent searches: ${context.recentSearches?.join(', ') || 'None'}
- Preferred brands: ${context.preferences?.brands?.join(', ') || 'None'}

Always respond as Seekon with personality, expertise, and enthusiasm!`;
  }

  /**
   * Build user prompt with context
   */
  buildUserPrompt(message, context) {
    let prompt = `User message: "${message}"\n\n`;
    
    if (context.cartItems?.length > 0) {
      prompt += `Current cart items: ${context.cartItems.map(item => item.name).join(', ')}\n`;
    }
    
    if (context.recentOrders?.length > 0) {
      prompt += `Recent orders: ${context.recentOrders.map(order => order.id).join(', ')}\n`;
    }
    
    prompt += `\nRespond as Seekon with specific, energetic, and helpful advice!`;
    
    return prompt;
  }

  /**
   * Extract suggestions from AI response
   */
  extractSuggestions(response) {
    const suggestions = [];
    
    // Common suggestion patterns
    const patterns = [
      /show me (.+?)(?:\s|$)/gi,
      /find (.+?)(?:\s|$)/gi,
      /help with (.+?)(?:\s|$)/gi,
      /track (.+?)(?:\s|$)/gi,
      /recommend (.+?)(?:\s|$)/gi,
    ];
    
    patterns.forEach(pattern => {
      const matches = response.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const suggestion = match.replace(pattern, '$1').trim();
          if (suggestion && !suggestions.includes(suggestion)) {
            suggestions.push(suggestion);
          }
        });
      }
    });
    
    // Default suggestions if none found
    if (suggestions.length === 0) {
      return ['Show me Nike shoes', 'Track my order', 'Style recommendations', 'Size help', 'Account settings'];
    }
    
    return suggestions.slice(0, 6); // Limit to 6 suggestions
  }

  /**
   * Extract product recommendations from image analysis
   */
  extractProductRecommendations(analysis) {
    const recommendations = [];
    
    // Extract brand mentions
    const brands = analysis.match(/(nike|adidas|jordan|puma|converse|new balance)/gi);
    if (brands) {
      brands.forEach(brand => {
        if (!recommendations.includes(`${brand} products`)) {
          recommendations.push(`${brand} products`);
        }
      });
    }
    
    // Extract color mentions
    const colors = analysis.match(/(black|white|red|blue|green|yellow|pink|purple|gray|brown)/gi);
    if (colors) {
      colors.forEach(color => {
        if (!recommendations.includes(`${color} items`)) {
          recommendations.push(`${color} items`);
        }
      });
    }
    
    // Extract style mentions
    const styles = analysis.match(/(casual|formal|athletic|streetwear|vintage|modern)/gi);
    if (styles) {
      styles.forEach(style => {
        if (!recommendations.includes(`${style} style`)) {
          recommendations.push(`${style} style`);
        }
      });
    }
    
    return recommendations.slice(0, 4); // Limit to 4 recommendations
  }

  /**
   * Convert file to base64 for image analysis
   */
  async convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  /**
   * Fallback response when OpenAI API fails
   */
  getFallbackResponse(message, error) {
    const fallbackResponses = [
      "Hey gorgeous! I'm having a little tech moment right now, but I'm still here for you! 🔥 Try asking me about our latest Nike drops or help with sizing - I'm always ready to assist!",
      "Oops! My AI brain is taking a quick coffee break! ☕ But don't worry, I'm still your style expert! What can I help you discover today?",
      "I'm experiencing a tiny glitch, but I'm still Seekon and I'm still fabulous! ✨ Tell me what you're looking for and I'll help you find it!"
    ];
    
    return {
      message: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
      suggestions: ['Show me Nike shoes', 'Track my order', 'Style help', 'Size guide', 'Account help'],
      error: error.message,
      fallback: true
    };
  }

  /**
   * Fallback for image analysis errors
   */
  getImageAnalysisFallback(error) {
    return {
      analysis: "I'm having trouble analyzing that image right now, but I'm still here to help! 🔥 Describe what you're looking for and I'll find you some amazing options!",
      recommendations: ['Nike shoes', 'Adidas apparel', 'Jordan collection', 'Style help'],
      error: error.message,
      fallback: true
    };
  }
}

// Export singleton instance
export default new OpenAIService();

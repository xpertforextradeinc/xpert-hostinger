/**
 * Payment Gateway Integration
 * Supports: Flutterwave and Paystack
 * Created: 2025-12-14
 */

class PaymentGateway {
  constructor(config = {}) {
    this.flutterwave = {
      publicKey: config.flutterwave?.publicKey || process.env.FLUTTERWAVE_PUBLIC_KEY,
      secretKey: config.flutterwave?.secretKey || process.env.FLUTTERWAVE_SECRET_KEY,
      baseUrl: 'https://api.flutterwave.com/v3'
    };

    this.paystack = {
      publicKey: config.paystack?.publicKey || process.env.PAYSTACK_PUBLIC_KEY,
      secretKey: config.paystack?.secretKey || process.env.PAYSTACK_SECRET_KEY,
      baseUrl: 'https://api.paystack.co'
    };

    this.timeout = config.timeout || 30000;
  }

  /**
   * FLUTTERWAVE INTEGRATION
   */

  /**
   * Initialize Flutterwave transaction
   * @param {Object} payload - Transaction details
   * @returns {Promise<Object>} Transaction response
   */
  async initializeFlutterwave(payload) {
    try {
      const {
        amount,
        email,
        phone,
        fullName,
        currency = 'NGN',
        description = 'Payment',
        reference = this.generateReference(),
        metadata = {}
      } = payload;

      // Validate required fields
      this.validateFlutterwavePayload({ amount, email, phone, fullName });

      const response = await this.makeRequest('POST', `${this.flutterwave.baseUrl}/payments`, {
        tx_ref: reference,
        amount: amount,
        currency: currency,
        customer: {
          email: email,
          phonenumber: phone,
          name: fullName
        },
        customizations: {
          title: 'Xpert Forex Trade Inc',
          description: description,
          logo: 'https://xpertforextrading.com/logo.png'
        },
        meta: metadata,
        redirect_url: process.env.FLUTTERWAVE_REDIRECT_URL || `${process.env.APP_URL}/payment/callback/flutterwave`
      }, {
        Authorization: `Bearer ${this.flutterwave.secretKey}`
      });

      if (response.status === 'success') {
        return {
          success: true,
          provider: 'flutterwave',
          reference: reference,
          link: response.data.link,
          amount: amount,
          currency: currency,
          timestamp: new Date().toISOString()
        };
      } else {
        throw new Error(response.message || 'Failed to initialize Flutterwave payment');
      }
    } catch (error) {
      console.error('Flutterwave initialization error:', error);
      throw this.formatError(error, 'flutterwave');
    }
  }

  /**
   * Verify Flutterwave transaction
   * @param {string} transactionId - Flutterwave transaction ID
   * @returns {Promise<Object>} Transaction details
   */
  async verifyFlutterwaveTransaction(transactionId) {
    try {
      const response = await this.makeRequest(
        'GET',
        `${this.flutterwave.baseUrl}/transactions/${transactionId}/verify`,
        null,
        {
          Authorization: `Bearer ${this.flutterwave.secretKey}`
        }
      );

      if (response.status === 'success') {
        const transaction = response.data;
        return {
          success: transaction.status === 'successful',
          provider: 'flutterwave',
          reference: transaction.tx_ref,
          transactionId: transaction.id,
          amount: transaction.amount,
          currency: transaction.currency,
          status: transaction.status,
          customer: transaction.customer,
          metadata: transaction.meta,
          timestamp: transaction.created_at
        };
      } else {
        throw new Error(response.message || 'Failed to verify Flutterwave transaction');
      }
    } catch (error) {
      console.error('Flutterwave verification error:', error);
      throw this.formatError(error, 'flutterwave');
    }
  }

  /**
   * Refund Flutterwave transaction
   * @param {string} transactionId - Flutterwave transaction ID
   * @param {number} amount - Amount to refund (optional, full refund if not specified)
   * @returns {Promise<Object>} Refund response
   */
  async refundFlutterwaveTransaction(transactionId, amount = null) {
    try {
      const payload = {
        amount: amount
      };

      const response = await this.makeRequest(
        'POST',
        `${this.flutterwave.baseUrl}/transactions/${transactionId}/refund`,
        amount ? payload : {},
        {
          Authorization: `Bearer ${this.flutterwave.secretKey}`
        }
      );

      if (response.status === 'success') {
        return {
          success: true,
          provider: 'flutterwave',
          transactionId: transactionId,
          refundId: response.data.id,
          amount: response.data.amount,
          status: response.data.status,
          timestamp: new Date().toISOString()
        };
      } else {
        throw new Error(response.message || 'Failed to refund Flutterwave transaction');
      }
    } catch (error) {
      console.error('Flutterwave refund error:', error);
      throw this.formatError(error, 'flutterwave');
    }
  }

  /**
   * Get Flutterwave account balance
   * @returns {Promise<Object>} Account balance
   */
  async getFlutterwaveBalance() {
    try {
      const response = await this.makeRequest(
        'GET',
        `${this.flutterwave.baseUrl}/balances`,
        null,
        {
          Authorization: `Bearer ${this.flutterwave.secretKey}`
        }
      );

      if (response.status === 'success') {
        return {
          success: true,
          provider: 'flutterwave',
          balance: response.data,
          timestamp: new Date().toISOString()
        };
      } else {
        throw new Error(response.message || 'Failed to fetch Flutterwave balance');
      }
    } catch (error) {
      console.error('Flutterwave balance fetch error:', error);
      throw this.formatError(error, 'flutterwave');
    }
  }

  /**
   * PAYSTACK INTEGRATION
   */

  /**
   * Initialize Paystack transaction
   * @param {Object} payload - Transaction details
   * @returns {Promise<Object>} Transaction response
   */
  async initializePaystack(payload) {
    try {
      const {
        amount,
        email,
        fullName,
        currency = 'NGN',
        description = 'Payment',
        reference = this.generateReference(),
        metadata = {}
      } = payload;

      // Validate required fields
      this.validatePaystackPayload({ amount, email, fullName });

      const response = await this.makeRequest('POST', `${this.paystack.baseUrl}/transaction/initialize`, {
        reference: reference,
        amount: Math.round(amount * 100), // Paystack expects amount in kobo/cents
        email: email,
        currency: currency,
        description: description,
        metadata: {
          ...metadata,
          customer_name: fullName
        },
        callback_url: process.env.PAYSTACK_CALLBACK_URL || `${process.env.APP_URL}/payment/callback/paystack`
      }, {
        Authorization: `Bearer ${this.paystack.secretKey}`
      });

      if (response.status) {
        return {
          success: true,
          provider: 'paystack',
          reference: reference,
          link: response.data.authorization_url,
          accessCode: response.data.access_code,
          amount: amount,
          currency: currency,
          timestamp: new Date().toISOString()
        };
      } else {
        throw new Error(response.message || 'Failed to initialize Paystack payment');
      }
    } catch (error) {
      console.error('Paystack initialization error:', error);
      throw this.formatError(error, 'paystack');
    }
  }

  /**
   * Verify Paystack transaction
   * @param {string} reference - Paystack transaction reference
   * @returns {Promise<Object>} Transaction details
   */
  async verifyPaystackTransaction(reference) {
    try {
      const response = await this.makeRequest(
        'GET',
        `${this.paystack.baseUrl}/transaction/verify/${reference}`,
        null,
        {
          Authorization: `Bearer ${this.paystack.secretKey}`
        }
      );

      if (response.status) {
        const transaction = response.data;
        return {
          success: transaction.status === 'success',
          provider: 'paystack',
          reference: transaction.reference,
          transactionId: transaction.id,
          amount: transaction.amount / 100, // Convert from kobo/cents
          currency: transaction.currency,
          status: transaction.status,
          customer: transaction.customer,
          metadata: transaction.metadata,
          timestamp: transaction.created_at
        };
      } else {
        throw new Error(response.message || 'Failed to verify Paystack transaction');
      }
    } catch (error) {
      console.error('Paystack verification error:', error);
      throw this.formatError(error, 'paystack');
    }
  }

  /**
   * Refund Paystack transaction
   * @param {string} reference - Paystack transaction reference
   * @param {number} amount - Amount to refund in base currency
   * @returns {Promise<Object>} Refund response
   */
  async refundPaystackTransaction(reference, amount = null) {
    try {
      const payload = {
        transaction: reference
      };

      if (amount) {
        payload.amount = Math.round(amount * 100); // Convert to kobo/cents
      }

      const response = await this.makeRequest(
        'POST',
        `${this.paystack.baseUrl}/refund`,
        payload,
        {
          Authorization: `Bearer ${this.paystack.secretKey}`
        }
      );

      if (response.status) {
        return {
          success: true,
          provider: 'paystack',
          reference: reference,
          refundId: response.data.id,
          amount: response.data.amount / 100,
          status: response.data.status,
          timestamp: new Date().toISOString()
        };
      } else {
        throw new Error(response.message || 'Failed to refund Paystack transaction');
      }
    } catch (error) {
      console.error('Paystack refund error:', error);
      throw this.formatError(error, 'paystack');
    }
  }

  /**
   * Get Paystack account balance
   * @returns {Promise<Object>} Account balance
   */
  async getPaystackBalance() {
    try {
      const response = await this.makeRequest(
        'GET',
        `${this.paystack.baseUrl}/balance`,
        null,
        {
          Authorization: `Bearer ${this.paystack.secretKey}`
        }
      );

      if (response.status) {
        return {
          success: true,
          provider: 'paystack',
          balance: response.data,
          timestamp: new Date().toISOString()
        };
      } else {
        throw new Error(response.message || 'Failed to fetch Paystack balance');
      }
    } catch (error) {
      console.error('Paystack balance fetch error:', error);
      throw this.formatError(error, 'paystack');
    }
  }

  /**
   * UTILITY METHODS
   */

  /**
   * Make HTTP request to payment API
   * @private
   */
  async makeRequest(method, url, data = null, headers = {}) {
    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        timeout: this.timeout
      };

      if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(url, options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || `HTTP ${response.status} error`);
      }

      return responseData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Generate unique transaction reference
   * @private
   */
  generateReference() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `TXN-${timestamp}-${random}`.toUpperCase();
  }

  /**
   * Validate Flutterwave payload
   * @private
   */
  validateFlutterwavePayload(payload) {
    const { amount, email, phone, fullName } = payload;

    if (!amount || amount <= 0) {
      throw new Error('Invalid amount: must be greater than 0');
    }
    if (!email || !this.isValidEmail(email)) {
      throw new Error('Invalid email address');
    }
    if (!phone || !this.isValidPhone(phone)) {
      throw new Error('Invalid phone number');
    }
    if (!fullName || fullName.trim().length === 0) {
      throw new Error('Full name is required');
    }
  }

  /**
   * Validate Paystack payload
   * @private
   */
  validatePaystackPayload(payload) {
    const { amount, email, fullName } = payload;

    if (!amount || amount <= 0) {
      throw new Error('Invalid amount: must be greater than 0');
    }
    if (!email || !this.isValidEmail(email)) {
      throw new Error('Invalid email address');
    }
    if (!fullName || fullName.trim().length === 0) {
      throw new Error('Full name is required');
    }
  }

  /**
   * Validate email format
   * @private
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number format
   * @private
   */
  isValidPhone(phone) {
    const phoneRegex = /^[0-9+\-\s()]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  }

  /**
   * Format error response
   * @private
   */
  formatError(error, provider) {
    return {
      success: false,
      provider: provider,
      error: error.message || 'Unknown error occurred',
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Handle webhook callback
   * @param {Object} payload - Webhook payload
   * @param {string} provider - Payment provider (flutterwave or paystack)
   * @param {string} signature - Webhook signature for verification
   * @returns {Promise<Object>} Processed webhook data
   */
  async handleWebhookCallback(payload, provider, signature) {
    try {
      // Verify webhook signature
      if (provider === 'flutterwave') {
        this.verifyFlutterwaveWebhook(payload, signature);
      } else if (provider === 'paystack') {
        this.verifyPaystackWebhook(payload, signature);
      }

      return {
        success: true,
        provider: provider,
        data: payload,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Webhook callback error:', error);
      throw error;
    }
  }

  /**
   * Verify Flutterwave webhook signature
   * @private
   */
  verifyFlutterwaveWebhook(payload, signature) {
    const crypto = require('crypto');
    const hash = crypto
      .createHmac('sha256', this.flutterwave.secretKey)
      .update(JSON.stringify(payload))
      .digest('hex');

    if (hash !== signature) {
      throw new Error('Invalid Flutterwave webhook signature');
    }
  }

  /**
   * Verify Paystack webhook signature
   * @private
   */
  verifyPaystackWebhook(payload, signature) {
    const crypto = require('crypto');
    const hash = crypto
      .createHmac('sha256', this.paystack.secretKey)
      .update(JSON.stringify(payload))
      .digest('hex');

    if (hash !== signature) {
      throw new Error('Invalid Paystack webhook signature');
    }
  }
}

// Export for use in Node.js environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PaymentGateway;
}

// Example usage documentation
/**
 * USAGE EXAMPLES:
 * 
 * // Initialize Payment Gateway
 * const paymentGateway = new PaymentGateway({
 *   flutterwave: {
 *     publicKey: 'your_flutterwave_public_key',
 *     secretKey: 'your_flutterwave_secret_key'
 *   },
 *   paystack: {
 *     publicKey: 'your_paystack_public_key',
 *     secretKey: 'your_paystack_secret_key'
 *   }
 * });
 *
 * // Initialize Flutterwave Transaction
 * const flutterwavePayment = await paymentGateway.initializeFlutterwave({
 *   amount: 5000,
 *   email: 'customer@example.com',
 *   phone: '+2348012345678',
 *   fullName: 'John Doe',
 *   currency: 'NGN',
 *   description: 'Trading Account Deposit',
 *   metadata: { account_id: 'ACC123' }
 * });
 *
 * // Initialize Paystack Transaction
 * const paystackPayment = await paymentGateway.initializePaystack({
 *   amount: 5000,
 *   email: 'customer@example.com',
 *   fullName: 'John Doe',
 *   currency: 'NGN',
 *   description: 'Trading Account Deposit',
 *   metadata: { account_id: 'ACC123' }
 * });
 *
 * // Verify Flutterwave Transaction
 * const flutterwaveVerification = await paymentGateway.verifyFlutterwaveTransaction('transactionId');
 *
 * // Verify Paystack Transaction
 * const paystackVerification = await paymentGateway.verifyPaystackTransaction('reference');
 *
 * // Refund Flutterwave Transaction
 * const flutterwaveRefund = await paymentGateway.refundFlutterwaveTransaction('transactionId', 2500);
 *
 * // Refund Paystack Transaction
 * const paystackRefund = await paymentGateway.refundPaystackTransaction('reference', 2500);
 *
 * // Get Account Balance
 * const flutterwaveBalance = await paymentGateway.getFlutterwaveBalance();
 * const paystackBalance = await paymentGateway.getPaystackBalance();
 */

// Flutterwave Payment Integration
// Get your keys at: https://dashboard.flutterwave.com

const FLUTTERWAVE_PUBLIC_KEY = (typeof window !== 'undefined' && window.FLUTTERWAVE_PUBLIC_KEY) ? window.FLUTTERWAVE_PUBLIC_KEY : 'FLWPUBK-xxxxxxxxxxxxxxxxxxxx-X';
const PAYMENT_SUCCESS_URL = (typeof window !== 'undefined' && window.PAYMENT_SUCCESS_URL) ? window.PAYMENT_SUCCESS_URL : null;

const products = {
    monthly: { name: 'VIP Monthly Signals', amount: 29, currency: 'USD' },
    yearly: { name: 'VIP Yearly Signals', amount: 149, currency: 'USD' },
    course: { name: 'Forex Mastery Course', amount: 97, currency: 'USD' },
    ebook: { name: 'Price Action Ebook', amount: 27, currency: 'USD' },
    journal: { name: 'Trading Journal Template', amount: 15, currency: 'USD' },
    mentorship: { name: 'Starter Coaching (30 mins)', amount: 29, currency: 'USD' },
    mentorship_pro: { name: 'Pro Mentorship (60 mins)', amount: 59, currency: 'USD' },
    mentorship_monthly: { name: 'Monthly Coaching (4 sessions)', amount: 149, currency: 'USD' },
    contest_entry: { name: 'Trading Contest Entry', amount: 10, currency: 'USD' },
    community_membership: { name: 'Premium Community Membership', amount: 9, currency: 'USD' }
};

function payWithFlutterwave(productId) {
    const product = products[productId];
    
    FlutterwaveCheckout({
        public_key: FLUTTERWAVE_PUBLIC_KEY,
        tx_ref: 'XPERT-' + Date.now(),
        amount: product.amount,
        currency: product.currency,
        payment_options: 'card, mobilemoney, ussd, banktransfer',
        customer: {
            email: '', // Collected from user
            name: '',
        },
        customizations: {
            title: 'Xpert Forex Trade',
            description: product.name,
            logo: 'https://xpertforextrad.eu/images/logo.png',
        },
        callback: function(data) {
            // Payment successful
            console.log('Payment successful:', data);
            handlePaymentSuccess(productId, data);
        },
        onclose: function() {
            console.log('Payment modal closed');
        }
    });
}

// Alternative: Paystack for Nigerian users
const PAYSTACK_PUBLIC_KEY = (typeof window !== 'undefined' && window.PAYSTACK_PUBLIC_KEY) ? window.PAYSTACK_PUBLIC_KEY : 'pk_live_xxxxxxxxxxxxxxxxxxxxxxxxx';

function payWithPaystack(productId) {
    const product = products[productId];
    
    let handler = PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: '', // Collect from user
        amount: product.amount * 100, // Paystack uses kobo/cents
        currency: product.currency === 'USD' ? 'USD' : 'NGN',
        ref: 'XPERT-' + Date.now(),
        metadata: {
            product_id: productId,
            product_name: product.name
        },
        callback: function(response) {
            handlePaymentSuccess(productId, response);
        },
        onClose: function() {
            console.log('Payment cancelled');
        }
    });
    handler.openIframe();
}

function handlePaymentSuccess(productId, data) {
    // Send to your backend/webhook
    if (PAYMENT_SUCCESS_URL) {
        try {
            fetch(PAYMENT_SUCCESS_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId,
                    transactionRef: data.tx_ref || data.reference,
                    timestamp: new Date().toISOString()
                }),
                keepalive: true
            }).catch(function(){});
        } catch (e) {}
    }
    
    // Show success message
    alert('🎉 Payment successful! Check your email for access details.');
    if (window.entitlements && typeof window.entitlements.grant === 'function') {
        window.entitlements.grant(productId);
        // Grant VIP for monthly/yearly
        if (productId === 'monthly' || productId === 'yearly') {
            window.entitlements.grant('vip');
        }
        if (productId === 'community_membership') {
            window.entitlements.grant('community_premium');
        }
    }
    
    // Redirect based on product
    if (productId === 'monthly' || productId === 'yearly') {
        window.location.href = '/pages/vip-welcome.html';
    } else {
        window.location.href = '/pages/download.html?product=' + productId;
    }
}

// Email collection before payment
function collectEmailAndPay(productId) {
    const email = prompt('Enter your email to receive your purchase:');
    if (email && email.includes('@')) {
        payWithFlutterwave(productId);
    } else {
        alert('Please enter a valid email address');
    }
}

// Test helper: simulate a successful payment without hitting gateways
function simulatePaymentSuccess(productId) {
    var fakeData = { tx_ref: 'TEST-' + Date.now() };
    handlePaymentSuccess(productId, fakeData);
}

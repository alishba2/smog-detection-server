

const Technician = require('../models/Technician');



// ==============================================================================
// SQUARE PAYMENT GATEWAY FUNCTIONS==============================================
// ==============================================================================
exports.squareRedirectOAuth = async (req, res) => {
    const clientId = process.env.SQUARE_CLIENT_ID;
    const redirectUri = encodeURIComponent('http://localhost:8000/auth/square/callback');
    const state = req.session.technicianId; // or use JWT
    const url = `https://connect.squareupsandbox.com/oauth2/authorize?client_id=${clientId}&scope=PAYMENTS_WRITE+CUSTOMERS_READ&session=false&state=${state}&redirect_uri=${redirectUri}`;
    res.redirect(url);
}


exports.squareAuthCallback = async (req, res) => {
    const { code, state } = req.query; // `state` = technicianId

    const response = await fetch('https://connect.squareupsandbox.com/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            client_id: process.env.SQUARE_CLIENT_ID,
            client_secret: process.env.SQUARE_CLIENT_SECRET,
            code,
            grant_type: 'authorization_code',
        }),
    });

    const data = await response.json();

    if (data.access_token) {
        await Technician.findByIdAndUpdate(state, {
            squareAccessToken: data.access_token,
            squareMerchantId: data.merchant_id,
        });
        res.send('Square connected successfully!');
    } else {
        res.status(400).send('Error connecting Square');
    }
}

// ==============================================================================
// PAYPAL PAYMENT GATEWAY FUNCTIONS==============================================
// ==============================================================================

const PAYPAL_CLIENT_ID = "AWnfzxJvCbeV7O6ODcgvCAPkGf8ofgl9asNQE2n_-6g4YjpKSq-TyZvoQE3cJA-HiDM2nFFKvHUY-2wF";
const PAYPAL_CLIENT_SECRET = "EPZZn2JPnAeNmyCF5gSZrC-wLw4OcebJYwhd7TaVFdKNuObwJ9vExltkREL2hxqP4KaH8dA_bYPLF-zn";
const PAYPAL_REDIRECT_URI = 'http://localhost:8000/api/payment/paypal/callback';
exports.paypalRedirectOAuth = async (req, res) => {

    console.log(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET)
    const paypalUrl = `https://www.paypal.com/connect?flowEntry=static&client_id=${PAYPAL_CLIENT_ID}&redirect_uri=${encodeURIComponent(PAYPAL_REDIRECT_URI)}`;
    res.redirect(paypalUrl);
}

exports.paypalCallback = async (req, res) => {
    const { code, state } = req.query; // PayPal redirects with 'code' parameter

    try {
        // Step 3: Exchange authorization code for an access token
        const response = await axios.post(' https://api-m.sandbox.paypal.com/v1/oauth2/token', null, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            auth: {
                username: PAYPAL_CLIENT_ID,
                password: PAYPAL_CLIENT_SECRET,
            },
            params: {
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: PAYPAL_REDIRECT_URI,
            },
        });

        // Step 4: Get access token from PayPal response
        const { access_token, refresh_token, token_type } = response.data;


        await Technician.findByIdAndUpdate(state, {
            payPalAccessToken: access_token,
            paypalRefreshToken: refresh_token,
            paypalTokenType: token_type
        });

        // For now, just return the access token
        res.json({
            message: 'PayPal account connected successfully!',
            access_token,
            refresh_token,
            token_type,
        });
    } catch (error) {
        console.error('Error connecting PayPal:', error);
        res.status(500).json({ message: 'Error connecting PayPal account' });
    }
};

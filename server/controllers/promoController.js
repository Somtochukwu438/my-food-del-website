const promoCodes = {
    'SAVE10': 0.10, // 10% discount
    'SAVE20': 0.20, // 20% discount
    'WELCOME': 0.15  // 15% discount
  };
  
  const validatePromoCode = (req, res) => {
    const { code } = req.body;
    console.log(`Promo Code Received: ${code}`); // Log the received promo code
  
    if (promoCodes.hasOwnProperty(code)) {
      console.log(`Promo Code Valid: ${code} with discount: ${promoCodes[code]}`);
      res.json({
        valid: true,
        discount: promoCodes[code]
      });
    } else {
      console.log(`Promo Code Invalid: ${code}`);
      res.json({
        valid: false,
        message: 'Invalid promo code'
      });
    }
  };
  
  export { validatePromoCode };
  
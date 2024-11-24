// import React, { useContext } from 'react'
// import './Cart.css'
// import { StoreContext } from '../../Context/StoreContext'
// import { useNavigate } from 'react-router-dom';

// const Cart = () => {

//   const {cartItems, food_list, removeFromCart,getTotalCartAmount,url,currency,deliveryCharge} = useContext(StoreContext);
//   const navigate = useNavigate();

//   return (
//     <div className='cart'>
//       <div className="cart-items">
//         <div className="cart-items-title">
//           <p>Items</p> <p>Title</p> <p>Price</p> <p>Quantity</p> <p>Total</p> <p>Remove</p>
//         </div>
//         <br />
//         <hr />
//         {food_list.map((item, index) => {
//           if (cartItems[item._id]>0) {
//             return (<div key={index}>
//               <div className="cart-items-title cart-items-item">
//                 <img src={url+"/images/"+item.image} alt="" />
//                 <p>{item.name}</p>
//                 <p>{currency}{item.price}</p>
//                 <div>{cartItems[item._id]}</div>
//                 <p>{currency}{item.price*cartItems[item._id]}</p>
//                 <p className='cart-items-remove-icon' onClick={()=>removeFromCart(item._id)}>x</p>
//               </div>
//               <hr />
//             </div>)
//           }
//         })}
//       </div>
//       <div className="cart-bottom">
//         <div className="cart-total">
//           <h2>Cart Totals</h2>
//           <div>
//             <div className="cart-total-details"><p>Subtotal</p><p>{currency}{getTotalCartAmount()}</p></div>
//             <hr />
//             <div className="cart-total-details"><p>Delivery Fee</p><p>{currency}{getTotalCartAmount()===0?0:deliveryCharge}</p></div>
//             <hr />
//             <div className="cart-total-details"><b>Total</b><b>{currency}{getTotalCartAmount()===0?0:getTotalCartAmount()+deliveryCharge}</b></div>
//           </div>
//           <button onClick={()=>navigate('/order')}>PROCEED TO CHECKOUT</button>
//         </div>
//         <div className="cart-promocode">
//           <div>
//             <p>If you have a promo code, Enter it here</p>
//             <div className='cart-promocode-input'>
//               <input type="text" placeholder='promo code'/>
//               <button>Submit</button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Cart
// import React, { useContext, useState } from 'react';
// import './Cart.css';
// import { StoreContext } from '../../Context/StoreContext';
// import { useNavigate } from 'react-router-dom';

// const Cart = () => {
//   const {
//     cartItems,
//     food_list,
//     removeFromCart,
//     getTotalCartAmount,
//     url,
//     currency,
//     deliveryCharge
//   } = useContext(StoreContext);

//   const navigate = useNavigate();
  
//   // New state for promo code handling
//   const [promoInput, setPromoInput] = useState('');
//   const [promoDiscount, setPromoDiscount] = useState(0);
//   const [promoMessage, setPromoMessage] = useState('');
//   const [isValidating, setIsValidating] = useState(false);

//   // Predefined promo codes (you can move this to backend later)
//   const validPromoCodes = {
//     'SAVE10': 0.10,
//     'SAVE20': 0.20,
//     'WELCOME': 0.15
//   };

//   // Calculate totals
//   const subtotal = getTotalCartAmount();
//   const discount = subtotal * promoDiscount;
//   const discountedSubtotal = subtotal - discount;
//   const finalTotal = discountedSubtotal + (subtotal === 0 ? 0 : deliveryCharge);

//   const handlePromoSubmit = () => {
//     setIsValidating(true);
//     const code = promoInput.trim().toUpperCase();

//     // Simulate backend validation
//     setTimeout(() => {
//       if (validPromoCodes.hasOwnProperty(code)) {
//         setPromoDiscount(validPromoCodes[code]);
//         setPromoMessage(`${validPromoCodes[code] * 100}% discount applied!`);
//       } else {
//         setPromoDiscount(0);
//         setPromoMessage('Invalid promo code. Please try again.');
//       }
//       setIsValidating(false);
//     }, 500);
//   };

//   return (
//     <div className='cart'>
//       <div className="cart-items">
//         <div className="cart-items-title">
//           <p>Items</p>
//           <p>Title</p>
//           <p>Price</p>
//           <p>Quantity</p>
//           <p>Total</p>
//           <p>Remove</p>
//         </div>
//         <br />
//         <hr />
//         {food_list.map((item, index) => {
//           if (cartItems[item._id] > 0) {
//             return (
//               <div key={index}>
//                 <div className="cart-items-title cart-items-item">
//                   <img src={url + "/images/" + item.image} alt="" />
//                   <p>{item.name}</p>
//                   <p>{currency}{item.price}</p>
//                   <div>{cartItems[item._id]}</div>
//                   <p>{currency}{item.price * cartItems[item._id]}</p>
//                   <p className='cart-items-remove-icon' onClick={() => removeFromCart(item._id)}>x</p>
//                 </div>
//                 <hr />
//               </div>
//             )
//           }
//           return null;
//         })}
//       </div>
//       <div className="cart-bottom">
//         <div className="cart-total">
//           <h2>Cart Totals</h2>
//           <div>
//             <div className="cart-total-details">
//               <p>Subtotal</p>
//               <p>{currency}{subtotal}</p>
//             </div>
//             <hr />
//             {promoDiscount > 0 && (
//               <>
//                 <div className="cart-total-details">
//                   <p>Discount</p>
//                   <p>-{currency}{discount.toFixed(2)}</p>
//                 </div>
//                 <hr />
//               </>
//             )}
//             <div className="cart-total-details">
//               <p>Delivery Fee</p>
//               <p>{currency}{subtotal === 0 ? 0 : deliveryCharge}</p>
//             </div>
//             <hr />
//             <div className="cart-total-details">
//               <b>Total</b>
//               <b>{currency}{finalTotal.toFixed(2)}</b>
//             </div>
//           </div>
//           <button onClick={() => navigate('/order')}>PROCEED TO CHECKOUT</button>
//         </div>
//         <div className="cart-promocode">
//           <div>
//             <p>If you have a promo code, Enter it here</p>
//             <div className='cart-promocode-input'>
//               <input
//                 type="text"
//                 placeholder='promo code'
//                 value={promoInput}
//                 onChange={(e) => setPromoInput(e.target.value)}
//               />
//               <button 
//                 onClick={handlePromoSubmit}
//                 disabled={isValidating || !promoInput.trim()}
//               >
//                 {isValidating ? 'Validating...' : 'Submit'}
//               </button>
//             </div>
//             {promoMessage && (
//               <p className={`promo-message ${promoDiscount > 0 ? 'success' : 'error'}`}>
//                 {promoMessage}
//               </p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cart;
import React, { useContext, useState } from 'react';
import './Cart.css';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const {
    cartItems,
    food_list,
    removeFromCart,
    getTotalCartAmount,
    validatePromoCode,
    setPromoCode,
    promoDiscount,
    promoCode,
    url,
    currency,
    deliveryCharge,
  } = useContext(StoreContext);

  const navigate = useNavigate();

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  
  const subtotal = getTotalCartAmount();
  const discount = subtotal * promoDiscount;
  const discountedSubtotal = subtotal - discount;
  const finalTotal = discountedSubtotal + (subtotal === 0 ? 0 : deliveryCharge);

  const handlePromoSubmit = async () => {
    setIsValidating(true);
    const code = promoInput.trim().toUpperCase();
    const req = { code: code };
    console.log(req);
    const isValid = await validatePromoCode(req);
    console.log(isValid);
    console.log(promoDiscount);
    if (isValid) {
      setPromoCode(code);
      setPromoMessage(`${promoDiscount * 100}% discount applied!`);
    } else {
      setPromoMessage('Invalid promo code. Please try again.');
    }
    setIsValidating(false);
  };

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={index}>
                <div className="cart-items-title cart-items-item">
                  <img src={url + "/images/" + item.image} alt="" />
                  <p>{item.name}</p>
                  <p>{currency}{item.price}</p>
                  <div>{cartItems[item._id]}</div>
                  <p>{currency}{item.price * cartItems[item._id]}</p>
                  <p className='cart-items-remove-icon' onClick={() => removeFromCart(item._id)}>x</p>
                </div>
                <hr />
              </div>
            )
          }
          return null;
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>{currency}{subtotal}</p>
            </div>
            <hr />
            {promoDiscount > 0 && (
              <>
                <div className="cart-total-details">
                  <p>Discount</p>
                  <p>-{currency}{discount.toFixed(2)}</p>
                </div>
                <hr />
              </>
            )}
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>{currency}{subtotal === 0 ? 0 : deliveryCharge}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>{currency}{finalTotal.toFixed(2)}</b>
            </div>
          </div>
          <button onClick={() => navigate('/order')}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, Enter it here</p>
            <div className='cart-promocode-input'>
              <input
                type="text"
                placeholder='promo code'
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
              />
              <button 
                onClick={handlePromoSubmit}
                disabled={isValidating || !promoInput.trim()}
              >
                {isValidating ? 'Done' : 'Submit'}
              </button>
            </div>
            {promoMessage && (
              <p className={`promo-message ${promoDiscount > 0 ? 'success' : 'error'}`}>
                {promoMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

// import { createContext, useEffect, useState } from "react";
// import { food_list, menu_list } from "../assets/assets";
// import axios from "axios";
// export const StoreContext = createContext(null);

// const StoreContextProvider = (props) => {

//     const url = "http://localhost:4000"
//     const [food_list, setFoodList] = useState([]);
//     const [cartItems, setCartItems] = useState({});
//     const [token, setToken] = useState("")
//     const currency = "$";
//     const deliveryCharge = 5;

//     const addToCart = async (itemId) => {
//         if (!cartItems[itemId]) {
//             setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
//         }
//         else {
//             setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
//         }
//         if (token) {
//             await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
//         }
//     }

//     const removeFromCart = async (itemId) => {
//         setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
//         if (token) {
//             await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
//         }
//     }

//     const getTotalCartAmount = () => {
//         let totalAmount = 0;
//         for (const item in cartItems) {
//             try {
//               if (cartItems[item] > 0) {
//                 let itemInfo = food_list.find((product) => product._id === item);
//                 totalAmount += itemInfo.price * cartItems[item];
//             }  
//             } catch (error) {
                
//             }
            
//         }
//         return totalAmount;
//     }

//     const fetchFoodList = async () => {
//         const response = await axios.get(url + "/api/food/list");
//         setFoodList(response.data.data)
//     }

//     const loadCartData = async (token) => {
//         const response = await axios.post(url + "/api/cart/get", {}, { headers: token });
//         setCartItems(response.data.cartData);
//     }

//     useEffect(() => {
//         async function loadData() {
//             await fetchFoodList();
//             if (localStorage.getItem("token")) {
//                 setToken(localStorage.getItem("token"))
//                 await loadCartData({ token: localStorage.getItem("token") })
//             }
//         }
//         loadData()
//     }, [])

//     const contextValue = {
//         url,
//         food_list,
//         menu_list,
//         cartItems,
//         addToCart,
//         removeFromCart,
//         getTotalCartAmount,
//         token,
//         setToken,
//         loadCartData,
//         setCartItems,
//         currency,
//         deliveryCharge
//     };

//     return (
//         <StoreContext.Provider value={contextValue}>
//             {props.children}
//         </StoreContext.Provider>
//     )

// }

// export default StoreContextProvider;
import { createContext, useEffect, useState } from "react";
import { menu_list } from "../assets/assets";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const url = "https://gourmet-express-server.onrender.com"
    const [food_list, setFoodList] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [userName, setUserName] = useState(""); // Only store the user's name
    const currency = "$";
    const deliveryCharge = 5;
    const [promoDiscount, setPromoDiscount] = useState(0);
    const [promoCode, setPromoCode] = useState('');
    
    const validatePromoCode = async (code) => {
      try {
        const response = await fetch(`${url}/api/promo/validate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(code)
        });
        
        const data = await response.json();
        if (data.valid) {
          setPromoDiscount(data.discount);
          setPromoCode(code.code);
          return {valid: true, discount: data.discount, code: code.code};
        }
        else{
          return false;}
      } catch (error) {
        console.error('Error validating promo code:', error);
        return false;
      }
    };
  
    const getDiscountedTotal = () => {
      const subtotal = getTotalCartAmount();
      const discountAmount = subtotal * promoDiscount;
      return subtotal - discountAmount;
    };

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        }
        else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
        if (token) {
            await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            try {
                if (cartItems[item] > 0) {
                    let itemInfo = food_list.find((product) => product._id === item);
                    totalAmount += itemInfo.price * cartItems[item];
                }
            } catch (error) {
                console.error("Error calculating total amount for item:", item);
            }
        }
        return totalAmount;
    }

    const fetchFoodList = async () => {
        try {
            const response = await axios.get(url + "/api/food/list");
            setFoodList(response.data.data);
        } catch (error) {
            console.error("Error fetching food list:", error);
        }
    }

    const loadCartData = async (tokenObj) => {
        try {
            const response = await axios.post(url + "/api/cart/get", {}, { headers: tokenObj });
            setCartItems(response.data.cartData);
        } catch (error) {
            console.error("Error loading cart data:", error);
        }
    }

    const fetchUserName = async () => {
        if (token) {
            try {
                const response = await axios.get(`${url}/api/user/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.data.success) {
                    setUserName(response.data.user.name);
                }
            } catch (error) {
                console.error('Error fetching user name:', error);
                logout();
            }
        }
    };
    

    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        setUserName("");
        setCartItems({});
    };

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            if (token) {
                await Promise.all([
                    loadCartData({ token }),
                    fetchUserName()
                ]);
            }
        }
        loadData();
    }, [token]);
    
    const contextValue = {
        validatePromoCode,
        getDiscountedTotal,
        promoDiscount,
        promoCode,
        url,
        food_list,
        menu_list,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        token,
        setToken,
        loadCartData,
        setCartItems,
        currency,
        deliveryCharge,
        userName,  // Only expose userName instead of full userData
        logout
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;

# 🛍️ Sellora E-Commerce Angular Application

**Sellora** is a complete, responsive e-commerce web application built with **Angular 19**, **Tailwind CSS**, and the [Route E-Commerce API](https://ecommerce.routemisr.com). It offers a seamless user experience with cart management, wishlisting, ordering, authentication, localization, and more.

---

## 🚀 Features

### 👤 Authentication & Password Management
- Register/Login with form validation and token-based authentication
- **Forgot password**: user submits email, receives a reset code
- **Reset password** using the received verification code
- **Form validation alerts** on every input (required, pattern, match, etc.)
- **Route Guards**:
  - Block access to login/register if the user is already logged in
  - Block access to protected routes (home, cart, wishlist, orders, checkout, etc.) if not logged in
- Logout functionality

### 🛒 Shopping Experience
- Browse products by category and brand
- Product detail view with add to cart/wishlist
- Responsive product listing with pagination
- Dynamic filtering and sorting
- Search functionality
- Search & Sort implemented using Angular Pipes

### 🧺 Cart Management
- Add/remove/update product quantity
- Cart subtotal, shipping, and total price
- Clear entire cart
- Checkout redirection
- Cart state persists

### ❤️ Wishlist
- Add/remove products from the wishlist
- Persistent red heart icon state
- Add wishlist products directly to the cart
- Wishlist page showing all liked products

### 📦 Orders
- Fetch current user orders
- Each order includes items, quantity, payment status, and delivery status
- Order details: address, mobile, total, payment method, tax, shipping, date 
- Clean, responsive UI for order tracking (paid/unpaid, delivered/pending)

### 🌐 Localization (i18n)
- Full support for English and Arabic
- Direction support (LTR/RTL)
- Language switcher in the navbar

### ⚙️ Interceptors
- **Header Interceptor**: adds consistent headers (attaches the token to all outgoing HTTP requests)
- **Loading Interceptor**: global loading spinner for all HTTP requests
- **Error Interceptor**: handles and displays API errors globally with toast alerts

### 💡 UX Enhancements
- Toast notifications for success/error messages
- Loading states
- Empty page messages

## 🧠 Custom Features

- **Search Pipe**: Filters the product list by name or category
- **Sort Pipe**: Sorts product list by price or alphabetically
- **Route Guards**: Handles secure navigation based on login state
- **Custom Toastr Alerts**: Used in cart, wishlist, errors, and success actions
- **Heart State Persistence**: Wishlist icon retains state across refresh
  
---

## 📦 Folder Structure

The project is well-organized with core, layout, pages, shared components, services, and interceptors separated by concern, following Angular best practices.

---

## 🛠️ Tech Stack

| Tech         | Description                        |
|--------------|------------------------------------|
| Angular 19 | Front-end Framework                |
| Tailwind CSS | Utility-first CSS                  |
| ngx-translate| Internationalization               |
| RxJS         | Reactive Programming               |
| Font Awesome | Icon Library                       |
| Toastr       | Notifications                      |
| Flowbite     | Tailwind Components Library        |
| Route API    | [Route E-Commerce API](https://ecommerce.routemisr.com) |

---

## 📦 Installation & Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/sellora-ecommerce.git
   cd sellora-ecommerce
   
1. **Install dependencies**
   ```bash
   npm install

1. **Run the app**
   ```bash
   ng serve


   
🧑‍💻 Author
Salma Sherif
Front-End Angular Developer
• GitHub: https://github.com/SalmaSherif1 
• LinkedIn: https://www.linkedin.com/in/salma-sherif-191420262

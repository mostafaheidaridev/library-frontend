# Online Library

This is a front-end web application for an online library that loans e-books.  
It is developed using **HTML5, CSS3, and JavaScript** – no libraries or frameworks were used.

---

## 🎯 Project Purpose

This project is created as part of our semester exam. It shows how regular users and admins can interact with an online library system, connected to an API.

---

## 🔗 API

We use this backend API:  
[https://github.com/arturomorarioja/py_library_api_v3](https://github.com/arturomorarioja/py_library_api_v3)  
The data comes from an SQLite database and covers books, authors, publishers, and users.

---

## 👤 User Features

- Sign up with email and password (with validation)
- Log in and log out
- See random books and search by title
- See all authors and their books
- See details of a book (without loan history)
- When logged in:
  - Loan a book (30 days, if not already loaned)
  - Edit personal info (except password and member date)
  - Delete account

---

## 🛠️ Admin Features

- Log in as admin (`admin.library@mail.com` / `WebUdvikling25!`)
- When logged in:
  - See book details including loan history
  - Add books, authors, and publishers
  - Log out

---

## 🧪 Technical Notes

- Only uses HTML, CSS (with variables), and JavaScript
- Mobile-first, fully responsive design
- Accessibility: ARIA labels, keyboard support, color contrast
- Uses `sessionStorage` for login sessions
- Book covers are loaded from an external API 

---

## 📦 ESLint & Node.js

We use **ESLint** to keep our JavaScript clean and consistent.  
✅ **Important**: Make sure you install **Node.js v18 or higher** (LTS recommended) to avoid errors.

Install from: [https://nodejs.org](https://nodejs.org)

After installing:

npm install
npx eslint js/

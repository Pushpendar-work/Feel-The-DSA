# 🛠️ Installation & Setup Guide: DSA STORE

This document provides a complete, step-by-step guide to getting the **DSA STORE** running on your local machine.

---

## 📋 1. Machine Prerequisites
Before starting, ensure the following software is installed on your system:

### A. Python (Backend)
- **Version:** Python 3.8 or higher.
- **Check:** Open your terminal/cmd and type `python --version`.
- **Install:** Download from [python.org](https://www.python.org/downloads/). 
- **Important:** During installation on Windows, make sure to check the box **"Add Python to PATH"**.

### B. Node.js & npm (Frontend)
- **Version:** Node.js 16.x or higher.
- **Check:** Type `node -v` and `npm -v` in your terminal.
- **Install:** Download from [nodejs.org](https://nodejs.org/). (The LTS version is recommended).

### C. Git (Optional but Recommended)
- To clone the repository from GitHub.
- **Install:** Download from [git-scm.com](https://git-scm.com/).

---

## 🚀 2. Step-by-Step Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/Pushpendar-work/Feel-The-DSA.git
cd Feel-The-DSA
```

### Step 2: Setup the Backend (FastAPI)
1. **Navigate to the backend folder:**
   ```bash
   cd backend
   ```
2. **Create a Virtual Environment:**
   (This keeps the project dependencies isolated from your system)
   ```bash
   python -m venv venv
   ```
3. **Activate the Virtual Environment:**
   - **Windows:** `.\venv\Scripts\activate`
   - **Mac/Linux:** `source venv/bin/activate`
4. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
5. **Run the Server:**
   ```bash
   python main.py
   ```
   *The server will start at `http://localhost:8000`. Keep this terminal open!*

### Step 3: Setup the Frontend (React)
1. **Open a SECOND terminal window** (do not close the backend terminal).
2. **Navigate to the frontend folder:**
   ```bash
   cd frontend
   ```
3. **Install Node Modules:**
   ```bash
   npm install
   ```
4. **Start the Application:**
   ```bash
   npm start
   ```
   *The website will automatically open in your browser at `http://localhost:3000`.*

---

## 🧠 3. How to use the "Learning Mode"
Once the site is running:
1. Look at the top header and check the **"Dev Mode"** checkbox.
2. **Shopping Cart:** Add items and look at the "Dynamic Array" state in the right sidebar.
3. **Undo Feature:** Remove an item, then click "Undo Remove" to see the **Stack (LIFO)** in action.
4. **Catalog:** Look at the "Hash Map" state in the left sidebar to see how products are indexed for $O(1)$ lookup.
5. **Search:** Type a product name to see the **Trie** logic in Dev Mode.
6. **Support:** Create a VIP ticket to see how the **Binary Heap (Priority Queue)** prioritizes tickets.
7. **Price Filter:** Use the range filter to see how the **BST** optimizes the search.

---

## ⚠️ Troubleshooting
- **Port 8000 already in use?** Close any other Python apps or restart your computer.
- **npm install failing?** Ensure your Node.js version is up to date.
- **Python not recognized?** Ensure you checked "Add Python to PATH" during installation.

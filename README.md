# 🛒 DSA STORE - Feel the DSA by Pushpendar

A full-stack e-commerce application designed as a living laboratory for learning Data Structures and Algorithms (DSA). Instead of reading theory, you can interact with a real store where every feature is powered by a specific data structure.

## 🚀 The Core Concept: "Feel the DSA"
Most websites hide their internal logic. **DSA STORE** features a **"Dev Mode"** that peels back the UI to reveal how data is actually stored in memory and the time/space complexity of the operations you are performing.

### 🧠 DSA Mapping
| Feature | Data Structure | Why this structure? | Complexity |
| :--- | :--- | :--- | :--- |
| **Product Catalog** | `Hash Map` | Instant lookup of products by ID | $O(1)$ |
| **Shopping Cart** | `Dynamic Array` | Maintains order of items added | $O(1)$ append |
| **Cart Undo** | `Stack` | Last-removed item is first restored (LIFO) | $O(1)$ push/pop |
| **Order Pipeline** | `Queue` | First order placed is first processed (FIFO) | $O(1)$ enqueue/dequeue |
| **Support Tickets** | `Binary Heap` | VIP customers get priority over regular ones | $O(\log N)$ |
| **Categories** | `General Tree` | Hierarchical nesting of categories | $O(N)$ traversal |
| **Product Search** | `Trie` | Prefix-based searching (autocomplete style) | $O(L)$ where $L$ is word length |
| **Price Filter** | `Binary Search Tree` | Efficient range queries for prices | $O(\log N + K)$ |
| **Recommendations** | `Graph` | Products as nodes, "bought together" as edges | $O(1)$ neighbor lookup |

---

## 🛠️ Prerequisites
Before running the app, ensure you have the following installed:
- **Python 3.8+** (Backend)
- **Node.js & npm** (Frontend)

---

## 🏁 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/Pushpendar-work/Feel-The-DSA.git
cd Feel-The-DSA
```

### 2. Setup the Backend (FastAPI)
```bash
# Navigate to backend folder
cd backend

# Create and activate virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python main.py
```
*The backend will now be running at `http://localhost:8000`*

### 3. Setup the Frontend (React)
```bash
# Open a new terminal and navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start the React app
npm start
```
*The frontend will now be running at `http://localhost:3000`*

---

## 📖 How to Learn
1. **Open the App** and click the **"📖 How to use"** button for a guided roadmap.
2. **Enable "Dev Mode"** in the header.
3. **Interact with the store**:
   - Add items to the cart $\rightarrow$ See the **Dynamic Array** grow.
   - Remove an item and click **Undo** $\rightarrow$ See the **Stack** pop.
   - Create a VIP ticket $\rightarrow$ See the **Priority Queue** re-order.
   - Search for a product $\rightarrow$ See the **Trie** traverse characters.
   - Filter by price $\rightarrow$ Experience **BST** range searching.

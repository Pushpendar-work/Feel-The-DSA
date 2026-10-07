from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional, Any, Tuple
import heapq

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DATA STRUCTURES ---

# 1. HASH MAP (Product Catalog)
product_catalog: Dict[int, Dict] = {
    1: {"id": 1, "name": "Gaming Laptop", "price": 1200, "category": "Electronics"},
    2: {"id": 2, "name": "Mechanical Keyboard", "price": 150, "category": "Electronics"},
    3: {"id": 3, "name": "Wireless Mouse", "price": 80, "category": "Electronics"},
    4: {"id": 4, "name": "Coffee Mug", "price": 15, "category": "Home"},
    5: {"id": 5, "name": "Desk Lamp", "price": 45, "category": "Home"},
    6: {"id": 6, "name": "Office Chair", "price": 200, "category": "Home"},
    7: {"id": 7, "name": "Smart Watch", "price": 300, "category": "Electronics"},
}

# 2. DYNAMIC ARRAY (Shopping Cart)
shopping_cart: List[int] = []

# 3. STACK (Undo History)
undo_stack: List[int] = []

# 4. QUEUE (Order Pipeline)
order_queue: List[Dict] = []

# 5. PRIORITY QUEUE (VIP Support)
support_heap = []

# --- PHASE 4: NEW DATA STRUCTURES ---

# 6. BINARY SEARCH TREE (BST) for Price Filtering
# Why: BSTs allow us to find all products within a range in O(log N + K) time.
class BSTNode:
    def __init__(self, product):
        self.product = product
        self.price = product["price"]
        self.left = None
        self.right = None

class PriceBST:
    def __init__(self):
        self.root = None

    def insert(self, product):
        if not self.root:
            self.root = BSTNode(product)
        else:
            self._insert_recursive(self.root, product)

    def _insert_recursive(self, node, product):
        if product["price"] < node.price:
            if node.left is None: node.left = BSTNode(product)
            else: self._insert_recursive(node.left, product)
        else:
            if node.right is None: node.right = BSTNode(product)
            else: self._insert_recursive(node.right, product)

    def find_range(self, min_p, max_p, node=None, results=None):
        if results is None:
            results = []
            node = self.root

        if node is None:
            return results

        if node.price > min_p:
            self.find_range(min_p, max_p, node.left, results)
        if min_p <= node.price <= max_p:
            results.append(node.product)
        if node.price < max_p:
            self.find_range(min_p, max_p, node.right, results)
        return results

    def to_dict(self, node=None):
        if node is None: node = self.root
        if node is None: return None
        return {
            "product": node.product,
            "price": node.price,
            "left": self.to_dict(node.left),
            "right": self.to_dict(node.right)
        }

# 7. GRAPH (Recommendation Engine)
# Why: Products are Nodes, and "Bought Together" are Edges.
class ProductGraph:
    def __init__(self):
        # Adjacency List: { product_id: [related_product_ids] }
        self.adj_list: Dict[int, List[int]] = {pid: [] for pid in product_catalog}

    def add_edge(self, p1, p2):
        if p1 not in self.adj_list: self.adj_list[p1] = []
        if p2 not in self.adj_list: self.adj_list[p2] = []
        if p2 not in self.adj_list[p1]: self.adj_list[p1].append(p2)
        if p1 not in self.adj_list[p2]: self.adj_list[p2].append(p1)

    def get_recommendations(self, product_id):
        # Simple recommendation: return neighbors in the graph
        return self.adj_list.get(product_id, [])

# Initialize BST and Graph
price_bst = PriceBST()
for p in product_catalog.values():
    price_bst.insert(p)

rec_graph = ProductGraph()
# Mock some recommendations
rec_graph.add_edge(1, 2) # Laptop -> Keyboard
rec_graph.add_edge(1, 3) # Laptop -> Mouse
rec_graph.add_edge(2, 3) # Keyboard -> Mouse
rec_graph.add_edge(4, 5) # Mug -> Lamp
rec_graph.add_edge(5, 6) # Lamp -> Chair

# --- PREVIOUS STRUCTURES ---
class CategoryNode:
    def __init__(self, name: str):
        self.name = name
        self.children = []
    def add_child(self, node):
        self.children.append(node)
    def to_dict(self):
        return {"name": self.name, "children": [child.to_dict() for child in self.children]}

root_cat = CategoryNode("All Store")
electronics = CategoryNode("Electronics")
home = CategoryNode("Home")
root_cat.add_child(electronics)
root_cat.add_child(home)
electronics.add_child(CategoryNode("Laptops"))
electronics.add_child(CategoryNode("Accessories"))
home.add_child(CategoryNode("Furniture"))
home.add_child(CategoryNode("Kitchen"))

class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end_of_word = False
        self.product_ids = []

class Trie:
    def __init__(self):
        self.root = TrieNode()
    def insert(self, word: str, product_id: int):
        node = self.root
        for char in word.lower():
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
            node.product_ids.append(product_id)
        node.is_end_of_word = True
    def search_prefix(self, prefix: str):
        node = self.root
        for char in prefix.lower():
            if char not in node.children: return []
            node = node.children[char]
        return node.product_ids

search_trie = Trie()
for pid, product in product_catalog.items():
    search_trie.insert(product["name"], pid)

class CartItem(BaseModel):
    product_id: int

class SupportTicket(BaseModel):
    customer_id: int
    issue: str
    is_vip: bool

@app.get("/products")
async def get_products():
    return list(product_catalog.values())

@app.get("/categories")
async def get_categories():
    return root_cat.to_dict()

@app.get("/search")
async def search_products(q: str):
    product_ids = search_trie.search_prefix(q)
    return {
        "results": [product_catalog[pid] for pid in product_ids],
        "dev_info": {"prefix": q, "matching_ids": product_ids, "complexity": "O(L)"}
    }

@app.get("/filter")
async def filter_products(min_p: int, max_p: int):
    results = price_bst.find_range(min_p, max_p)
    return {
        "results": results,
        "dev_info": {
            "range": [min_p, max_p],
            "complexity": "O(log N + K)"
        }
    }

@app.get("/recommendations/{product_id}")
async def get_recs(product_id: int):
    rec_ids = rec_graph.get_recommendations(product_id)
    return {
        "results": [product_catalog[pid] for pid in rec_ids],
        "dev_info": {
            "product_id": product_id,
            "related_ids": rec_ids,
            "complexity": "O(1) lookup in Adj List"
        }
    }

@app.get("/bst_visual")
async def get_bst():
    return price_bst.to_dict()

@app.post("/cart/add")
async def add_to_cart(item: CartItem):
    if item.product_id not in product_catalog:
        raise HTTPException(status_code=404, detail="Product not found")
    shopping_cart.append(item.product_id)
    return {"message": "Added", "cart": shopping_cart}

@app.post("/cart/remove")
async def remove_from_cart(item: CartItem):
    if item.product_id in shopping_cart:
        idx = len(shopping_cart) - 1 - shopping_cart[::-1].index(item.product_id)
        removed_id = shopping_cart.pop(idx)
        undo_stack.append(removed_id)
        return {"message": "Removed", "cart": shopping_cart}
    raise HTTPException(status_code=404, detail="Item not in cart")

@app.post("/cart/undo")
async def undo_remove():
    if not undo_stack:
        raise HTTPException(status_code=400, detail="Nothing to undo")
    restored_id = undo_stack.pop()
    shopping_cart.append(restored_id)
    return {"message": f"Restored product {restored_id}", "cart": shopping_cart}

@app.get("/cart")
async def get_cart():
    return {
        "items": [product_catalog[pid] for pid in shopping_cart],
        "raw_structure": shopping_cart,
        "undo_stack": undo_stack
    }

@app.post("/cart/clear")
async def clear_cart():
    shopping_cart.clear()
    undo_stack.clear()
    return {"message": "Cleared"}

@app.post("/order/place")
async def place_order(item: CartItem):
    order_id = len(order_queue) + 1
    order = {"order_id": order_id, "product_id": item.product_id}
    order_queue.append(order)
    return {"message": "Order placed", "order_id": order_id}

@app.post("/order/process")
async def process_order():
    if not order_queue:
        raise HTTPException(status_code=400, detail="No orders to process")
    processed = order_queue.pop(0)
    return {"message": "Order processed", "order": processed}

@app.get("/orders")
async def get_orders():
    return {"queue": order_queue}

@app.post("/support/ticket")
async def create_ticket(ticket: SupportTicket):
    priority = 1 if ticket.is_vip else 2
    ticket_id = len(support_heap) + 1
    heapq.heappush(support_heap, (priority, ticket_id, ticket.customer_id, ticket.issue))
    return {"message": "Ticket created"}

@app.post("/support/solve")
async def solve_ticket():
    if not support_heap:
        raise HTTPException(status_code=400, detail="No tickets")
    solved = heapq.heappop(support_heap)
    return {"message": "Solved ticket", "ticket": solved}

@app.get("/support")
async def get_support():
    return {"heap": sorted(support_heap)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

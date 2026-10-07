import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8000';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [], raw_structure: [], undo_stack: [] });
  const [theme, setTheme] = useState('normal');
  const [devMode, setDevMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ results: [], dev_info: {} });
  const [categories, setCategories] = useState(null);
  const [orders, setOrders] = useState([]);
  const [support, setSupport] = useState([]);
  const [priceFilter, setPriceFilter] = useState({ min: 0, max: 5000 });
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [recs, setRecs] = useState([]);
  const [activeProductId, setActiveProductId] = useState(null);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCart();
    fetchCategories();
    fetchOrders();
    fetchSupport();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/products`);
      const data = await res.json();
      setProducts(data || []);
    } catch (e) { console.error(e); }
  };

  const fetchCart = async () => {
    try {
      const res = await fetch(`${API_BASE}/cart`);
      const data = await res.json();
      setCart(data || { items: [], raw_structure: [], undo_stack: [] });
    } catch (e) { console.error(e); }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      const data = await res.json();
      setCategories(data || null);
    } catch (e) { console.error(e); }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE}/orders`);
      const data = await res.json();
      setOrders(data.queue || []);
    } catch (e) { console.error(e); }
  };

  const fetchSupport = async () => {
    try {
      const res = await fetch(`${API_BASE}/support`);
      const data = await res.json();
      setSupport(data.heap || []);
    } catch (e) { console.error(e); }
  };

  const handleSearch = async (q) => {
    setSearchQuery(q);
    if (q.length > 0) {
      try {
        const res = await fetch(`${API_BASE}/search?q=${q}`);
        const data = await res.json();
        setSearchResults(data || { results: [], dev_info: {} });
      } catch (e) { console.error(e); }
    } else {
      setSearchResults({ results: [], dev_info: {} });
    }
  };

  const applyPriceFilter = async () => {
    try {
      const res = await fetch(`${API_BASE}/filter?min_p=${priceFilter.min}&max_p=${priceFilter.max}`);
      const data = await res.json();
      setFilteredProducts(data.results || []);
    } catch (e) { console.error(e); }
  };

  const getRecommendations = async (pid) => {
    setActiveProductId(pid);
    try {
      const res = await fetch(`${API_BASE}/recommendations/${pid}`);
      const data = await res.json();
      setRecs(data.results || []);
    } catch (e) { console.error(e); }
  };

  const addToCart = async (productId) => {
    try {
      await fetch(`${API_BASE}/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId }),
      });
      fetchCart();
    } catch (e) { alert("Error adding to cart"); }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await fetch(`${API_BASE}/cart/remove`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to remove");
      }
      fetchCart();
    } catch (e) {
      alert(e.message);
    }
  };

  const undoRemove = async () => {
    try {
      const res = await fetch(`${API_BASE}/cart/undo`, { method: 'POST' });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Nothing to undo");
      }
      fetchCart();
    } catch (e) {
      alert(e.message);
    }
  };

  const clearCart = async () => {
    try {
      await fetch(`${API_BASE}/cart/clear`, { method: 'POST' });
      fetchCart();
    } catch (e) { alert("Error clearing cart"); }
  };

  const placeOrder = async (productId) => {
    try {
      await fetch(`${API_BASE}/order/place`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId }),
      });
      fetchOrders();
    } catch (e) { alert("Order failed"); }
  };

  const processOrder = async () => {
    try {
      const res = await fetch(`${API_BASE}/order/process`, { method: 'POST' });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "No orders");
      }
      fetchOrders();
    } catch (e) {
      alert(e.message);
    }
  };

  const createTicket = async (isVip) => {
    try {
      await fetch(`${API_BASE}/support/ticket`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_id: Math.floor(Math.random()*1000), issue: "Help me!", is_vip: isVip }),
      });
      fetchSupport();
    } catch (e) { alert("Ticket failed"); }
  };

  const solveTicket = async () => {
    try {
      const res = await fetch(`${API_BASE}/support/solve`, { method: 'POST' });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "No tickets");
      }
      fetchSupport();
    } catch (e) {
      alert(e.message);
    }
  };

  const CategoryTree = ({ node }) => {
    if (!node) return null;
    return (
      <div style={{ marginLeft: '20px', marginTop: '5px' }}>
        <div style={{ cursor: 'pointer', fontWeight: 'bold', color: devMode ? '#0f0' : (theme === 'dark' ? '#aaa' : '#555') }}>
          📁 {node.name}
        </div>
        {node.children && node.children.map((child, i) => (
          <CategoryTree key={i} node={child} />
        ))}
      </div>
    );
  };

  return (
    <div style={{
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      padding: '20px',
      backgroundColor: theme === 'dark' ? '#121212' : (devMode ? '#1a1a1a' : '#f5f5f5'),
      color: theme === 'dark' ? '#e0e0e0' : (devMode ? '#fff' : '#333'),
      minHeight: '100vh'
    }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '2px solid ' + (theme === 'dark' ? '#333' : '#ddd'),
        paddingBottom: '20px'
      }}>
        <h1 style={{ margin: 0 }}>🛒 DSA STORE <small style={{ fontSize: '14px', display: 'block', color: '#888' }}>Feel the DSA by Pushpendar</small></h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button
            onClick={() => setShowGuide(!showGuide)}
            style={{ padding: '8px 16px', cursor: 'pointer', borderRadius: '4px', backgroundColor: '#6c757d', color: '#fff', border: 'none' }}
          >
            {showGuide ? 'Close Guide' : '📖 How to use'}
          </button>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              width: '250px',
              backgroundColor: theme === 'dark' ? '#333' : '#fff',
              color: theme === 'dark' ? '#fff' : '#000'
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span>Theme:</span>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                style={{ padding: '5px', borderRadius: '4px', cursor: 'pointer', backgroundColor: theme === 'dark' ? '#333' : '#fff', color: theme === 'dark' ? '#fff' : '#000' }}
              >
                <option value="normal">Normal</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span>Dev Mode</span>
              <input
                type="checkbox"
                checked={devMode}
                onChange={() => setDevMode(!devMode)}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>
      </header>

      {showGuide && (
        <div style={{
          backgroundColor: theme === 'dark' ? '#1e1e1e' : '#fff',
          border: '2px solid #007bff',
          borderRadius: '12px',
          padding: '20px',
          marginTop: '20px',
          marginBottom: '20px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
        }}>
          <h2 style={{ marginTop: 0, color: '#007bff' }}>📖 Learning Roadmap: How to Feel the DSA</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div>
              <h4 style={{ margin: '0 0 10px 0' }}>1. The Basics (HashMaps & Arrays)</h4>
              <ul style={{ paddingLeft: '20px', fontSize: '14px' }}>
                <li>Add items to cart ➔ Watch the <b>Dynamic Array</b> grow.</li>
                <li>Enable <b>Dev Mode</b> ➔ See the <b>Hash Map</b> Key-Value pairs in the catalog.</li>
              </ul>
            </div>
            <div>
              <h4 style={{ margin: '0 0 10px 0' }}>2. Hierarchies (Trees & Tries)</h4>
              <ul style={{ paddingLeft: '20px', fontSize: '14px' }}>
                <li>Browse the <b>Categories</b> ➔ Experience a <b>General Tree</b>.</li>
                <li>Search for "Gam" ➔ Watch the <b>Trie</b> traverse characters in Dev Mode.</li>
              </ul>
            </div>
            <div>
              <h4 style={{ margin: '0 0 10px 0' }}>3. Logistics (Stack, Queue, Heap)</h4>
              <ul style={{ paddingLeft: '20px', fontSize: '14px' }}>
                <li>Remove item ➔ Click <b>Undo</b> ➔ Feel the <b>Stack (LIFO)</b>.</li>
                <li>Place Order ➔ Process Order ➔ Feel the <b>Queue (FIFO)</b>.</li>
                <li>Create VIP Ticket ➔ Solve ➔ Feel the <b>Priority Queue (Heap)</b>.</li>
              </ul>
            </div>
            <div>
              <h4 style={{ margin: '0 0 10px 0' }}>4. Intelligence (Graphs & BST)</h4>
              <ul style={{ paddingLeft: '20px', fontSize: '14px' }}>
                <li>Click a product ➔ See <b>Recommendations</b> via a <b>Graph</b>.</li>
                <li>Set a Price Range ➔ Filter via <b>Binary Search Tree (BST)</b>.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <main style={{ display: 'grid', gridTemplateColumns: '250px 1fr 300px', gap: '30px', marginTop: '30px' }}>
        <section style={{ padding: '10px', borderRight: '1px solid #ccc' }}>
          <h3 style={{ marginTop: 0 }}>Categories</h3>
          {categories ? <CategoryTree node={categories} /> : <p>Loading...</p>}
          <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #ccc' }} />
          <h3>Order Pipeline (Queue)</h3>
          <button onClick={processOrder} style={{ width: '100%', padding: '10px', cursor: 'pointer' }}>Process Next Order</button>
          {devMode && (
            <div style={{
              marginTop: '10px',
              backgroundColor: '#333',
              color: '#0f0',
              padding: '10px',
              borderRadius: '8px',
              fontSize: '12px',
              fontFamily: 'monospace'
            }}>
              <strong style={{ color: '#fff' }}>FIFO Queue State:</strong><br />
              <div style={{ display: 'flex', gap: '5px', marginTop: '5px', overflowX: 'auto' }}>
                {orders.map((o, i) => (
                  <div key={i} style={{ border: '1px solid #0f0', padding: '5px', minWidth: '40px', textAlign: 'center' }}>
                    {o.order_id}
                  </div>
                ))}
                {orders.length === 0 && <div style={{color: '#888'}}>Empty</div>}
              </div>
              <small>Complexity: O(1) Enqueue/Dequeue</small>
            </div>
          )}
        </section>

        <section>
          <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <strong>Price Range:</strong>
            <input
              type="number"
              value={priceFilter.min}
              onChange={(e) => setPriceFilter({...priceFilter, min: parseInt(e.target.value) || 0})}
              style={{ width: '70px', padding: '5px', backgroundColor: theme === 'dark' ? '#333' : '#fff', color: theme === 'dark' ? '#fff' : '#000' }}
            />
            <span>to</span>
            <input
              type="number"
              value={priceFilter.max}
              onChange={(e) => setPriceFilter({...priceFilter, max: parseInt(e.target.value) || 0})}
              style={{ width: '70px', padding: '5px', backgroundColor: theme === 'dark' ? '#333' : '#fff', color: theme === 'dark' ? '#fff' : '#000' }}
            />
            <button onClick={applyPriceFilter} style={{ padding: '5px 10px', cursor: 'pointer' }}>Filter</button>
          </div>

          <h2>{searchQuery ? `Results for "${searchQuery}"` : (filteredProducts.length > 0 ? 'Filtered Products' : 'Product Catalog')}</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            {(searchQuery ? (searchResults.results || []) : (filteredProducts.length > 0 ? filteredProducts : products)).map(product => (
              <div
                key={product.id}
                onClick={() => getRecommendations(product.id)}
                style={{
                  border: '1px solid #ccc',
                  padding: '15px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: activeProductId === product.id ? (devMode ? '#444' : '#eef') : (devMode ? '#2a2a2a' : (theme === 'dark' ? '#333' : '#fff')),
                  color: theme === 'dark' ? '#fff' : (devMode ? '#fff' : '#333'),
                  textAlign: 'center'
                }}
              >
                <div style={{ fontWeight: 'bold' }}>{product.name}</div>
                <div style={{ color: theme === 'dark' ? '#bbb' : '#666' }}>${product.price}</div>
                <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', marginTop: '10px' }}>
                  <button onClick={(e) => { e.stopPropagation(); addToCart(product.id); }} style={{ padding: '5px', cursor: 'pointer' }}>Add to Cart</button>
                  <button onClick={(e) => { e.stopPropagation(); placeOrder(product.id); }} style={{ padding: '5px', cursor: 'pointer', backgroundColor: '#ffc107' }}>Order Now</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ borderLeft: '1px solid #ccc', paddingLeft: '30px' }}>
          <h3>Your Cart</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={undoRemove} style={{ fontSize: '12px', cursor: 'pointer' }}>Undo Remove</button>
            <button onClick={clearCart} style={{ fontSize: '12px', cursor: 'pointer', backgroundColor: '#dc3545', color: '#fff', border: 'none' }}>Clear</button>
          </div>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {(cart.items || []).map((item, idx) => (
              <li key={idx} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid #eee',
                color: devMode ? '#fff' : (theme === 'dark' ? '#e0e0e0' : '#333')
              }}>
                {item.name} <button onClick={() => removeFromCart(item.id)} style={{ cursor: 'pointer', padding: '2px 5px', backgroundColor: '#ffcccc', border: '1px solid red', color: 'red' }}>X</button>
              </li>
            ))}
          </ul>

          {devMode && (
            <div style={{
              backgroundColor: '#333',
              color: '#0f0',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontFamily: 'monospace',
              fontSize: '12px'
            }}>
              <strong style={{ color: '#fff' }}>Undo Stack (LIFO):</strong><br />
              <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: '5px', marginTop: '10px' }}>
                {(cart.undo_stack || []).map((id, index) => (
                  <div key={index} style={{ border: '1px solid #0f0', padding: '5px', textAlign: 'center', background: '#222' }}>
                    ID: {id}
                  </div>
                ))}
                {(cart.undo_stack || []).length === 0 && <div style={{color: '#888'}}>Empty</div>}
              </div>
              <small>Complexity: O(1) Push/Pop</small>
            </div>
          )}

          <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #ccc' }} />

          <h3>Support System (Priority Queue)</h3>
          <div style={{ display: 'flex', gap: '5px' }}>
            <button onClick={() => createTicket(false)} style={{ flex: '1', cursor: 'pointer' }}>Regular</button>
            <button onClick={() => createTicket(true)} style={{ flex: '1', cursor: 'pointer', backgroundColor: '#ffd700' }}>VIP</button>
          </div>
          <button onClick={solveTicket} style={{ width: '100%', marginTop: '10px', padding: '10px', cursor: 'pointer', backgroundColor: '#28a745', color: '#fff', border: 'none' }}>Solve Highest Priority</button>

          {devMode && (
            <div style={{
              marginTop: '10px',
              backgroundColor: '#333',
              color: '#0f0',
              padding: '10px',
              borderRadius: '8px',
              fontSize: '12px',
              fontFamily: 'monospace'
            }}>
              <strong style={{ color: '#fff' }}>Binary Heap State:</strong><br />
              <div style={{ marginTop: '10px' }}>
                {support.map((t, i) => (
                  <div key={i} style={{ borderBottom: '1px solid #444', padding: '2px' }}>
                    P{t[0]} - ID:{t[2]} - {t[3]}
                  </div>
                ))}
                {support.length === 0 && <div style={{color: '#888'}}>Empty</div>}
              </div>
              <small>Complexity: O(log N) Push/Pop</small>
            </div>
          )}
        </section>
      </main>

      {devMode && (
        <div style={{
          marginTop: '40px',
          padding: '20px',
          backgroundColor: '#222',
          border: '2px solid #0f0',
          borderRadius: '12px',
          color: '#0f0',
          fontFamily: 'monospace'
        }}>
          <h2>🧠 The Intelligence (Phase 4)</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            <div>
              <h3>Graph-Based Recommendations</h3>
              <p>Click a product in the catalog to see its neighbors in the Graph.</p>
              {activeProductId ? (
                <div>
                  <strong style={{ color: '#fff' }}>Product {activeProductId} is connected to:</strong>
                  <div style={{ marginTop: '10px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {recs.length > 0 ? recs.map(r => (
                      <div key={r.id} style={{ border: '1px solid #0f0', padding: '5px', borderRadius: '4px' }}>
                        {r.name}
                      </div>
                    )) : <div>No recommendations found.</div>}
                  </div>
                  <br />
                  <small>Logic: Adjacency List Lookup. Complexity: O(1) for neighbors.</small>
                </div>
              ) : <p>Select a product to explore the graph...</p>}
            </div>
            <div>
              <h3>BST Price Filter</h3>
              <p>When you filter by price, the server doesn't scan the list. It traverses a Binary Search Tree.</p>
              <small>Complexity: O(log N + K) where K is number of results.</small>
              <br />
              <div style={{ marginTop: '10px', fontSize: '10px', color: '#aaa' }}>
                BST Rule: Left Child &lt; Root &lt; Right Child
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

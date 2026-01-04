npm.json

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, X } from 'lucide-react';

function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, searchTerm, selectedCategory, sortOrder]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (sortOrder === 'low-high') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'high-low') {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSortOrder('');
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity < product.rating.count) {
        setCart(cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      }
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    const product = products.find(p => p.id === productId);
    const maxStock = product.rating.count;

    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else if (newQuantity <= maxStock) {
      setCart(cart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const getCategories = () => {
    return [...new Set(products.map(p => p.category))];
  };

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
  };

  const getStockStatus = (product) => {
    const stock = product.rating.count;
    return stock > 0 ? 'In stock' : 'Out of stock';
  };

  const isOutOfStock = (product) => {
    return product.rating.count === 0;
  };

  if (loading) {
    return (
      
        Loading products...
      
    );
  }

  return (
    
      
        
          
            Mini E-Commerce
            
              
              {getTotalItems()} items
              ${getTotalPrice()}
            
          
        
      

      
        
          
            
              Filters & Search
              
              
                
                  Search Products
                
                
                  
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                
              

              
                
                  Category
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  All Categories
                  {getCategories().map(category => (
                    
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    
                  ))}
                
              

              
                
                  Sort by Price
                
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  Default
                  Low → High
                  High → Low
                
              

              
                Clear All Filters
              
            
          

          
            
              
                Products ({filteredProducts.length})
              
              
              {filteredProducts.length === 0 ? (
                
                  No products found
                
              ) : (
                
                  {filteredProducts.map(product => (
                    
                      
                        
                      
                      
                        
                          {product.title}
                        
                        
                          ${product.price.toFixed(2)}
                        
                        
                          {product.category}
                        
                        
                          {getStockStatus(product)}
                        
                        <button
                          onClick={() => addToCart(product)}
                          disabled={isOutOfStock(product)}
                          className={`w-full py-2 rounded-lg font-medium transition-colors ${
                            isOutOfStock(product)
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          Add to Cart
                        
                      
                    
                  ))}
                
              )}
            

            
              
                Shopping Cart
                
                {cart.length === 0 ? (
                  
                    
                    Empty cart
                  
                ) : (
                  <>
                    
                      {cart.map(item => (
                        
                          
                          
                            
                              {item.title}
                            
                            
                              ${item.price.toFixed(2)}
                            
                            
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                              >
                                -
                              
                              
                                {item.quantity}
                              
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                              >
                                +
                              
                              
                                (Max: {item.rating.count})
                              
                            
                          
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            
                          
                        
                      ))}
                    

                    
                      
                        Total items:
                        {getTotalItems()}
                      
                      
                        Total price:
                        ${getTotalPrice()}
                      
                    
                  </>
                )}
              
            
          
        
      
    
  );
}

export default App;

import { useEffect, useState } from "react";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("")

  
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")

  const [editingProduct, setEditingProduct] = useState(null)


  useEffect(() => {
    fetch("http://localhost:5050/api/products")
      .then((response) =>response.json())
      .then((data)=> {
        setProducts(data)
      })
      .catch((error)=> {
        console.error(error)
      })
  }, [])

  // Add product
  const addProduct = async (e) => {
    e.preventDefault();

    try{
      const response =await fetch("http://localhost:5050/api/products",{
        method: "POST",
        headers:  {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          price: Number(price),
        }),
      })

      const newProduct =await response.json()

      setProducts((previousProducts) => [
        ...previousProducts,
        newProduct,
      ]);

      
      setName("");
      setPrice("");

      
      setShowForm(false);

    } catch (error) {
      console.error(error);
    }
  };

  const startEdit = (product) =>{
    setEditingProduct(product)
    setName(product.name)
    setPrice(product.price)
    setShowForm(true)
  }

  const updateProduct = async(e) =>{
    e.preventDefault()

    try{
      const response = await fetch(
        `http://localhost:5050/api/products/${editingProduct.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            price: Number(price),
          }),
        }
      )
      if(!response.ok){
        throw new Error("Failed to update product")
      }
     
         const updatedProduct = await response.json();

    setProducts((previousProducts) =>
      previousProducts.map((product) =>
        product.id === updatedProduct.id
          ? updatedProduct
          : product
      )
    );

      setEditingProduct(null);
    setName("");
    setPrice("");
    setShowForm(false);

  } catch (error) {
    console.error(error);
  }
};



  const deleteProduct = async (id) => {
  try {
    const response = await fetch(
      `http://localhost:5050/api/products/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete product");
    }

    setProducts((previousProducts) =>
      previousProducts.filter((product) => product.id !== id)
    );

  } catch (error) {
    console.error(error);
  }
};

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="products-page">

      {/* Header */}
      <div className="products-header">
        <div>
          <h1>Products</h1>
          <p>Manage your products</p>
        </div>

        <button
          className="add-product-btn"
          onClick={() => setShowForm(true)}
        >
          + Add Product
        </button>
      </div>


      {/* Add Product Form */}
      {showForm && (
        <div className="add-product-form">

          <h2>{editingProduct ? "Edit product" : "Add new Product"}</h2>

          <form onSubmit={editingProduct ? updateProduct: addProduct}>

            <div className="form-group">
              <label>Product Name</label>

              <input
                type="text"
                placeholder="Enter product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>


            <div className="form-group">
              <label>Price</label>

              <input
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>


            <div className="form-actions">

              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-btn"
              >
                {editingProduct ? "Save changes" : "Save Product"}
              </button>

            </div>

          </form>

        </div>
      )}


      {/* Search + Product Count */}
      <div className="products-toolbar">

        <div className="search-box">
          🔍

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <span className="product-count">
          {filteredProducts.length} products
        </span>

      </div>


      {/* Products */}
      <div className="products-grid">

        {filteredProducts.map((product) => (

          <div className="product-card" key={product.id}>

            <div className="product-card-top">

              <span className="product-id">
                #{product.id}
              </span>

              <button className="edit-btn"
              onClick={()=> startEdit(product)}>
                 Edit
              </button>

              <button
  className="delete-btn"
  onClick={() => deleteProduct(product.id)}
>
  Delete
</button>
            </div>

            <div className="product-icon">
              📦
            </div>

            <h2>{product.name}</h2>

            <div className="product-price">
              €{Number(product.price).toFixed(2)}
            </div>

          </div>

        ))}

      </div>

      

    </div>
  );
}

export default Products;


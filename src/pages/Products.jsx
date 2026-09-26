
import { useEffect, useState } from "react";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("")

  
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [error,setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("");

  const [productToDelete, setProductToDelete] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null)

  const [deleting, setDeleting] = useState(false)

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
     
    if(!name.trim()){
      seterror("Product name is required")
      return;
    }

    if(!price || Number(price) <= 0){
      setError("Price must be greater than 0")
      return 
    }
    setError("")

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

      if(!response.ok){
        const data = await response.jsxon()
        setError(data.error)
      }

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

    if(!name.trim()){
      setError("product name is req")
      return
    }

    if(!price || Number(price) <=0){
      setError("price must be greater than 0")
      return
    }
    setError("")
  

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
      if (!response.ok) {
  const data = await response.json();
  setError(data.error);
  return;
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
      const data = await response.json();
      setError(data.error);
      return;
    }

    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== id)
    );

    setSuccessMessage("Product deleted successfully");

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  } catch (error) {
    console.error("DELETE ERROR:", error);
    setError("Something went wrong while deleting the product");
  }finally{
    setDeleting(false)
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
           
           {
            error &&(
              <p className="form-error">
                {error}
              </p>
            )
           }
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


       {successMessage && (
  <div className="success-message">
    ✓ {successMessage}
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
 onClick={() => setProductToDelete(product)}
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

      {productToDelete && (
  <div className="delete-modal-overlay">
    <div className="delete-modal">
      <h2>Are you sure?</h2>

      <p>
        Are you sure you want to delete{" "}
        <strong>{productToDelete.name}</strong>?
      </p>

      <div className="delete-modal-actions">
        <button
          className="cancel-delete-btn"
          onClick={() => setProductToDelete(null)}
        >
          Cancel
        </button>

        <button
  className="confirm-delete-btn"
  onClick={() => {
    deleteProduct(productToDelete.id);
    setProductToDelete(null);
  }}
  disabled={deleting}
>
  {deleting ? "Deleting..." : "Delete"}
</button>
      </div>
    </div>
  </div>
)}

      

    </div>
  );
}

export default Products;


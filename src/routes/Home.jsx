import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const [products, setProducts] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${import.meta.env.VITE_APP_HOST}/products/all`)
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error))
  }, [])

  return (
    <div className="container-fluid mt-4">
      <div className="row g-4 justify-content-center">
        {products.map(product => (
          <div
            key={product.product_id}
            className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center"
          >
            <div
              className="card h-100"
              onClick={() => navigate(`/details/${product.product_id}`)}
              style={{ cursor: 'pointer', width: '80%' }}
            >
              <img
                src={`${import.meta.env.VITE_APP_HOST}/${product.image_filename}`}
                className="card-img-top"
                alt={product.name}
                style={{
                  height: '100px', 
                  objectFit: 'contain', // Maintains aspect ratio without cropping
                }}
              />
              <div className="card-body text-center">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">Price: ${product.cost.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

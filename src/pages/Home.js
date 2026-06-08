import { useEffect, useState, useCallback } from 'react';
import './Home.css';
import ProductCard from '../components/ProductCard';

const products = [
  {
    id: 1,
    name: 'Silk Wrap Dress',
    price: '$129',
    description: 'Elegant silhouette with a luxe satin finish.',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 2,
    name: 'Leather Tote Bag',
    price: '$89',
    description: 'Spacious everyday tote in soft pebble leather.',
    image: 'https://images.unsplash.com/photo-1495121605193-b116b5b9c5d6?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    name: 'Statement Earrings',
    price: '$42',
    description: 'Gold-tone earrings with a modern sculpted shape.',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80',
  },
];

function Home() {
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [copied, setCopied] = useState(false);

  const selectedProduct = products.find((product) => product.id === selectedProductId);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('product'), 10);
    if (id && products.some((product) => product.id === id)) {
      setSelectedProductId(id);
    }
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (selectedProductId) {
      url.searchParams.set('product', selectedProductId);
    } else {
      url.searchParams.delete('product');
    }
    window.history.replaceState({}, '', url);
  }, [selectedProductId]);

  const openProduct = (id) => {
    setSelectedProductId(id);
  };

  const closeModal = useCallback(() => {
    setSelectedProductId(null);
    setCopied(false);
    console.log('Closing modal');
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    if (selectedProductId) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [selectedProductId, closeModal]);

  const copyShareLink = async () => {
    if (!selectedProductId) {
      return;
    }

    const shareUrl = `${window.location.origin}${window.location.pathname}?product=${selectedProductId}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt('Copy this product link', shareUrl);
    }
  };

  return (
    <main className="home-page">
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">Boutique Collection</p>
          <h1>Discover Your Signature Style</h1>
          <p>
            Shop curated women’s fashion with timeless pieces designed for everyday elegance.
          </p>
          <button className="primary-button">Shop the Collection</button>
        </div>
      </section>

      <section className="products-section">
        <div className="section-header">
          <h2>Best Sellers</h2>
          <p>Tap any product to see details and shop the look.</p>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              image={product.image}
              name={product.name}
              price={product.price}
              description={product.description}
              onClick={() => openProduct(product.id)}
            />
          ))}
        </div>
      </section>

      <section className="about-section">
        <div>
          <h2>Style with a personal touch</h2>
          <p>
            Our boutique offers a refined shopping experience with pieces made for
            comfort, confidence, and effortless everyday dressing.
          </p>
        </div>
      </section>

      {selectedProduct && (
        <div className="modal-overlay" onClick={closeModal} role="dialog" aria-modal="true">
          <div className="modal-content" >
            <button className="modal-close" type="button" onClick={closeModal} aria-label="Close details">
              ×
            </button>
            <div className="modal-image">
              <img src={selectedProduct.image} alt={selectedProduct.name} />
            </div>
            <div className="modal-details">
              <p className="eyebrow">Product detail</p>
              <h2>{selectedProduct.name}</h2>
              <p className="product-price-large">{selectedProduct.price}</p>
              <p>{selectedProduct.description}</p>
              <button className="share-button" type="button" onClick={copyShareLink}>
                {copied ? 'Link copied!' : 'Copy product link'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Home;

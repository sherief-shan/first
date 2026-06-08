import { useState, useEffect } from 'react';
import './ProductCard.css';

function ProductCard({ image, name, price, description, onClick }) {
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [orderData, setOrderData] = useState({ name: '', address: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const openOrderModal = (event) => {
    event.stopPropagation();
    setIsOrderOpen(true);
    setSuccessMessage('');
    setErrors({});
  };

  const closeOrderModal = () => {
    setIsOrderOpen(false);
    setOrderData({ name: '', address: '', phone: '' });
    setErrors({});
    setSuccessMessage('');
  };

  const handleInputChange = (event) => {
    const { name: fieldName, value } = event.target;
    setOrderData((current) => ({
      ...current,
      [fieldName]: value,
    }));
  };

  const handleOrderSubmit = (event) => {
  event.preventDefault();

  const nextErrors = {};

  if (!orderData.name.trim()) {
    nextErrors.name = 'Name is required';
  }

  if (!orderData.phone.trim()) {
    nextErrors.phone = 'Phone number is required';
  }

  if (Object.keys(nextErrors).length > 0) {
    setErrors(nextErrors);
    return;
  }
const message = `
🛍️ *NEW ORDER*

━━━━━━━━━━━━━━

👗 Product
${name}

💰 Price
${price}

━━━━━━━━━━━━━━

🙋 Customer Name
${orderData.name}

📞 Phone
${orderData.phone}

📍 Delivery Address
${orderData.address || 'Not Provided'}

━━━━━━━━━━━━━━


`;
  const whatsappNumber = "9188165425"
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;

  window.open(url, "_blank");

  setSuccessMessage(`Redirecting to WhatsApp...`);

  setTimeout(() => {
    closeOrderModal();
  }, 1000);
};

  useEffect(() => {
    if (!isOrderOpen) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        closeOrderModal();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOrderOpen]);

  return (
    <>
      <div className="product-card" role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined} onClick={handleCardClick}>
        <div className="product-image">
          <img src={image} alt={name} />
        </div>
        <div className="product-info">
          <h3>{name}</h3>
          <p className="product-price">{price}</p>
          {description && <p className="product-description">{description}</p>}
          <button className="order-button" type="button" onClick={openOrderModal}>
            Order
          </button>
        </div>
      </div>

      {isOrderOpen && (
        <div className="modal-overlay" onClick={closeOrderModal} role="dialog" aria-modal="true">
          {successMessage && (
            <div className="order-toast" role="status" aria-live="polite">
              {successMessage}
            </div>
          )}
          <div className="modal-content" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" onClick={closeOrderModal} aria-label="Close order form">
              ×
            </button>
            <div className="modal-details modal-order-form">
              <h2>Order {name}</h2>
              <form onSubmit={handleOrderSubmit}>
                <label>
                  Name<span className="required">*</span>
                  <input
                    name="name"
                    value={orderData.name}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                  />
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </label>

                <label>
                  Phone<span className="required">*</span>
                  <input
                    name="phone"
                    value={orderData.phone}
                    onChange={handleInputChange}
                    placeholder="Your phone number"
                  />
                  {errors.phone && <span className="field-error">{errors.phone}</span>}
                </label>

                <label>
                  Address
                  <textarea
                    name="address"
                    value={orderData.address}
                    onChange={handleInputChange}
                    placeholder="Shipping address"
                  />
                </label>

                <button className="confirm-button" type="submit">
                  Confirm Order
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductCard;

// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {similarProductItemDetails} = props
  const {brand, imageUrl, price, rating, title} = similarProductItemDetails
  return (
    <li className="similar-product-item">
      <img
        src={imageUrl}
        alt={`similar product ${imageUrl}`}
        className="sim-pro-thumbnail"
      />
      <h1 className="sim-pro-title">{title}</h1>
      <p className="sim-pro-brand">by {brand}</p>
      <div className="sim-product-details">
        <p className="sim-pro-price">Rs {price}/-</p>
        <div className="sim-pro-rating-container">
          <p className="sim-pro-rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem

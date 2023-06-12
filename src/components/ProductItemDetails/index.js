// Write your code here
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusView = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class ProductItemDetails extends Component {
  state = {
    count: 1,
    itemDetails: {},
    similarProducts: [],
    apiStatus: apiStatusView.initial,
  }

  componentDidMount() {
    this.getProductItem()
  }

  formattedData = each => ({
    id: each.id,
    imageUrl: each.image_url,
    title: each.title,
    description: each.description,
    availability: each.availability,
    brand: each.brand,
    price: each.price,
    rating: each.rating,
    totalReviews: each.total_reviews,
  })

  getProductItem = async () => {
    this.setState({apiStatus: apiStatusView.loading})
    const {match} = this.props
    const {params} = match
    const {id} = params
    // console.log(id)
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/products/${id}`
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    })

    if (response.ok) {
      const data = await response.json()
      //   console.log(data)
      const updatedData = this.formattedData(data)
      const similarProductsData = data.similar_products.map(each =>
        this.formattedData(each),
      )
      //   console.log(updatedData, similarProductsData)
      this.setState({
        itemDetails: updatedData,
        similarProducts: similarProductsData,
        apiStatus: apiStatusView.success,
      })
    }
    if (response.status === 404) {
      this.setState({apiStatus: apiStatusView.failure})
    }
  }

  onClickPlus = () => {
    this.setState(prevState => ({
      count: prevState.count + 1,
    }))
  }

  onClickMinus = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(prevState => ({count: prevState.count - 1}))
    }
  }

  renderProductItemDetails = () => {
    const {similarProducts, itemDetails} = this.state
    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      title,
      totalReviews,
    } = itemDetails
    const {count} = this.state
    return (
      <div className="container">
        <div className="products-container">
          <img src={imageUrl} alt="product" className="product-img" />
          <div className="product-content-container">
            <h1 className="heading">{title}</h1>
            <p className="cost">Rs {price}/-</p>
            <div className="rating-review-container">
              <div className="pro-rating-container">
                <p className="sim-pro-rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>

              <p className="reviews">{totalReviews} Reviews</p>
            </div>
            <p className="description">{description}</p>
            <div className="rating-review-container">
              <p className="availability">Availability:</p>
              <p className="label">{availability}</p>
            </div>
            <div className="rating-review-container">
              <p className="availability">Brand:</p>
              <p className="label">{brand}</p>
            </div>

            <hr className="line" />
            <div className="count-container">
              <button
                type="button"
                data-testid="plus"
                onClick={this.onClickPlus}
                className="button"
              >
                <BsPlusSquare />
              </button>
              <p className="count">{count}</p>
              <button
                type="button"
                data-testid="minus"
                onClick={this.onClickMinus}
                className="button"
              >
                <BsDashSquare />
              </button>
            </div>

            <button type="button" className="shop-now-button">
              Add to Cart
            </button>
          </div>
        </div>
        <div className="similar-product-container">
          <h1 className="similar-product-heading">Similar Products</h1>
          <ul className="similar-products-list">
            {similarProducts.map(eachPro => (
              <SimilarProductItem
                key={eachPro.id}
                similarProductItemDetails={eachPro}
              />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  onClickContinue = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1>Product Not Found</h1>
      <button
        type="button"
        className="shop-now-button"
        onClick={this.onClickContinue}
      >
        Continue Shopping
      </button>
    </div>
  )

  renderProductAndSimilarItems = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusView.success:
        return this.renderProductItemDetails()
      case apiStatusView.loading:
        return this.renderLoader()
      case apiStatusView.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    // const {itemDetails, similarProducts} = this.state
    // console.log(itemDetails, similarProducts)

    return (
      <>
        <Header />
        {this.renderProductAndSimilarItems()}
      </>
    )
  }
}
export default ProductItemDetails

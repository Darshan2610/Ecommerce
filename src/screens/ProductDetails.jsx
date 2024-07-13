import React, { useEffect, useState } from "react";
import Rating from "../components/Rating";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { listProductDetails } from "../actions/productActions";

// import { listProductDetails } from "../actions/productActions";
import {
  Row,
  Col,
  ListGroup,
  Button,
  Image,
  ListGroupItem,
  Dropdown,
} from "react-bootstrap";

const ProductDetails = ({ match }) => {
  const [qty, setQty] = useState(1);
  const { id } = useParams();
  const dispatch = useDispatch();
  const productDetails = useSelector((state) => state.productDetails);
  const { product } = productDetails;
  const history = useNavigate();

  var qu = product.countInStock;
  var classn = "";
  var availibilty = "";
  if (qu > 0) {
    classn = "disp";
    availibilty = "In stock";
  } else {
    classn = "disp1";
    availibilty = "out of stock";
  }

  useEffect(() => {
    dispatch(listProductDetails(id));
  }, [dispatch, id]);

  const addToCartHandler = () => {
    history(`/cart/${id}?qty=${qty}`);
  };

  return (
    <>
      <Link to="/" className="btn btn-light">
        <i className="fas fa-arrow-left    "></i>
        &nbsp; GO BACK
      </Link>

      <Row>
        <Col md={6}>
          <Image src={product.image} alt={product.name} fluid />
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroupItem>
              <h3>{product.name}</h3>
            </ListGroupItem>
            <ListGroupItem>
              <Rating
                value={product.rating}
                text={`${product.numReviews} Reviews`}
              />
            </ListGroupItem>
            <ListGroupItem>Price : ₹{product.price}</ListGroupItem>
            <ListGroupItem>{product.description}</ListGroupItem>
          </ListGroup>
        </Col>
        <Col md={3} className="list-group">
          <ListGroupItem>
            <Row>
              <Col>Status :</Col>
              <Col>
                <div className={classn}>{availibilty}</div>
              </Col>
            </Row>
          </ListGroupItem>
          {product.countInStock > 0 && (
            <ListGroupItem>
              <Row>
                <Col>Qty</Col>
                <Dropdown.Toggle
                  as="select"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                >
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </Dropdown.Toggle>
              </Row>
            </ListGroupItem>
          )}
          <ListGroupItem>
            <Button
              className="btn-block w-100"
              type="button"
              onClick={addToCartHandler}
            >
              Add to cart
            </Button>
          </ListGroupItem>
        </Col>
      </Row>
    </>
  );
};

export default ProductDetails;


import React, { useState, useEffect, useMemo } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button, Row, Col } from 'react-bootstrap';
import './styles.css';
import './App.css';


const stages = ['Order Placed', 'Order in Making', 'Order Ready', 'Order Picked'];

const stageTimes = {
  Small: 180, // 3 minutes
  Medium: 240, // 4 minutes
  Large: 300, // 5 minutes
};

const App = () => {
  const [orders, setOrders] = useState([]);
  const [totalDelivered, setTotalDelivered] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      updateOrderStatus();
    }, 1000);

    return () => clearInterval(timer);
  }, [orders]);

  const handlePlaceOrder = (order) => {
    if (orders.length < 10) {
      setOrders([...orders, { ...order, stage: 0, timeSpent: 0 }]);
    } else {
      alert('Not taking any order for now');
    }
  };

  const handleUpdateStatus = (orderId, action) => {
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        let newStage = order.stage;

        if (action === 'next' && newStage < stages.length - 1) {
          newStage++;
        } else if (action === 'cancel' && newStage < stages.length - 1) {
          newStage = stages.length - 1;
        } else if (action === 'picked' && newStage === stages.length - 1) {
          newStage++;
          setTotalDelivered(totalDelivered + 1);
        }

        return { ...order, stage: newStage };
      }

      return order;
    });

    setOrders(updatedOrders);
  };

  const updateOrderStatus = () => {
    const updatedOrders = orders.map((order) => {
      if (order.stage < stages.length - 1) {
        const timeSpent = order.timeSpent + 1;
        return { ...order, timeSpent };
      }

      return order;
    });

    setOrders(updatedOrders);
  };

  const handleCancelOrder = (orderId) => {
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId && order.stage < stages.length - 1) {
        return { ...order, stage: stages.length - 1 };
      }

      return order;
    });

    setOrders(updatedOrders);
  };

  const sortedOrders = useMemo(() => {
    return orders.slice().sort((a, b) => {
      if (a.stage === b.stage) {
        return a.timeSpent - b.timeSpent;
      }

      return a.stage - b.stage;
    });
  }, [orders]);

  return (
    <div className="Back">
      <h1 className='text-center'>Pizza Restaurant</h1>
      <div className='form-design'>
      <Col xs={6} className='back p-5'>
         
         <PizzaForm onPlaceOrder={handlePlaceOrder} />
       </Col>
      </div>
      <Row>
        {stages.map((stage, index) => (
          <Col className='back-1 p-3' key={index}>
            <h2>{stage}</h2>
            {sortedOrders
              .filter((order) => order.stage === index)
              .map((order) => (
                <div className='p-2'>
                <Card key={order.id} className={order.timeSpent > stageTimes[order.size] ? 'red-border' : ''}>
                  <Card.Body> 
                    <Card.Title>Order #{order.id}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{stages[order.stage]}</Card.Subtitle>
                    <Card.Text>Remaining Time: {stageTimes[order.size] - order.timeSpent} sec</Card.Text>
                    <Button className='ms-3' variant="primary" onClick={() => handleUpdateStatus(order.id, 'next')}>
                      Next
                    </Button>
                    <Button className='ms-3' variant="danger" onClick={() => handleUpdateStatus(order.id, 'cancel')}>
                      Cancel
                    </Button>
                    {order.stage === stages.length - 1 && (
                      <Button className='ms-3' variant="success" onClick={() => handleUpdateStatus(order.id, 'picked')}>
                        Picked
                      </Button>
                    )}
                  </Card.Body>
                </Card>
                </div>
              ))}
          </Col>
        ))}
        
      </Row>
      <div className='Order-design mt-4 p-5'>
      <h2>Main Section</h2>
          <p>Total Pizza Delivered Today: {totalDelivered}</p>
          {sortedOrders.map((order) => (
            <div key={order.id} className='back--1 mt-3'>
               >> Order #{order.id} - {stages[order.stage]} - Remaining Time: {stageTimes[order.size] - order.timeSpent} sec
              {order.stage < stages.length - 1 && (
                <Button className='ms-5' variant="warning" onClick={() => handleCancelOrder(order.id)}>
                  Cancel
                </Button>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

const PizzaForm = ({ onPlaceOrder }) => {
  const [order, setOrder] = useState({ type: 'Veg', size: 'Large', base: 'Thin' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder((prevOrder) => ({ ...prevOrder, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onPlaceOrder({ ...order, id: new Date().getTime() });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3 back">
        <label htmlFor="type" className="form-label ">
          Type
        </label>
        <select
          className="form-select"
          id="type"
          name="type"
          value={order.type}
          onChange={handleChange}
        >
          <option value="Veg">Veg</option>
          <option value="Non-Veg">Non-Veg</option>
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="size" className="form-label">
          Size
        </label>
        <select
          className="form-select"
          id="size"
          name="size"
          value={order.size}
          onChange={handleChange}
        >
          <option value="Large">Large</option>
          <option value="Medium">Medium</option>
          <option value="Small">Small</option>
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="base" className="form-label">
          Base
        </label>
        <select
          className="form-select"
          id="base"
          name="base"
          value={order.base}
          onChange={handleChange}
        >
          <option value="Thin">Thin</option>
          <option value="Thick">Thick</option>
        </select>
      </div>
      <button type="submit" className="btn btn-primary button-position">
        Place Order
      </button>
    </form>
    
  );
};

export default App;


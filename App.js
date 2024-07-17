import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const App = () => {
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataUrl = 'https://github.com/Esraasaadeldin/data_db.json';
        const response = await axios.get(dataUrl);
        setCustomers(response.data.customers);
        setTransactions(response.data.transactions);
        setFilteredTransactions(response.data.transactions);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
      }
    };
    fetchData();
  }, []);

  const handleCustomerChange = (e) => {
    const customer_Id = parseInt(e.target.value);
    setSelectedCustomer(customer_Id);
    setFilteredTransactions(transactions.filter(
      param => param.customer_id === customer_Id));
  };

  const handleTransacationsAmount = (e) => {
    const amount = parseFloat(e.target.value);
    setFilteredTransactions(transactions.filter(
      param => param.amount >= amount));
  };

  const getTotalTransactionsPerDay = () => {
    if (!selectedCustomer) return [];
    const cust_Transactions = transactions.filter(param => param.customer_id === selectedCustomer);
    const totals = cust_Transactions.reduce((red, transaction) => {
      red[transaction.date] = (red[transaction.date] || 0) + transaction.amount;
      return red;
    }, {});
    return Object.keys(totals).map(date => ({ date, amount: totals[date] }));
  };
  
  const transactionData = {
    labels: getTotalTransactionsPerDay().map(param => param.date),
    datasets: [
      {
        label: 'Total Transaction Amount',
        data: getTotalTransactionsPerDay().map(param => param.amount),
        backgroundColor: '#05198a',
        borderColor: 'rgb(192, 75, 178)',
      },
    ],
  };
  const getCustomerName_Id = (paramter) => {
    let customer_Name;
    customers.forEach(e => e.id == paramter? customer_Name = e.name : ' ')
    return customer_Name;
  }
  return (
    <div className='container w-100 '>
      <h1 className='text-primary fw-bolder text-center py-3 mt-3'>App: retrieves the Customer&Transactions data</h1>
      <div className='shadow p-3 mb-5 bg-body rounded mt-4'>
      <div className='filter d-flex mx-auto py-4'>
        <div className='w-50 mx-2'>
          <label className='text-danger fw-bold'>Customers </label>
          <select className="form-select" onChange={handleCustomerChange}>
            <option value="">Customers</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>{customer.name}</option>
            ))}
          </select>
        </div>
        <div className='w-50 mx-2'>
          <label className='fw-bold text-danger'>Trans_Amount</label>
          <input type="number" className="form-control" onChange={handleTransacationsAmount}></input>
        </div>
      </div>
      <table className='table text-center table-hover  m-2'>
        <thead>
          <tr>
            <th scope="col">Customer_ID</th>
            <th scope="col">Customer Name</th>
            <th scope="col">Date</th>
            <th scope="col">Amount</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map(transaction => (
            <tr key={transaction.id}>   
              <td>{transaction.customer_id}</td>
              <td>{getCustomerName_Id(transaction.customer_id)}</td>
              <td>{transaction.date}</td>
              <td>{transaction.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 className='text-danger text-center fw-bold py-2'>Transactions Graph</h2>
      <Bar data={transactionData} />
      </div>
      
    </div>
  );
};
export default App;

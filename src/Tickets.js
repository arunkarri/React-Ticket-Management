import React from 'react';
import env from './env';

const Tickets = () => {
  const [tickets, updateTickets] = React.useState([]);
  const [show, setShow] = React.useState(0);
  const [title, setTitle] = React.useState('');
  const [description, setDesc] = React.useState('');
  const [shouldLoad, setLoad] = React.useState(false);

  function getTickets() {
    setLoad(true);
    fetch(`${env}tickets`)
      .then((res) => res.json())
      .then((data) => {
        setLoad(false);
        updateTickets(data);
      });
  }

  React.useEffect(() => {
    getTickets();
  }, []);

  const submitQuery = () => {
    setLoad(true);
    let obj = { title, description, id: tickets[tickets.length - 1]['id'] + 1 };
    console.log(obj.id);
    fetch(`${env}tickets`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoad(false);
        setTitle('');
        setDesc('');
        getTickets();
      });
  };
  const editRecord = (obj, id) => {
    setLoad(true);
    setShow(0);
    fetch(`${env}tickets/${id}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoad(false);
        updateTickets(tickets.map((ele) => (ele.id === id ? { ...ele } : ele)));
      });
  };

  const deleteRecord = (id) => {
    setLoad(true);
    fetch(`${env}tickets/${id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((data) => {
        setLoad(false);
        updateTickets(tickets.filter((ele) => ele.id !== id));
      });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-5 col-xl-5 col-sm-6 col-md-6 col-xs-12">
          <input type="text" className="form-control" placeholder="Enter a title" value={title} onChange={(event) => setTitle(event.target.value)} />
        </div>
        <div className="col-lg-5 col-xl-5 col-sm-6 col-md-6 col-xs-12">
          <input type="text" className="form-control" placeholder="Enter a description" value={description} onChange={(event) => setDesc(event.target.value)} />
        </div>
        <br />
        <br />
        <div className="col-lg-2 col-xl-2 col-sm-6 col-md-6 col-xs-12">
          <button type="button" className="ml-auto btn btn-primary" onClick={submitQuery}>
            <i className="fas fa-plus"></i> New Query
          </button>
        </div>
      </div>
      {shouldLoad === true ? (
        <div className="d-flex spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        ''
      )}
      <table className="table table-responsive">
        <thead>
          <tr>
            <th scope="col">Ticket ID</th>
            <th scope="col">Title</th>
            <th scope="col">Description</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ele, index) => {
            return (
              <tr key={index}>
                <td>{ele.id}</td>
                <td>
                  {show === ele.id ? (
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter query title"
                      value={ele.title}
                      onChange={(event) => updateTickets(tickets.map((data, dataIndex) => (dataIndex === index ? { ...data, title: event.target.value } : data)))}
                    />
                  ) : (
                    ele.title
                  )}
                </td>
                <td>
                  {show === ele.id ? (
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter query description"
                      value={ele.description}
                      onChange={(event) => updateTickets(tickets.map((data, dataIndex) => (dataIndex === index ? { ...data, description: event.target.value } : data)))}
                    />
                  ) : (
                    ele.description
                  )}
                </td>
                <td>
                  <span>
                    {show !== ele.id ? <i className="fas fa-pen text-primary pointer" onClick={() => setShow(ele.id)}></i> : <i className="fas fa-check-circle text-success pointer" onClick={() => editRecord(ele, ele.id)}></i>}&nbsp;&nbsp;
                    <i className="fas fa-trash text-danger pointer" onClick={() => deleteRecord(ele.id)}></i>
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Tickets;

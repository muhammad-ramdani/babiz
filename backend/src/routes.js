const {
    addBookselfHandler,
    getAllBookselfsHandler,
    getBookselfByIdHandler,
    editBookselfByIdHandler,
    deleteBookselfByIdHandler
  } = require("./handler");
  
  const routes = [
    {
      method: 'POST',
      path: '/books',
      handler: addBookselfHandler,
    },
    {
      method: 'GET',
      path: '/books',
      handler: getAllBookselfsHandler,
    },
    {
      method: 'GET',
      path: '/books/{bookId}',
      handler: getBookselfByIdHandler,
    },
    {
      method: 'PUT',
      path: '/books/{bookId}',
      handler: editBookselfByIdHandler,
    },
    {
      method: 'DELETE',
      path: '/books/{bookId}',
      handler: deleteBookselfByIdHandler,
    },
  ];
  
  module.exports = routes;
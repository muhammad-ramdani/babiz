const { nanoid } = require("nanoid");
const bookshelf = require("./bookshelf");

//API dapat menyimpan buku
const addBookselfHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  if (name === undefined) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400); //gagal
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400); //gagal
    return response;
  }

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  bookshelf.push(newBook);

  const isSuccess = bookshelf.filter((book) => book.id === id).length === 1;

  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    });
    response.code(201); //berhasil
    return response;
  }
};

//API dapat menampilkan seluruh buku
const getAllBookselfsHandler = (request, h) => {
  let filtered = bookshelf;
  const books = [];

  let { name } = request.query;
  if (name !== undefined) {
    filtered = bookshelf.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));

    if (filtered.length === 0) {
      const response = h.response({
        status: "success",
        data: {
          books: [],
        },
      });
      response.code(200); //berhasil
      return response;
    }
  }

  let { reading } = request.query;
  if (reading !== undefined) {
    reading = Number(reading);
    switch (reading) {
      case 0:
        filtered = bookshelf.filter((book) => !book.reading);
        break;
      case 1:
        filtered = bookshelf.filter((book) => book.reading);
        break;
      default:
        filtered = bookshelf;
    }
  }

  const { finished } = request.query;
  if (finished !== undefined) {
    switch (Number(finished)) {
      case 0:
        filtered = bookshelf.filter((book) => book.finished === false);
        break;
      case 1:
        filtered = bookshelf.filter((book) => book.finished === true);
        break;
      default:
        filtered = bookshelf;
    }
  }

  filtered.forEach((book) => {
    const { id, publisher } = book;
    ({ name } = book);
    const newBook = { id, name, publisher };
    books.push(newBook);
  });

  const resp = h.response({
    status: "success",
    data: {
      books,
    },
  });
  resp.code(200); //berhasil
  return resp;
};

//API dapat menampilkan detail buku
const getBookselfByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = bookshelf.find((bookItem) => bookItem.id === bookId);

  if (book) {
    const response = h.response({
      status: "success",
      data: {
        book,
      },
    });
    response.code(200); //berhasil
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku tidak ditemukan",
  });
  response.code(404); //gagal
  return response;
};

//API dapat mengubah data buku
const editBookselfByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = bookshelf.findIndex((book) => book.id === bookId);

  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400); //gagal
    return response;
  }

  if (index !== -1) {
    bookshelf[index] = {
      ...bookshelf[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: "success",
      message: "Buku berhasil diperbarui",
    });
    response.code(200); //berhasil
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Gagal memperbarui buku. Id tidak ditemukan",
  });
  response.code(404); //gagal
  return response;
};

//API dapat menghapus buku
const deleteBookselfByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = bookshelf.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    bookshelf.splice(index, 1);
    const response = h.response({
      status: "success",
      message: "Buku berhasil dihapus",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookselfHandler,
  getAllBookselfsHandler,
  getBookselfByIdHandler,
  editBookselfByIdHandler,
  deleteBookselfByIdHandler,
};

const {nanoid} = require('nanoid');
const books = require('./books');

// Simpan Buku
const saveBooks = (request, h) => {
  const {
    name, year, author,
    summary, publisher, pageCount,
    readPage, reading,
  } = request.payload;

  let finished = false;
  const id = nanoid(13);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  if (readPage === pageCount) {
    finished = true;
  }

  const data = {
    id, name, year, author, summary, publisher, pageCount,
    readPage, finished, reading, insertedAt, updatedAt,
  };

  if (request.payload.hasOwnProperty('name') === false) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (data.readPage > data.pageCount) {
    const response = h.response({
      'status': 'fail',
      'message':
      'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  books.push(data);

  const isSuccess = books.filter((b)=> b.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// Lihat Semua Data Buku
const getAllBooks = () => ({
  status: 'success',
  data: {
    books,
  },
});

// Lihat Buku Dari ID
const getBookByID = (request, h) => {
  const {bookId} = request.params;
  const book = books.filter((b) => b.id === bookId)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

// Update Buku
const updateBook = (request, h) => {
  const {bookId} = request.params;
  const {
    name, year, author,
    summary, publisher, pageCount,
    readPage, reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } else if (readPage > pageCount) {
    const response = h.response({
      'status': 'fail',
      'message':
    'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const index = books.findIndex((i) => i.id === bookId);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name, year, author,
      summary, publisher, pageCount,
      readPage, reading, updatedAt,
    };
    return {
      status: 'success',
      message: 'Buku berhasil diperbarui',
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// Delete Buku
const deleteBook = (request, h) => {
  const {bookId} = request.params;

  const index = books.findIndex((i) => i.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    return {
      status: 'success',
      message: 'Buku berhasil dihapus',
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  saveBooks, getAllBooks, getBookByID,
  updateBook, deleteBook,

};

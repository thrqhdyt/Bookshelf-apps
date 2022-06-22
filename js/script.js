const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'Bookshelf_apps';

document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('inputBook');
  submitForm.addEventListener('submit', function (event) {
    swal('Good job!', 'Successfully added new book', 'success');
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function addBook() {
  const titleBook = document.getElementById('bookTitle').value;
  const authorBook = document.getElementById('authorBook').value;
  const yearBook = document.getElementById('yearBook').value;
  const bookIsComplete = document.getElementById('bookIsComplete').checked;

  const generateID = generateId();
  const BookObject = generateBookObject(generateID, titleBook, authorBook, yearBook, bookIsComplete);
  books.push(BookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

document.addEventListener(RENDER_EVENT, function () {
  console.log(books);
  const uncompletedTODOList = document.getElementById('incompleteBookshelfList');
  uncompletedTODOList.innerHTML = '';

  const completeBookList = document.getElementById('completeBookshelfList');
  completeBookList.innerHTML = '';

  for (const bookItem of books) {
    const bookElement = makeListBook(bookItem);
    if (!bookItem.isCompleted) {
      uncompletedTODOList.append(bookElement);
    } else {
      completeBookList.append(bookElement);
    }
  }
});

function makeListBook(BookObject) {
  const textTitle = document.createElement('h4');
  textTitle.innerText = BookObject.title;

  const textAuthor = document.createElement('p');
  textAuthor.innerText = BookObject.author;

  const textYear = document.createElement('p');
  textYear.innerText = BookObject.year;

  const imageBook = document.createElement('img');
  imageBook.setAttribute('src', './assets/img/book2.jpg');

  const deleteBook = document.createElement('button');

  const readBook = document.createElement('button');

  if (BookObject.isCompleted) {
    readBook.classList.add('undo-button');
    readBook.innerText = '';

    readBook.addEventListener('click', function () {
      undoBook(BookObject.id);
    });

    deleteBook.classList.add('delete-button');
    deleteBook.innerText = '';

    deleteBook.addEventListener('click', function () {
      swal({
        title: 'Are you sure?',
        text: 'Your will deleted book!',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          swal('Successfully deleted book!', {
            icon: 'success',
          });
          removeBook(BookObject.id);
        } else {
          swal('Your canceled delete');
        }
      });
    });

    function undoBook(bookId) {
      const bookTarget = findBook(bookId);

      if (bookTarget == null) return;

      bookTarget.isCompleted = false;
      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData();
    }
  } else {
    readBook.classList.add('read-button');
    readBook.innerText = '';

    readBook.addEventListener('click', function () {
      addToCompleted(BookObject.id);
    });

    deleteBook.classList.add('delete-button');
    deleteBook.innerText = '';

    deleteBook.addEventListener('click', function () {
      swal({
        title: 'Are you sure?',
        text: 'Your will deleted book!',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          swal('Successfully deleted book!', {
            icon: 'success',
          });
          removeBook(BookObject.id);
        } else {
          swal('Your canceled delete');
        }
      });
    });

    function addToCompleted(bookId) {
      const bookTarget = findBook(bookId);

      if (bookTarget == null) return;

      bookTarget.isCompleted = true;
      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData();
    }
  }

  function removeBook(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function findBook(bookId) {
    for (const bookItem of books) {
      if (bookItem.id === bookId) {
        return bookItem;
      }
    }
  }

  function findBookIndex(bookId) {
    for (const index in books) {
      if (books[index].id === bookId) {
        return index;
      }
    }

    return -1;
  }

  const buttonElement = document.createElement('div');
  buttonElement.classList.add('action');
  buttonElement.append(readBook, deleteBook);

  const article = document.createElement('article');
  article.classList.add('book_item');
  article.append(imageBook, textTitle, textAuthor, textYear, buttonElement);
  article.setAttribute('id', `book-${BookObject.id}`);

  return article;
}

const searchBtn = document.getElementById('submitSearch');
searchBtn.addEventListener('click', (event) => {
  const title = document.getElementById('searchTitle').value.toLowerCase();
  const searchFind = document.querySelectorAll('article');

  for (const bookElement of searchFind) {
    const bookTitle = bookElement.textContent.toLowerCase();
    if (bookTitle.indexOf(title) != -1) {
      bookElement.style.display = 'block';
    } else {
      bookElement.style.display = 'none';
    }
    event.preventDefault();
  }
});

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert('Browser tidak mendukung');
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  const serializeData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializeData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

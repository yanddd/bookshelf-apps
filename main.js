const bookForm = document.getElementById("inputBook");
const bookTitle = document.getElementById("inputBookTitle");
const bookAuthor = document.getElementById("inputBookAuthor");
const bookYear = document.getElementById("inputBookYear");
const bookRead = document.getElementById("inputBookIsComplete");
const incompleteBook = document.getElementById("incompleteBookshelfList");
const completeBook = document.getElementById("completeBookshelfList");
const searchForm = document.getElementById("searchBook");
const searchInput = document.getElementById("searchBookTitle");
const STORAGE_KEY = "BOOK_APPS";
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";

document.addEventListener("DOMContentLoaded", function () {
  if (isStorageExist()) {
    loadDataFromStorage();
  }

  bookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  searchForm.addEventListener("keyup", function (event) {
    event.preventDefault();
    searchBook();
  });
});

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  document.dispatchEvent(new Event(RENDER_EVENT));
  let data = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (data == null) {
    return (data = []);
  }
  return data;
}

let books = loadDataFromStorage();

function makeBook(bookObject) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = bookObject.author;

  const textYear = document.createElement("p");
  textYear.innerText = bookObject.year;

  const divText = document.createElement("div");
  divText.classList.add("text");
  divText.append(textTitle, textAuthor, textYear);

  const divButton = document.createElement("div");
  divButton.classList.add("action");

  const container = document.createElement("article");
  container.classList.add("book_item");
  container.setAttribute("id", `todo-${bookObject.id}`);
  container.append(divText, divButton);

  if (bookObject.isComplete) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("green");
    undoButton.innerHTML = "<i class='fas fa-undo-alt'></i>";

    undoButton.addEventListener("click", function () {
      undoBookFromCompleted(bookObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("red");
    trashButton.innerHTML = "<i class='fas fa-trash-alt'></i>";

    trashButton.addEventListener("click", function () {
      removeBook(bookObject.id);
    });

    divButton.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("green");
    checkButton.innerHTML = "<i class='fas fa-check-double'></i>";

    checkButton.addEventListener("click", function () {
      addBookToCompleted(bookObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("red");
    trashButton.innerHTML = "<i class='fas fa-trash-alt'></i>";

    trashButton.addEventListener("click", function () {
      removeBook(bookObject.id);
    });

    divButton.append(checkButton, trashButton);
  }

  return container;
}

document.addEventListener(RENDER_EVENT, function () {
  incompleteBook.innerHTML = "";
  completeBook.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isComplete) {
      incompleteBook.append(bookElement);
    } else {
      completeBook.append(bookElement);
    }
  }
});

document.addEventListener(SAVED_EVENT, function () {
  bookTitle.value = "";
  bookAuthor.value = "";
  bookYear.value = "";
  bookRead.checked = false;

  alert("Buku telah berhasil disimpan");
});

function generateId() {
  const newDate = +new Date();
  return newDate;
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

function addBook() {
  const generatedID = generateId();

  const bookObject = generateBookObject(
    generatedID,
    bookTitle.value,
    bookAuthor.value,
    parseInt(bookYear.value),
    bookRead.checked
  );

  saveData(bookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  document.dispatchEvent(new Event(SAVED_EVENT));
}

function saveData(data = false) {
  if (isStorageExist()) {
    if (data != false) {
      books.unshift(data);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    }
  }
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  saveData();
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  saveData();
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function removeBook(bookId) {
  if (confirm("Anda yakin ingin menghapus data?") == false) return;

  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  saveData();
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

function searchBook() {
  books = loadDataFromStorage();
  keyword = searchInput.value.toLowerCase();
  const filterTitle = books.filter(function (data) {
    filter = data.title.toLowerCase();
    return filter.indexOf(keyword) > -1;
  });
  books = filterTitle;
  document.dispatchEvent(new Event(RENDER_EVENT));
}

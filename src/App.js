import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

function App() {
  const [books, updateBooks] = useState([]);
  const [search, updateSearch] = useState("");
  const [filter, updateFilter] = useState("search");
  const history = useHistory();
  useEffect(function () {
    fetch("http://localhost:3001/books")
      .then((res) => {
        return (res = res.json());
      })
      .then((books) => {
        updateBooks(books);
      });
  }, []); // Empty array is the dependency array, empty array runs on page load

  function filterSearch() {
    fetch(`http://localhost:3001/books/${filter}/${search}`)
      .then((res) => {
        console.log(res);
        return (res = res.json());
      })
      .then((books) => {
        console.log(books);
        updateBooks(books);
      });
  }

  function bookClickFunction(bookId) {
    history.push(`/book/${bookId}`);
  }
  return (
    <div className='App'>
      <div>
        {books && books[0]
          ? books.map((book) => {
              return (
                <div
                  onClick={() => {
                    bookClickFunction(book.id);
                  }}
                >
                  <p>{book.title}</p>
                  <p>{book.category}</p>
                  <p>{book.publisher}</p>
                </div>
              );
            })
          : null}
      </div>

      {/* 
      Filter by author, title, category
      */}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          filterSearch();
        }}
      >
        <input
          type='text'
          placeholder='Search here...'
          value={search}
          onChange={(e) => {
            updateSearch(e.target.value);
          }}
        ></input>

        <label for='authorSearch' value='Authors'>
          Authors
        </label>

        <input
          type='radio'
          id='authorSearch'
          name='filter'
          value='authors'
          onChange={(e) => {
            updateFilter(e.target.value);
          }}
        ></input>

        <label for='titleSearch' value='Title/Description'>
          Title/Description
        </label>

        <input
          type='radio'
          id='titleSearch'
          name='filter'
          value='search'
          onChange={(e) => {
            updateFilter(e.target.value);
          }}
        ></input>

        <label for='categorySearch' value='Category'>
          Category
        </label>

        <input
          type='radio'
          id='categorySearch'
          name='filter'
          value='category'
          onChange={(e) => {
            updateFilter(e.target.value);
          }}
        ></input>

        <input type='submit' value='Submit Search'></input>
      </form>
    </div>
  );
}

export default App;

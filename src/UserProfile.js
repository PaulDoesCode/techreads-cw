import React, { useEffect, useState } from "react";

function UserProfile() {
  const [finishedBooks, updateFinishedBooks] = useState();
  useEffect(() => {
    fetch(`http://localhost:3001/history/anon`).then((res) => {
      const resp = res.json();
      resp.then((books) => {
        console.log(books);
        Promise.all(
          books.map((book) => {
            return fetch(`http://localhost:3001/books/${book.book}`).then((res) => {
              const resp = res.json();
              return resp.then((book) => {
                return book[0];
              });
            });
          })
        ).then((book) => {
          console.log(book);
          updateFinishedBooks(book);
        });
      });
    });
  }, []);

  return finishedBooks
    ? finishedBooks.map((book) => {
        return <p>{book.title}</p>;
      })
    : null;
}

export default UserProfile;

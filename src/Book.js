import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import Chart from "chart.js";

function Book(props) {
  const { bookId } = useParams();
  const [bookData, updateBookData] = useState();
  const [reviewData, updateReviewData] = useState("");
  const [rating, updateRating] = useState(1);
  const [chart, updateChart] = useState();

  const getBookData = useCallback(
    function () {
      fetch(`http://localhost:3001/books/${bookId}`)
        .then((res) => {
          return (res = res.json());
        })
        .then((book) => {
          getAverageRating(book[0]);
          console.log(book);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    [bookId]
  );

  useEffect(() => {
    getBookData();
  }, [getBookData]);

  useEffect(() => {
    if (bookData) {
      var ratingsDistro = [0, 0, 0, 0, 0];
      for (let i = 0; i < bookData.ratings.length; i++) {
        var ratings = bookData.ratings[i];
        ratingsDistro[bookData.ratings[i] - 1] = ratingsDistro[bookData.ratings[i] - 1] + 1;
      }
      console.log(ratingsDistro);
      updateChart(createChart(ratingsDistro));
    }
  }, [bookData]);

  function getAverageRating(book) {
    let avg = 0;
    for (let i = 0; i < book.ratings.length; i++) {
      avg = avg + book.ratings[i];
      console.log(book.ratings[i]);
    }
    avg = avg / book.ratings.length;
    book.avg = Math.trunc(avg);
    updateBookData(book);
  }

  function submitReview() {
    fetch(`http://localhost:3001/books/review/${bookId}`, {
      method: "post",
      body: JSON.stringify({ reviewer: "anon", review: reviewData }),
      headers: { "Content-type": "application/json;charset=UTF-8" },
    })
      .then((res) => (res = res.json()))
      .then((res) => {
        getBookData();
        console.log(res);
      });
  }

  function submitRating() {
    fetch(`http://localhost:3001/books/rate/${bookId}/${rating}`)
      .then((res) => (res = res.json()))
      .then((res) => {
        getBookData();
        console.log(res);
      });
  }

  function createChart(ratingsDistro) {
    var chart = document.getElementById("Chart");
    return new Chart(chart, {
      type: "pie",
      data: {
        labels: ["1", "2", "3", "4", "5"],
        datasets: [
          {
            label: "Total Number of Ratings",
            data: ratingsDistro,
            backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)", "rgba(255, 206, 86, 0.2)", "rgba(75, 192, 192, 0.2)", "rgba(153, 102, 255, 0.2)", "rgba(255, 159, 64, 0.2)"],
            borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)", "rgba(255, 159, 64, 1)"],
            borderWidth: 5,
          },
        ],
      },
      options: {
        title: {
          display: true,
          fontsize: 14,
          text: "Total # of Ratings",
        },
      },
    });
  }

  function addToReadingHistory() {
    return fetch(`http://localhost:3001/history`, {
      method: "post",
      body: JSON.stringify({ user: "anon", book: bookId }),
      headers: { "Content-Type": "application/json;charset=utf-8" },
    }).then((res) => {
      const resp = res.json();
      resp.then((book) => {
        console.log(book);
      });
    });
  }

  return (
    <div>
      {bookData ? (
        <div>
          <p>{bookData.title}</p>
          <p>{bookData.category}</p>
          <p>{bookData.publisher}</p>
          {bookData.reviews.map((review) => {
            return (
              <div>
                <p>{review.reviewer}</p>
                <p>{review.review}</p>
              </div>
            );
          })}
          {bookData.ratings.map((rating) => {
            return <p>{rating}</p>;
          })}
          <p>Total ratings: {bookData.ratings.length}</p>
          {<p>Average rating: {bookData.avg}</p>}
          <div style={{ width: "50%" }}>
            <canvas id='Chart'></canvas>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitReview();
              submitRating();
            }}
          >
            <input
              type='text'
              value={reviewData}
              onChange={(e) => {
                updateReviewData(e.target.value);
              }}
            ></input>

            <select
              value={rating}
              onChange={(e) => {
                updateRating(e.target.value);
              }}
            >
              <option value='1'>1</option>
              <option value='2'>2</option>
              <option value='3'>3</option>
              <option value='4'>4</option>
              <option value='5'>5</option>
            </select>

            <input type='submit' value='Submit'></input>
          </form>
          <button onClick={addToReadingHistory}>Add to reading history</button>
        </div>
      ) : null}
    </div>
  );
}

export default Book;

import React, { useEffect, useState } from "react";
import "./home.css";
import axios from "axios";
import { Popup } from "../popup/popup";

const Home = (setAuth) => {
  const [bookData, setbookData] = useState([]);
  const [editBookDetails, setEditBookDetails] = useState({});
  const [viewBookDetails, setviewBookDetails] = useState({});
  const [open, setOpen] = useState(false);
  const [buttonName, setButtonName] = useState({});

  let token = JSON.parse(localStorage.getItem("jwtoken"));

  const getAllBooks = async () => {
    try {
      const bookList = await axios.get("http://localhost:3001/books", {
        headers: {
          "x-api-key": token,
        },
      });
      console.log(bookList, "book response");
      setbookData(bookList.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  let deleteBook = async (elem) => {
    try {
      const res = await axios.delete(
        `http://localhost:3001/books/${elem._id}`,
        { headers: { "x-api-key": `${token}` } }
      );
      console.log(res, "deletebook response");
      if (res.data.status === true) {
        getAllBooks();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const logOut = async () => {
    try {
      localStorage.removeItem("jwtoken");
      setAuth.setAuth(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllBooks();
  }, []);

  return (
    <>
      <div className="homeParent">
        <div className="navbarCover">
          <div className="listbar">
            <h2> Book Management </h2>
            <div className="buttonsection">
              <button
                className="viewButton"
                onClick={() => {
                  setOpen(true);
                  setButtonName("Create");
                  setEditBookDetails({});
                  setviewBookDetails({});
                }}
              >
                <i className="zmdi zmdi-plus">&nbsp;</i> Book
              </button>
              {open ? (
                <Popup
                  closePopup={() => setOpen(false)}
                  refreshList={getAllBooks}
                  editBookDetails={editBookDetails}
                  viewBookDetails={viewBookDetails}
                  buttonName={buttonName}
                />
              ) : null}
              <button className="viewButton" onClick={logOut}>
                Logout
              </button>
            </div>
          </div>
        </div>
        <div className="table-cover">
          <table className="output-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Excerpt</th>
                <th>Category</th>
                <th>Sub Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookData.map(
                (elem, i) =>
                  elem && (
                    <tr key={i}>
                      <td>{elem.title}</td>
                      <td>{elem.excerpt}</td>
                      <td>{elem.category}</td>
                      <td>{elem.subcategory}</td>
                      <td>
                        <i
                          className="zmdi zmdi-delete zmdi-hc-lg icon"
                          onClick={() => deleteBook(elem)}
                        >
                          &nbsp;&nbsp;&nbsp;{" "}
                        </i>
                        <i
                          className="zmdi zmdi-edit zmdi-hc-lg icon"
                          onClick={() => {
                            setOpen(true);
                            setEditBookDetails(elem);
                            setviewBookDetails({});
                            setButtonName("Update");
                          }}
                        >
                          &nbsp;&nbsp;&nbsp;{" "}
                        </i>
                        <i
                          className="zmdi zmdi-eye zmdi-hc-lg icon"
                          onClick={() => {
                            setOpen(true);
                            setviewBookDetails(elem);
                            setButtonName("View");
                          }}
                        >
                          &nbsp;&nbsp;&nbsp;{" "}
                        </i>
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Home;

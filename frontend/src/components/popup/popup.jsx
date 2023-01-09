import React, { useEffect, useState } from "react";
import axios from "axios";
import "./popup.css";

export const Popup = ({
  closePopup,
  refreshList,
  editBookDetails,
  buttonName,
  viewBookDetails,
}) => {
  const [editStatus, setEditStatus] = useState(false);
  const [values, setValues] = useState({
    title: "",
    excerpt: "",
    ISBN: "",
    releasedAt: "",
    subcategory: "",
    category: "",
  });

  let token = JSON.parse(localStorage.getItem("jwtoken"));

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const createBook = async (data) => {
    try {
      let create = await axios.post(`http://localhost:3001/books`, data, {
        headers: {
          "x-api-key": token,
        },
      });
      if (create.status === 201) {
        refreshList();
      }
    } catch (err) {
      console.log(err);
    }
  };

  let updateBook = async (data, id) => {
    try {
      let token = JSON.parse(localStorage.getItem("jwtoken"));
      let update = await axios.put(`http://localhost:3001/books/${id}`, data, {
        headers: {
          "x-api-key": token,
        },
      });
      if (update.status === 200) {
        refreshList();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (editStatus) {
      updateBook(values, editBookDetails._id);
    } else {
      createBook({ ...values, userId: "63b94acdda972c82b4f98bba" });
    }
    closePopup(false);
  };

  useEffect(() => {
    console.log(editBookDetails);
    if (Object.entries(editBookDetails).length > 0) {
      editBookDetails.releasedAt = new Date(editBookDetails.releasedAt)
        .toJSON()
        .split("T")[0];
      setValues(editBookDetails);
      setEditStatus(true);
    }
  }, []);

  if (Object.entries(viewBookDetails).length > 0) {
    return (
      <div className="popup-container">
        <div className="bookForm">
          <div className="headCover">
            <h3>
              {" "}
              {buttonName} {viewBookDetails.title} Details
            </h3>
            <button className="closeButton" onClick={closePopup}>
              X
            </button>
          </div>
          <br />
          <div className="viewBookDetails">
            <div className="viewFields">
              <span>Title : </span>
              <p>&nbsp; {viewBookDetails.title}</p>
            </div>
            <br />
            <div className="viewFields">
              <span>Excerpt :</span>
              <p>&nbsp; {viewBookDetails.excerpt}</p>
            </div>
            <br />
            <div className="viewFields">
              <span>ISBN : </span>
              <p>&nbsp; {viewBookDetails.ISBN}</p>
            </div>
            <br />
            <div className="viewFields">
              <span>Category : </span>
              <p>&nbsp; {viewBookDetails.category}</p>
            </div>
            <br />
            <div className="viewFields">
              <span>Subcategory : </span>
              <p>&nbsp; {viewBookDetails.subcategory}</p>
            </div>
            <br />
            <div className="viewFields">
              <span>ReleasedAt : </span>
              <p>&nbsp; {viewBookDetails.releasedAt}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="popup-container">
        <form className="bookForm">
          <div className="headCover">
            <h3> {buttonName} Book</h3>
            <button className="closeButton" onClick={closePopup}>
              X
            </button>
          </div>

          <label className="bookInputLabel">Title</label>
          <input
            className="bookInput"
            type="text"
            placeholder="Title"
            name="title"
            value={values.title}
            onChange={handleChange}
          />

          <label className="bookInputLabel">Excerpt</label>
          <input
            className="bookInput"
            type="text"
            placeholder="Excerpt"
            name="excerpt"
            value={values.excerpt}
            onChange={handleChange}
          />

          {!editStatus && (
            <div>
              <label className="bookInputLabel">Category</label>
              <input
                className="bookInput"
                type="text"
                placeholder="Category"
                name="category"
                value={values.category}
                onChange={handleChange}
              />
            </div>
          )}

          {!editStatus && (
            <div>
              <label className="bookInputLabel">Sub Category</label>
              <input
                className="bookInput"
                type="text"
                placeholder="Sub Category"
                name="subcategory"
                value={values.subcategory}
                onChange={handleChange}
              />
            </div>
          )}

          <label className="bookInputLabel">ISBN</label>
          <input
            className="bookInput"
            type="text"
            placeholder="ISBN"
            name="ISBN"
            value={values.ISBN}
            onChange={handleChange}
          />

          <label className="bookInputLabel">Released At</label>
          <input
            className="bookInput"
            type="date"
            placeholder="Released At"
            name="releasedAt"
            value={values.releasedAt}
            onChange={handleChange}
          />
          <button className="submitStudent" onClick={handleFormSubmit}>
            {buttonName}
          </button>
        </form>
      </div>
    </>
  );
};

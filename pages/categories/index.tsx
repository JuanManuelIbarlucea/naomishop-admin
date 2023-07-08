import { DeleteIcon, EditIcon } from "@/components/Icons";
import { FormEvent, RefAttributes, useEffect, useState } from "react";

import { CategoryType } from "@/types";
import axios from "axios";
import { withSwal } from "react-sweetalert2";

export function Categories({ swal }: { swal: any }) {
  const [name, setName] = useState<string>("");
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [parent, setParent] = useState<string>("");
  const [editedCategory, setEditedCategory] = useState<CategoryType | null>(
    null
  );

  async function saveCategory(ev: FormEvent) {
    ev.preventDefault();
    const data = { name, parent: parent !== "" ? parent : null };
    if (editedCategory) {
      await axios.put("/api/categories", {
        ...data,
        categoryId: editedCategory._id,
      });
      setEditedCategory(null);
    } else {
      await axios.post("/api/categories", data);
    }
    setName("");
    setParent("");
    fetchCategories();
  }

  function fetchCategories() {
    axios.get("/api/categories").then((response) => {
      setCategories(response.data);
    });
  }

  function editCategory(category: CategoryType) {
    setEditedCategory(category);
    setName(category.name);
    setParent(category.parent?._id || " ");
  }

  function deleteCategory(category: CategoryType) {
    swal
      .fire({
        title: "Are you sure?",
        text: `Do you want to delete ${category.name}?`,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes, delete!",
        confirmButtonColor: "#d55",
        reverseButtons: true,
      })
      .then((result: any) => {
        const { isConfirmed } = result;
        if (isConfirmed) {
          axios.delete(`/api/categories?id=${category._id}`);
          fetchCategories();
          setEditedCategory(null);
        }
      });
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      <h1>Categories</h1>
      <label>
        {editedCategory
          ? `Edit category ${editedCategory.name}`
          : "New category"}
      </label>
      <form className="flex gap-1 w-1/2" onSubmit={saveCategory}>
        <input
          className="mb-0"
          value={name}
          type="text"
          placeholder="Category name"
          onChange={(ev) => setName(ev.target.value)}
        />
        <select
          onChange={(ev) => setParent(ev.target.value)}
          className="mb-0"
          value={parent}
        >
          <option value={""}>No parent category.</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        <button type="submit" className="btn-green">
          Save
        </button>
      </form>
      <table className="basic mt-2">
        <thead>
          <tr>
            <td>Category name</td>
            <td>Parent category</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => {
            return (
              <tr key={category._id}>
                <td>{category.name}</td>
                <td>{category.parent?.name}</td>
                <td>
                  <div className="flex">
                    <button
                      className="btn-primary flex p-1"
                      onClick={() => editCategory(category)}
                    >
                      <EditIcon />
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCategory(category)}
                      className="btn-red flex p-1 "
                    >
                      <DeleteIcon />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default withSwal(({ swal }: { swal: any }, ref: RefAttributes<any>) => (
  <Categories swal={swal} />
));

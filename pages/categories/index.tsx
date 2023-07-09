import { CategoryType, ProductPropertyType } from "@/types";
import { DeleteIcon, EditIcon } from "@/components/Icons";
import { FormEvent, RefAttributes, useEffect, useState } from "react";

import axios from "axios";
import { withSwal } from "react-sweetalert2";

export function Categories({ swal }: { swal: any }) {
  const [name, setName] = useState<string>("");
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [properties, setProperties] = useState<ProductPropertyType[]>([]);
  const [parent, setParent] = useState<string>("");
  const [editedCategory, setEditedCategory] = useState<CategoryType | null>(
    null
  );

  async function saveCategory(ev: FormEvent) {
    ev.preventDefault();
    const data = {
      name,
      parent: parent.trim() !== "" ? parent : null,
      properties: properties.map(({ name, values }: ProductPropertyType) => ({
        name,
        values: (values as string).split(","),
      })),
    };
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
    setProperties([]);
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
    setParent(category.parent?._id || "");
    const editedProperties = category.properties.map(({ name, values }) => ({
      name,
      values: (values as string[]).join(","),
    }));
    setProperties(editedProperties || []);
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

  function addProperty() {
    setProperties((prev: ProductPropertyType[]) => {
      return [...prev, { name: "", values: "" }];
    });
  }

  function handlePropertyNameChange(index: number, newName: string) {
    setProperties((prev: ProductPropertyType[]) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  }

  function handlePropertyValuesChange(index: number, newValues: string) {
    setProperties((prev: ProductPropertyType[]) => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  }

  function removeProperty(index: number) {
    setProperties((prev: ProductPropertyType[]) => {
      return [...prev].filter((p, i) => i !== index);
    });
  }

  function cancelEdit() {
    setEditedCategory(null);
    setName("");
    setParent("");
    setProperties([]);
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
      <form className="w-1/2" onSubmit={saveCategory}>
        <div className="flex gap-1">
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
        </div>
        <div className="mb-2">
          <label className="block">Properties</label>
          <button
            onClick={addProperty}
            type="button"
            className="btn-default text-sm mb-2"
          >
            Add new property
          </button>
          {properties.map((property: ProductPropertyType, i: number) => {
            return (
              <div className="flex gap-1 mb-2" key={i}>
                <input
                  type="text"
                  value={property.name}
                  className="mb-0"
                  onChange={(ev) =>
                    handlePropertyNameChange(i, ev.target.value)
                  }
                  placeholder="property name (example: color)"
                />
                <input
                  type="text"
                  value={property.values}
                  className="mb-0"
                  onChange={(ev) =>
                    handlePropertyValuesChange(i, ev.target.value)
                  }
                  placeholder="values (comma separated)"
                />
                <button
                  onClick={() => removeProperty(i)}
                  className="btn-red"
                  type="button"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
        <button type="submit" className="btn-green">
          Save
        </button>
        {editedCategory && (
          <button type="button" className="btn-default" onClick={cancelEdit}>
            Cancel
          </button>
        )}
      </form>
      {!editedCategory && (
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
      )}
    </>
  );
}

export default withSwal(({ swal }: { swal: any }, ref: RefAttributes<any>) => (
  <Categories swal={swal} />
));

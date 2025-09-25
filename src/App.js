import Header from "./Header";
import SearchItem from "./SearchItem";
import AddItem from "./AddItem";
import Content from "./Content";
import Footer from "./Footer";
import { useEffect, useState } from "react";
import apiRequest from "./apiRequest";

function App() {
  const API_URL = "http://localhost:3500/items";
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState();
  const [search, setSearch] = useState("");
  const [fetchError, setFetchError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const localItems = [
    {
      id: "1",
      checked: false,
      item: "Almonds, Unsalted, in the blue bag",
    },
    {
      id: "2",
      checked: true,
      item: "Pizza",
    },
    {
      id: "3",
      checked: false,
      item: "Bread",
    },
    {
      id: "4",
      checked: false,
      item: "Cookies",
    },
    {
      id: "5",
      checked: false,
      item: "Cake",
    },
  ];
  if (
    !localStorage.getItem("shoppinglist") ||
    localItems.length > JSON.parse(localStorage.getItem("shoppinglist")).length
  ) {
    localStorage.setItem("shoppinglist", JSON.stringify(localItems));
  }

  useEffect(() => {
    const fetchItems = async () => {
      try {
        // const response = await fetch(API_URL);
        // if (!response.ok) throw Error("Did not receive expected data");
        // const listItems = await response.json();
        const listItems = localStorage.getItem("shoppinglist")
          ? JSON.parse(localStorage.getItem("shoppinglist"))
          : [];
        setItems(listItems);
        setFetchError(null);
      } catch (err) {
        setFetchError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    setTimeout(() => {
      (async () => {
        await fetchItems();
      })();
    }, 2000);
  }, [items]);

  const setAndSaveItems = (listItems) => {
    localStorage.setItem("shoppinglist", JSON.stringify(listItems));
    setItems(listItems);
  };

  const addNewItem = async (item) => {
    const newItem = {
      id: items.length
        ? (parseInt(items[items.length - 1].id) + 1).toString()
        : "1",
      checked: false,
      item: item,
    };
    const listItems = [...items, newItem];
    setAndSaveItems(listItems);
    setNewItem("");

    // const postOptions = {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(newItem),
    // };
    // const result = await apiRequest(API_URL, postOptions);
    // if (result) {
    //   setFetchError(result);
    // } else {
    //   console.log("New item added:", newItem);
    // }
  };

  const handleCheck = async (id) => {
    const listItems = items.map((item) => {
      if (item.id === id) {
        return { ...item, checked: !item.checked };
      }
      return item;
    });
    setAndSaveItems(listItems);

    // const updatedItem = listItems.find((item) => item.id === id);
    // const updateOptions = {
    //   method: "PATCH",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ checked: updatedItem.checked }),
    // };

    // const result = await apiRequest(`${API_URL}/${id}`, updateOptions);
    // if (result) {
    //   setFetchError(result);
    // } else {
    //   console.log(`Item with id ${id} updated`, updatedItem);
    // }
  };

  const handleDelete = async (id) => {
    const listItems = items.filter((item) => item.id !== id);
    setAndSaveItems(listItems);
    // const deleteOptions = {
    //   method: "DELETE",
    // };
    // const result = await apiRequest(`${API_URL}/${id}`, deleteOptions);
    // if (result) {
    //   setFetchError(result);
    // } else {
    //   console.log(`Item with id ${id} deleted`);
    // }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", newItem);
    if (!newItem) return;
    addNewItem(newItem);
    console.log("Item added:", newItem);
    setNewItem("");
  };

  return (
    <div className="App">
      <Header title="Groceries" />
      <AddItem
        newItem={newItem}
        setNewItem={setNewItem}
        handleSubmit={handleSubmit}
      />
      <SearchItem search={search} setSearch={setSearch} />
      <main>
        {isLoading && <p>Loading items...</p>}
        {fetchError && <p style={{ color: "red" }}>{`Error: ${fetchError}`}</p>}
        {!fetchError && !isLoading && (
          <Content
            items={items.filter((item) =>
              item.item.toLowerCase().includes(search.toLowerCase())
            )}
            handleCheck={handleCheck}
            handleDelete={handleDelete}
          />
        )}
      </main>
      <Footer length={items.length} />
    </div>
  );
}

export default App;

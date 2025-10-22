import { useState, useEffect } from "react";
import { fetchItems, addItem } from "../services/mainService";
import Navbar from "../components/NavBar";
import ItemCard from "../components/ItemCard";
import Pagination from "../components/Pagination";

export default function MainPage() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortOrder, setSortOrder] = useState("asc");

  const loadItems = async () => {
    const data = await fetchItems();
    setItems(data);
  };

  useEffect(() => { loadItems(); }, []);

  const handleAdd = async () => {
    try {
      if (!name || !value) {
        setError("All fields are required");
        return;
      }
      await addItem(name, parseInt(value));
      setName(""); setValue(""); setError("");
      loadItems();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const sortedItems = [...items].sort((a, b) =>
    sortOrder === "asc" ? a.value - b.value : b.value - a.value
  );

  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = sortedItems.slice(indexOfFirst, indexOfLast);

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl mb-4">Add New Item</h2>
        <div className="flex gap-2 mb-4">
          <input type="text" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} className="border p-2"/>
          <input type="number" placeholder="Value" value={value} onChange={e=>setValue(e.target.value)} className="border p-2"/>
          <button onClick={handleAdd} className="bg-blue-500 text-white p-2 rounded">Add</button>
        </div>
        {error && <p className="text-red-500 mb-2">{error}</p>}

        <div className="flex justify-between mb-2">
          <h2 className="text-2xl">Items</h2>
          <button onClick={()=>setSortOrder(sortOrder==="asc"?"desc":"asc")} className="bg-gray-300 p-2 rounded">
            Sort {sortOrder === "asc" ? "↑" : "↓"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentItems.map(item => <ItemCard key={item.id} item={item} />)}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
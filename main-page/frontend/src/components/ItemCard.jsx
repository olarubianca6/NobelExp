export default function ItemCard({ item }) {
  return (
    <div className="border p-4 rounded shadow">
      <h2 className="font-bold">{item.name}</h2>
      <p>Value: {item.value}</p>
    </div>
  );
}
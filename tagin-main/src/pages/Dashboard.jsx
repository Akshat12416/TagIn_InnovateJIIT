import { useEffect, useState } from "react";
import axios from "axios";


export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://10.103.1.168:5000/api/products")
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch data", err);
        setLoading(false);
      });
  }, []);

  return (
    <div
      className="layout"
      style={{
        minHeight: "100vh",
        backgroundColor: "#fff",
        backgroundImage:
          "linear-gradient(90deg, #f7f7f7 1px, transparent 1px), linear-gradient(180deg, #f7f7f7 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        backgroundAttachment: "fixed",
      }}
    >
      
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <div className="card" style={{ width: "100%", maxWidth: 1100, margin: "0 auto" }}>
          <div
            style={{
              fontWeight: 700,
              marginBottom: 8,
              fontSize: 22,
              textAlign: "center",
            }}
          >
            Manufacturer Dashboard
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "20px" }}>Loading products...</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Serial Number</th>
                  <th>Model Number</th>
                  <th>Type</th>
                  <th>Color</th>
                  <th>Manufacture Date</th>
                  <th>Token ID</th>
                  <th>Metadata Hash</th>
                  <th>Manufacturer</th>
                  <th>Owner</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={i}>
                    <td>{p.name}</td>
                    <td>{p.serial}</td>
                    <td>{p.model}</td>
                    <td>{p.type}</td>
                    <td>{p.color}</td>
                    <td>{p.date}</td>
                    <td>{p.tokenId}</td>
                    <td className="break-all">{p.metadataHash}</td>
                    <td className="break-all">{p.manufacturer}</td>
                    <td className="break-all">{p.owner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

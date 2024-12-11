import Image from "next/image";

export default async function Home() {
  try {
    // Gọi API với URL tương đối
    let collectionsR = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/collection`, {
      cache: "no-store", // Tắt caching để đảm bảo lấy dữ liệu mới nhất
    });

    if (!collectionsR.ok) {
      throw new Error("Failed to fetch collections");
    }

    let collections = await collectionsR.json();

    return (
      <div style={{ padding: "20px" }}>
        <h1>Danh sách Collections</h1>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {collections.map(({ _id, label }) => (
            <li
              key={_id}
              style={{
                margin: "10px 0",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            >
              {label}
            </li>
          ))}
        </ul>
      </div>
    );
  } catch (error) {
    return (
      <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
        <h2>Không thể tải dữ liệu</h2>
        <p>Vui lòng kiểm tra API hoặc thử lại sau.</p>
      </div>
    );
  }
}

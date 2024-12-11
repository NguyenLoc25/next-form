export default function QuestionLayout({ children }) {
    return (
      <div style={{ margin: "20px", fontFamily: "Arial, sans-serif" }}>
        <header style={{ backgroundColor: "#f4f4f4", padding: "1rem", borderRadius: "8px" }}>
          <h2>Hệ thống Câu hỏi</h2>
        </header>
        <main style={{ marginTop: "1rem" }}>{children}</main>
        <footer style={{ marginTop: "1rem", textAlign: "center", color: "#888" }}>
          <p>&copy; 2024 Câu hỏi trực tuyến</p>
        </footer>
      </div>
    );
  }
  
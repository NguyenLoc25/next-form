"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function ItemPage() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState([]);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/question/${id}`);
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setQuestion(data);
        } else {
          setErrorMessage("Câu hỏi không tồn tại.");
        }
      } catch (error) {
        setErrorMessage("Có lỗi xảy ra khi tải câu hỏi.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestion();
  }, [id]);

  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    setSelectedAnswers((prevSelectedAnswers) => {
      if (prevSelectedAnswers.includes(value)) {
        return prevSelectedAnswers.filter((answer) => answer !== value);
      } else {
        return [...prevSelectedAnswers, value];
      }
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const collectionId = id;
    const answers = selectedAnswers;

    if (!collectionId || !answers.length) {
      alert("Vui lòng điền đầy đủ thông tin khảo sát.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/result", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          collectionId,
          answers,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Cảm ơn bạn đã tham gia khảo sát!");
      } else {
        alert(data.error || "Có lỗi xảy ra.");
      }
    } catch (error) {
      console.error("Error submitting survey:", error);
      alert("Có lỗi xảy ra khi gửi kết quả khảo sát.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Chi tiết câu hỏi</h1>

      {isLoading ? (
        <p style={styles.loading}>Đang tải...</p>
      ) : errorMessage ? (
        <p style={styles.errorMessage}><strong>{errorMessage}</strong></p>
      ) : (
        <>
          <div style={styles.questionDetails}>
            <p><strong>ID:</strong> {id}</p>
            <p><strong>Nội dung câu hỏi:</strong> {question?.question_header || "Không tìm thấy nội dung."}</p>
            <p><strong>Loại câu hỏi:</strong> {question?.question_type || "Không có thông tin."}</p>
            <p><strong>Câu hỏi yêu cầu:</strong> {question?.question_required ? "Có" : "Không"}</p>
          </div>

          {question?.question_type === "checkbox" && (
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.checkboxContainer}>
                {question?.question_answer.length > 0 ? (
                  question?.question_answer.map((answer, index) => (
                    <div key={index} style={styles.checkboxItem}>
                      <label style={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          value={answer}
                          onChange={handleCheckboxChange}
                          checked={selectedAnswers.includes(answer)}
                          style={styles.checkboxInput}
                        />
                        {answer}
                      </label>
                    </div>
                  ))
                ) : (
                  <p>Không có câu trả lời.</p>
                )}
              </div>
              <button type="submit" style={styles.submitButton}>Gửi câu trả lời</button>
            </form>
          )}
        </>
      )}
    </div>
  );
}



const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "2rem",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  title: {
    textAlign: "center",
    color: "#0070f3",
    fontSize: "2rem",
    marginBottom: "1.5rem",
  },
  loading: {
    textAlign: "center",
    fontSize: "1.2rem",
    color: "#555",
  },
  errorMessage: {
    color: "red",
    textAlign: "center",
    fontSize: "1.2rem",
  },
  questionDetails: {
    marginBottom: "1.5rem",
    fontSize: "1.1rem",
    lineHeight: "1.6",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    marginTop: "1rem",
  },
  checkboxContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    textAlign: "left",
  },
  checkboxItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  checkboxLabel: {
    fontSize: "1rem",
    display: "flex",
    alignItems: "center",
  },
  checkboxInput: {
    marginRight: "0.5rem",
  },
  submitButton: {
    backgroundColor: "#0070f3",
    color: "#fff",
    border: "none",
    padding: "0.8rem 2rem",
    borderRadius: "4px",
    fontSize: "1.1rem",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  submitButtonHover: {
    backgroundColor: "#005bb5",
  },
};

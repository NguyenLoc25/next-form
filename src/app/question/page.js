import './page.scss';
export default function QuestionPage() {
    // Dữ liệu về các collection, mỗi collection có nhiều câu hỏi
    const collections = [
      {
        collection_id: "60c72b2f9b1d8b46c7c3c8e7",
        collection_name: "Collection 1",
        questions: [
          { id: "6755bbc427963ef60605bc51", title: "Câu hỏi số 1" },
          { id: "6755c3dffc6d47be050790ad", title: "Câu hỏi số 2" },
        ],
      },
      {
        collection_id: "60c72b2f9b1d8b46c7c3c8e8",
        collection_name: "Collection 2",
        questions: [
          { id: "60c72b2f9b1d8b46c7c3c8e9", title: "Câu hỏi số 3" },
          { id: "60c72b2f9b1d8b46c7c3c8ea", title: "Câu hỏi số 4" },
        ],
      },
      {
        collection_id: "60c72b2f9b1d8b46c7c3c8e5",
        collection_name: "Collection 3",
        questions: [
          { id: "60c72b2f9b1d8b46c7c3c8eb", title: "Câu hỏi số 5" },
        ],
      },
    ];
  
    return (
      <div>
        <h1 style={{ color: "#333" }}>Danh sách các Collection và câu hỏi</h1>
        {collections.map((collection) => (
          <div key={collection.collection_id} style={{ marginBottom: "30px" }}>
            <h2 style={{ color: "#0070f3" }}>
              {collection.collection_name}
            </h2>
            <ul style={{ listStyle: "none", paddingLeft: "20px" }}>
              {collection.questions.map((q) => (
                <li key={q.id} style={{ marginBottom: "10px" }}>
                  <a
                    href={`/question/${q.id}`}
                    style={{ color: "#0070f3", textDecoration: "none" }}
                  >
                    {q.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }
  
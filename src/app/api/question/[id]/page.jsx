export default function ItemPage({ params }) {
    const { id } = params;
  
    return (
      <div>
        <h1>Item ID: {id}</h1>
      </div>
    );
  }
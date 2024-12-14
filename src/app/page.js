import Image from "next/image";

export default async function Home() {
  let collectionsR = await fetch("http://localhost:3000/api/collection");
  let collections = await collectionsR.json();
  return (
    <div>
      <ul>
      {
        collections.map(({_id,label})=><li key={_id}>{label}</li>)
      }
      </ul>
    </div>
  );
}
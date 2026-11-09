import Image from "next/image";

export default function Loading() {
  return <div className="loading-panel" role="status"><Image className="loading-mark" src="/brand/angel-option-a.svg" alt="" width={40} height={40} unoptimized /><p>Loading archive…</p></div>;
}

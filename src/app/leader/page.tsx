import CardReader from "@/components/CardReader";
import { getCollection } from "@/data/collections";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "領袖版經文卡 · 勇士班經文" };

export default function Page() {
  return <CardReader collection={getCollection("leader")!} />;
}

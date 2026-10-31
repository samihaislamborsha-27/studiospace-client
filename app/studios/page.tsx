import type { Metadata } from "next";
import ExploreStudios from "@/components/studios/ExploreStudios";

export const metadata: Metadata = {
  title: "Explore Studios",
  description:
    "Discover creative studios for photography, filmmaking, podcasting, music and more.",
};

export default function StudiosPage() {
  return <ExploreStudios />;
}

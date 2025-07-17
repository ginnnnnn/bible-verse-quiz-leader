import Link from "next/link";
import { FunctionComponent } from "react";

interface BackToRootProps {}

const BackToRoot: FunctionComponent<BackToRootProps> = () => {
  return (
    <Link href="/" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
      重新開始
    </Link>
  );
};

export default BackToRoot;

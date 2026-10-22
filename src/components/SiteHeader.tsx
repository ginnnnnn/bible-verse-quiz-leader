import Link from "next/link";
import Icon from "./Icon";
import { InstallButton } from "./WebAppProvider";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand" aria-label="勇士班經文，返回首頁">
          <span className="brand-mark">
            <Icon name="book" width="25" height="25" />
          </span>
          <span>
            <strong>勇士班經文</strong>
            <span className="brand-caption">讓 真 理 走 進 日 常</span>
          </span>
        </Link>
        <div className="header-actions">
          <InstallButton />
          <Link href="/" className="header-library" aria-label="返回經文卡收藏">
            <Icon name="grid" />
            <span>經文卡收藏</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

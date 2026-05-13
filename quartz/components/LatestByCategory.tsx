import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative } from "../util/path"
import { classNames } from "../util/lang"
import style from "./styles/recentNotes.scss"

interface Category {
  slug: string
  icon: string
  label: string
}

const defaultCategories = (): Category[] => [
  { slug: "AI科技动态", icon: "🤖", label: "AI动态" },
  { slug: "GitHub-Trending", icon: "💻", label: "GitHub" },
  { slug: "时政要闻", icon: "📰", label: "时政" },
]

const slugDate = (s: string): number => {
  const m = s.match(/(\d{4}-\d{2}-\d{2})/)
  return m ? +new Date(m[1]) : 0
}

export default (() => {
  const LatestByCategory: QuartzComponent = ({
    allFiles,
    fileData,
    displayClass,
  }: QuartzComponentProps) => {
    const categories = defaultCategories()

    return (
      <div class={classNames(displayClass, "recent-notes")}>
        <h3>📅 今日内容</h3>
        <ul class="recent-ul">
          {categories.map((cat) => {
            const latest = allFiles
              .filter((f) => f.slug?.startsWith(cat.slug as any) && f.slug !== cat.slug)
              .sort((a, b) => slugDate(b.slug!) - slugDate(a.slug!))[0]

            if (!latest) return null

            const title = (latest.frontmatter?.title ?? latest.slug?.split("/").pop() ?? "").slice(-5)

            return (
              <li class="recent-li">
                <div class="section">
                  <div class="desc">
                    <h3>
                      <a
                        href={resolveRelative(fileData.slug!, latest.slug!)}
                        class="internal"
                      >
                        {cat.icon} {cat.label} · {title}
                      </a>
                    </h3>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  LatestByCategory.css = style
  return LatestByCategory
}) satisfies QuartzComponentConstructor

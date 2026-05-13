import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { Date, getDate } from "./Date"
import { GlobalConfiguration } from "../cfg"
import { classNames } from "../util/lang"
import style from "./styles/recentNotes.scss"

interface Category {
  slug: string
  icon: string
  label: string
}

const defaultCategories = (): Category[] => [
  { slug: "AI科技动态", icon: "🤖", label: "AI科技动态" },
  { slug: "GitHub Trending", icon: "💻", label: "GitHub Trending" },
  { slug: "时政要闻", icon: "📰", label: "时政要闻" },
]

export default (() => {
  const LatestByCategory: QuartzComponent = ({
    allFiles,
    fileData,
    displayClass,
    cfg,
  }: QuartzComponentProps) => {
    const categories = defaultCategories()

    return (
      <div class={classNames(displayClass, "recent-notes")}>
        <h3>📅 今日内容</h3>
        <ul class="recent-ul">
          {categories.map((cat) => {
            const latest = allFiles
              .filter((f) => f.slug?.startsWith(cat.slug as any) && f.slug !== cat.slug)
              .sort((a, b) => {
                const da = a.dates?.modified ?? a.dates?.created ?? new Date(0)
                const db = b.dates?.modified ?? b.dates?.created ?? new Date(0)
                return db.getTime() - da.getTime()
              })[0]

            if (!latest) return null

            const title = latest.frontmatter?.title ?? latest.slug?.split("/").pop() ?? ""
            const date = getDate(cfg, latest)

            return (
              <li class="recent-li">
                <div class="section">
                  <div class="desc">
                    <h3>
                      <a
                        href={resolveRelative(fileData.slug!, latest.slug!)}
                        class="internal"
                      >
                        {cat.icon} {cat.label} → {title}
                      </a>
                    </h3>
                  </div>
                  {date && (
                    <p class="meta">
                      <Date date={date} locale={cfg.locale} />
                    </p>
                  )}
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

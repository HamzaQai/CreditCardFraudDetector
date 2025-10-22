import { getCategoryColor, getCategoryLabel } from '../utils/helpers'

function CategoryBadge({ category }) {
  return (
    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(category)}`}>
      {getCategoryLabel(category)}
    </span>
  )
}

export default CategoryBadge

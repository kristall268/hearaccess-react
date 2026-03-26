export default function Pagination({ page, totalPages, total, pageSize, onPageChange }) {
  if (totalPages <= 1) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      pages.push(i);
    } else if (i === page - 2 || i === page + 2) {
      pages.push('...');
    }
  }

  return (
    <div className="pagination">
      <div className="pagination-info">Showing {from}–{to} of {total}</div>
      <div className="pagination-pages">
        <button
          className={`page-btn${page === 1 ? ' disabled' : ''}`}
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        >‹</button>
        {pages.map((p, idx) =>
          p === '...' ? (
            <span key={`e${idx}`} className="page-ellipsis">…</span>
          ) : (
            <button
              key={p}
              className={`page-btn${p === page ? ' active' : ''}`}
              onClick={() => onPageChange(p)}
            >{p}</button>
          )
        )}
        <button
          className={`page-btn${page === totalPages ? ' disabled' : ''}`}
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
        >›</button>
      </div>
    </div>
  );
}

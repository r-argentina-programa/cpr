import { useEffect, useState } from 'react';
import Pagination from 'react-bootstrap/Pagination';

export default function PaginationComponent({ numberOfProducts, page, setCurrentPage }) {
  const PRODUCTS_PER_PAGE = 3;
  const [paginationItems, setPaginationItems] = useState([]);
  let numberOfPaginationItems = Math.ceil(numberOfProducts / PRODUCTS_PER_PAGE);

  function setUpPagination() {
    const items = [];
    const MAX_PAGINATION_ITEMS = 2;
    numberOfPaginationItems = Math.ceil(numberOfProducts / PRODUCTS_PER_PAGE);
    let leftOffset = Number(page) - MAX_PAGINATION_ITEMS / 2;
    let leftOffsetAux = 0;
    if (leftOffset <= 0) {
      leftOffsetAux = -leftOffset;
      leftOffsetAux = leftOffset === 0 ? 1 : leftOffsetAux;
      leftOffset = 0;
    }
    const rightOffset = Number(page) + MAX_PAGINATION_ITEMS / 2 + leftOffsetAux;
    const rightOffsetAux = rightOffset > numberOfPaginationItems ? -1 : 0;
    const n = rightOffset <= numberOfPaginationItems ? rightOffset : numberOfPaginationItems;
    for (let i = leftOffset + rightOffsetAux || 1; i <= n; i += 1) {
      items.push(
        <Pagination.Item key={i} active={Number(page) === i} onClick={() => setCurrentPage(i)}>
          {i}
        </Pagination.Item>
      );
    }
    setPaginationItems(items);
  }

  useEffect(() => {
    setUpPagination();
  }, [numberOfProducts, page]);
  return (
    <Pagination>
      <Pagination.First onClick={() => setCurrentPage(1)} />
      <Pagination.Prev onClick={() => setCurrentPage(page - 1 > 1 ? page - 1 : 1)} />
      {paginationItems}
      <Pagination.Next
        onClick={() => {
          setCurrentPage(
            page + 1 < numberOfPaginationItems ? page + 1 : numberOfPaginationItems || 1
          );
        }}
      />
      <Pagination.Last onClick={() => setCurrentPage(numberOfPaginationItems || 1)} />
    </Pagination>
  );
}

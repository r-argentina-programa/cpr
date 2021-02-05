import { useEffect, useState } from 'react';
import Pagination from 'react-bootstrap/Pagination';

export default function PaginationComponent({ numberOfProducts, page, setCurrentPage }) {
  const PRODUCTS_PER_PAGE = 9;
  const [paginationItems, setPaginationItems] = useState([]);
  let numberOfPaginationItems = Math.ceil(numberOfProducts / PRODUCTS_PER_PAGE);

  const setUpPagination = () => {
    const items = [];
    const MAX_PAGINATION_ITEMS = 2;
    numberOfPaginationItems = Math.ceil(numberOfProducts / PRODUCTS_PER_PAGE);
    let leftOffset = Number(page) - MAX_PAGINATION_ITEMS / 2;
    let leftOffsetAux = 0;
    if (leftOffset <= 0) {
      leftOffsetAux = 1;
      leftOffset = 1;
    }
    let rightOffset = Number(page) + MAX_PAGINATION_ITEMS / 2;
    let rightOffsetAux = 0;
    if (rightOffset > numberOfPaginationItems) {
      rightOffsetAux = -1;
      rightOffset = numberOfPaginationItems;
    }
    const start = leftOffset + rightOffsetAux > 0 ? leftOffset + rightOffsetAux : 1;
    const end =
      rightOffset + leftOffsetAux < numberOfPaginationItems
        ? rightOffset + leftOffsetAux
        : numberOfPaginationItems;
    for (let i = start; i <= end; i += 1) {
      items.push(
        <Pagination.Item key={i} active={Number(page) === i} onClick={() => setCurrentPage(i)}>
          {i}
        </Pagination.Item>
      );
    }
    setPaginationItems(items);
  };

  useEffect(() => {
    setUpPagination();
  }, [numberOfProducts, page]);

  return (
    <Pagination data-cy="pagination-container">
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

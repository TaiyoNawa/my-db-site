import { HStack } from '@chakra-ui/react';
import { FC } from 'react';
import { AiOutlineEllipsis } from 'react-icons/ai';
import { SlArrowRight, SlArrowLeft } from 'react-icons/sl';
import ReactPaginate from 'react-paginate';

import { ArticleCardProps } from './ArticleCard';
import { usePagination } from '../../hooks/Pagination';

export type ArticlePaginationProps = {
  articles: ArticleCardProps[];
  onPageItemsChange: (items: ArticleCardProps[]) => void;
  //渡し方→ const [currentItems, setCurrentItems] = useState<ArticleCardProps[]>([]);
};

export const ArticlePagination: FC<ArticlePaginationProps> = ({
  articles,
  onPageItemsChange,
}) => {
  const { pageCount, handlePageClick } = usePagination(
    articles,
    onPageItemsChange
  );

  return (
    <HStack
      spacing={{ base: '2', sm: '5' }}
      justifyContent="center"
      py={5}
      sx={{
        '.pagination': {
          display: 'flex',
          alignItems: 'center',
          listStyle: 'none',
          color: 'white',
        },
        '.pagination li': {
          margin: '0 5px',
        },
        '.pagination a': {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: ['5px 8px', '8px 12px'],
          borderRadius: '5px',
          backgroundColor: 'gray.300',
          transition: 'background 0.2s',
          _hover: { backgroundColor: 'gray.400' },
          minHeight: ['34px', '40px'],
        },
        '.pagination .active a': {
          backgroundColor: 'black',
          fontWeight: 'bold',
        },
        '.pagination .previous a, .pagination .next a': {
          backgroundColor: 'gray.300',
          _hover: { backgroundColor: 'gray.400' },
          borderRadius: '100%',
          color: 'black',
        },
      }}
    >
      <ReactPaginate
        breakLabel={<AiOutlineEllipsis />}
        nextLabel={<SlArrowRight />}
        previousLabel={<SlArrowLeft />}
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        pageCount={pageCount}
        containerClassName="pagination"
        activeClassName="active"
        renderOnZeroPageCount={null}
      />
    </HStack>
  );
};

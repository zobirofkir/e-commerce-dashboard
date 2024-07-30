import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import TableTwo from './Product';

const Tables = () => {
  return (
    <>
      <Breadcrumb pageName="Products" />

      <div className="flex flex-col gap-10">
        <TableTwo />
      </div>
    </>
  );
};

export default Tables;

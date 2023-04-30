import { Table } from 'antd';
import { BaseCard } from '@app/components/common/BaseCard/BaseCard';

// grid columns
const columns = [
  {
    title: 'Order Id',
    dataIndex: 'OrderId',
    key: 'OrderId',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Amount',
    dataIndex: 'Amount',
    key: 'Amount',
  },
  {
    title: 'Status',
    dataIndex: 'Status',
    key: 'Status',
  },
];

// grid data source (will be removed after binding API)
const data = [
  {
    key: '1',
    OrderId: 100021,
    Amount: 10000,
    Status: 'Order Placed',
  },
  {
    key: '2',
    OrderId: 100022,
    Amount: 5000,
    Status: 'Order Placed',
  },
  {
    key: '3',
    OrderId: 100021,
    Amount: 8000,
    Status: 'Order Placed',
  },
];
const PaymentGrid = () => {
  return (
    <>
      <BaseCard title="Payment Details" padding="1.25rem">
        <Table columns={columns} dataSource={data} />
      </BaseCard>
    </>
  );
};

export default PaymentGrid;

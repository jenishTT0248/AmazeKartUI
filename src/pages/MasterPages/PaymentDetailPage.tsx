import React, { useEffect, useState } from 'react';
import { BasicTableRow, Pagination } from 'api/table.api';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { ColumnsType } from 'antd/es/table';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseCard } from '@app/components/common/BaseCard/BaseCard';
import usePaymentDetailService from '@app/hooks/custom/usePaymentDetailService';

const initialPagination: Pagination = {
  current: 1,
  pageSize: 5,
};

const PaymentDetailsPage: React.FC = () => {
  const [tableData, setTableData] = useState<{ data: BasicTableRow[]; loading: boolean }>({
    data: [],
    loading: false,
  });

  const { getAllAction } = usePaymentDetailService();

  useEffect(() => {
    getAll();
  }, []);

  const getAll = async () => {
    let data = await getAllAction();
    setTableData({ data: data, loading: false });
  };

  const columns: ColumnsType<BasicTableRow> = [
    {
      title: 'Order Id',
      dataIndex: 'OrderId',
      showSorterTooltip: false,
    },
    {
      title: 'Amount',
      dataIndex: 'Amount',
      showSorterTooltip: false,
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      showSorterTooltip: false,
    },
  ];

  return (
    <>
      <BaseCard title="Payment Details" padding="1.25rem">
        <BaseRow>
          <BaseCol xl={24} offset={21}></BaseCol>
        </BaseRow>

        <BaseRow style={{ paddingTop: '15px' }}>
          <BaseCol xl={24}>
            <BaseTable
              columns={columns}
              dataSource={tableData.data}
              pagination={initialPagination}
              loading={tableData.loading}
              scroll={{ x: 800 }}
              bordered
              rowKey="Id"
            />
          </BaseCol>
        </BaseRow>
      </BaseCard>
    </>
  );
};

export default PaymentDetailsPage;

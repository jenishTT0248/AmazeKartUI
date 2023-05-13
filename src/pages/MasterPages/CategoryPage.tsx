import React, { useEffect, useState, useCallback } from 'react';
import { BasicTableRow, getBasicTableData, Pagination, Tag } from 'api/table.api';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { ColumnsType } from 'antd/es/table';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { useTranslation } from 'react-i18next';
import { defineColorByPriority } from '@app/utils/utils';
import { notificationController } from 'controllers/notificationController';
import { Status } from '@app/components/profile/profileCard/profileFormNav/nav/payments/paymentHistory/Status/Status';
import { useMounted } from '@app/hooks/useMounted';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';

import * as S from '@app/pages/uiComponentsPages//UIComponentsPage.styles';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import useCategoryService from '../../hooks/custom/useCategoryService';
import { BaseCard } from '@app/components/common/BaseCard/BaseCard';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import Swal from 'sweetalert2';

const initialPagination: Pagination = {
  current: 1,
  pageSize: 5,
};

const CategoryPage: React.FC = () => {
  const [isBasicModalOpen, setIsBasicModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [categoryId, setCategoryId] = useState(0);
  const [tableData, setTableData] = useState<{ data: BasicTableRow[]; loading: boolean }>({
    data: [],
    loading: false,
  });

  const { getAllAction, getByIdAction, deleteAction, saveDataAction } = useCategoryService();

  useEffect(() => {
    getAll();
  }, []);

  const addCategory = () => {
    setIsBasicModalOpen(true);
    setCategoryId(0);
  };

  const getAll = async () => {
    let data = await getAllAction();
    setTableData({ data: data, loading: false });
  };

  const handleEditRow = async (record: any) => {
    setLoading(true);
    setCategoryId(record.Id);
    var category = await getByIdAction({ categoryId: record.Id });
    form.setFieldsValue({ categoryName: category.CategoryName, description: category.Description });
    setLoading(false);
    setIsBasicModalOpen(true);
  };

  const handleDeleteRow = async (id: number) => {
    Swal.fire({
      html: 'Are you sure you want to delete this Category?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: true,
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        setLoading(true);
        await deleteAction({ categoryId: id });
        await getAll();
        setLoading(false);
        notificationController.success({ message: 'Category deleted successfully' });
      }
    });
  };

  const columns: ColumnsType<BasicTableRow> = [
    {
      title: 'Category Name',
      dataIndex: 'CategoryName',
      sorter: (a: any, b: any) => a.CategoryName - b.CategoryName,
      showSorterTooltip: false,
    },
    {
      title: 'Description',
      dataIndex: 'Description',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      width: '15%',
      render: (text: string, record: any) => {
        return (
          <BaseSpace>
            <BaseButton type="ghost" onClick={() => handleEditRow(record)}>
              <EditOutlined key={`Edit_${record.Id}`} />
            </BaseButton>

            <BaseButton type="default" danger onClick={() => handleDeleteRow(record.Id)}>
              <DeleteOutlined key={`Delete_${record.Id}`} />
            </BaseButton>
          </BaseSpace>
        );
      },
    },
  ];

  const [form] = BaseForm.useForm();

  const onFinish = async (values: any) => {
    setLoading(true);
    let reqObj: any = {
      CategoryName: values.categoryName,
      Description: values.description ?? '',
      Id: categoryId,
    };

    await saveDataAction(reqObj);

    await getAll();
    setLoading(false);

    form.resetFields();
    setCategoryId(0);
    setIsBasicModalOpen(false);

    if (categoryId === 0) notificationController.success({ message: 'Category created successfully' });
    else notificationController.success({ message: 'Category updated successfully' });
  };

  return (
    <>
      <BaseCard title="Categories" padding="1.25rem">
        <BaseRow>
          <BaseCol xl={24} offset={21}>
            <BaseButton type="ghost" name="addCategory" onClick={addCategory}>
              Add Category
            </BaseButton>
          </BaseCol>
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

      <BaseModal
        title={categoryId ? 'Edit Category' : 'Add Category'}
        open={isBasicModalOpen}
        okText="Submit"
        onOk={form.submit}
        onCancel={() => setIsBasicModalOpen(false)}
      >
        <BaseForm form={form} layout="vertical" name="addCategoryForm" onFinish={onFinish}>
          <BaseForm.Item
            name="categoryName"
            label="Category Name"
            rules={[{ required: true, message: 'Category Name is required' }]}
          >
            <BaseInput maxLength={500} />
          </BaseForm.Item>
          <BaseForm.Item name="description" label="Description">
            <BaseInput.TextArea rows={5} maxLength={4000} showCount />
          </BaseForm.Item>
        </BaseForm>
      </BaseModal>
    </>
  );
};

export default CategoryPage;
